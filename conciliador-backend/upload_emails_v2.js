const { Command } = require("commander");
const { login } = require("../shared/service/authService");
const emailService = require("../shared/service/emailService");
const simUploadSrv = require("../shared/service/sim_uploadService");
const fs = require("fs");
const path = require("path");

// -----------------------------
// 🔹 Definição dos parâmetros CLI
// -----------------------------
const program = new Command();

program
    .name("upload_emails_v2")
    .description("Copia os anexos de e-mails para uma pasta de repositório")
    .version("2.0.0")
    .requiredOption("--id_usuario <id>", "ID do usuário para login")
    .requiredOption("--senha <senha>", "Senha do usuário para login")
    .option("--id_inicial <id>", "ID inicial do anexo (inclusivo)", (v) => parseInt(v, 10), 0)
    .option("--id_final <id>", "ID final do anexo (inclusivo)", (v) => parseInt(v, 10), 0)
    .option("--destino <pasta>", "Pasta de destino dos arquivos", "D:\\repositorio");

program.parse();

const opts = program.opts();

const ID_EMPRESA = 1;

// No banco o caminho vem como E:\SISTEMAS\O Conciliador - GP\SUP\ANEXOS EMAILS - ACORDOS\...
// Nesta máquina só vale o drive Y:, cujo conteúdo começa em ANEXOS EMAILS - ACORDOS
const PASTA_RAIZ = "ANEXOS EMAILS - ACORDOS";
const DRIVE_LOCAL = "Y:\\";

// Somente PDF e imagens serão copiados
const EXTENSOES_PERMITIDAS = [".pdf", ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tif", ".tiff", ".webp"];

// status_arquivos de psts_anexos: este script só grava o 3 (ignorado: não é PDF/imagem).
// Os demais (0, 1, 2) quem atualiza é a trigger de docs_gdrives.
const STATUS_IGNORADO = "3";

function extensaoPermitida(nomeArquivo) {
    return EXTENSOES_PERMITIDAS.includes(path.extname(nomeArquivo).toLowerCase());
}

function montarCaminhoAnexo(item) {
    // descarta tudo antes de "ANEXOS EMAILS - ACORDOS" (ignora maiúsculas/minúsculas)
    const posicao = item.pasta_acordo.toUpperCase().indexOf(PASTA_RAIZ);
    const pasta = posicao >= 0
        ? DRIVE_LOCAL + item.pasta_acordo.substring(posicao)
        : item.pasta_acordo;

    return path.join(pasta, item.nome_anexo_salvo);
}

// Mesmo padrão usado no upload para o Drive: <empresa 2>_<id_anexo 6>_<nome>
function montarNomeDestino(item) {
    const nome = item.nome_anexo_salvo.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_");
    return `${ID_EMPRESA.toString().padStart(2, "0")}_${item.id.toString().padStart(6, "0")}_${nome}`;
}

async function existe(caminho) {
    try {
        await fs.promises.access(caminho);
        return true;
    } catch {
        return false;
    }
}

// Copia para um .tmp e renomeia, para não deixar arquivo pela metade
async function copiarArquivo(origem, destino) {
    const tmp = destino + ".tmp";
    await fs.promises.copyFile(origem, tmp);
    await fs.promises.rename(tmp, destino);
}

// docs_gdrives: o anexo de e-mail entra com origem EMAIL e id_origem = id do anexo.
// id_folder vem da tabela pastas (id 3, sigla EMAILS); id_file fica vazio (NOT NULL) e é completado depois,
// no upload para o Drive.
const ORIGEM_DOC = "EMAIL";
const PASTA_DRIVE_ID = 3;
const PASTA_DRIVE_SIGLA = "EMAILS";
let idPastaDrive = "";
const STATUS_UPLOAD_PENDENTE = "0";

// Garante o registro em docs_gdrives sem duplicar (o script pode rodar de novo sobre o mesmo anexo)
async function registrarDocGdrive(item) {
    let existentes = [];
    try {
        existentes = await simUploadSrv.getDocGDrive({
            id_empresa: ID_EMPRESA,
            origem: ORIGEM_DOC,
            id_origem: item.id,
            pagina: 0,
            tamPagina: 10,
        });
    } catch (error) {
        // 409 = nenhum registro para esta consulta
        if (error.response?.status !== 409) throw error;
    }

    if (existentes.length > 0) {
        console.log("ℹ️ Já registrado em docs_gdrives:", existentes[0].id);
        return existentes[0];
    }

    const usuario = Number(opts.id_usuario);
    const doc = await emailService.insertDocGDrive({
        id_empresa: ID_EMPRESA,
        id_folder: idPastaDrive,
        id_file: "",
        file_name: montarNomeDestino(item),
        id_origem: item.id,
        origem: ORIGEM_DOC,
        file_name_original: item.nome_original_anexo || item.nome_anexo_salvo,
        status_upload: STATUS_UPLOAD_PENDENTE,
        user_insert: usuario,
        user_update: usuario,
    });
    console.log("🗂 Registrado em docs_gdrives:", doc.id);
    return doc;
}

async function atualizarStatus(item, status) {
    item.status_arquivos = status;
    try {
        await emailService.updatePsts_Anexos(item);
    } catch (error) {
        console.log("❌ Erro ao atualizar status do anexo", item.id, ":", error.response?.data?.message || error.message);
    }
}

async function iniciar() {

    await login(opts.id_usuario, opts.senha.toString());

    try {

        await fs.promises.mkdir(opts.destino, { recursive: true });

        // sem a pasta não há como registrar em docs_gdrives: para antes de copiar qualquer arquivo
        idPastaDrive = await emailService.getIdPastaDrive(ID_EMPRESA, PASTA_DRIVE_ID, PASTA_DRIVE_SIGLA);
        if (!idPastaDrive) throw new Error(`Pasta ${PASTA_DRIVE_SIGLA} (id ${PASTA_DRIVE_ID}) sem id do Drive em pastas`);
        console.log("pasta do Drive (EMAILS): ", idPastaDrive);

        // pagina: 0 faz a API ignorar a paginação (usar o intervalo de ids);
        // para testes, informe pagina 1, 2, 3... para trazer só uma página
        const emails = await emailService.getPsts_Anexos({
            id_empresa: ID_EMPRESA,
            id: 0,
            id_inicial: opts.id_inicial,
            id_final: opts.id_final,
            acordo: "",
            status_arquivos: "0",
            pagina: 1,
            tamPagina: 5,
        });

        console.log("total de anexos pendentes: ", emails.length);
        console.log("destino: ", opts.destino);
        console.log("início do processamento...");

        let copiados = 0, jaExistiam = 0, ignorados = 0, naoEncontrados = 0, erros = 0;
        
        let indice = 0;

        for (const item of emails) {

            indice++;
            console.log(`🔍 Processando arquivo ${indice}/${emails.length} (anexo ${item.id})`);

            if (!item.pasta_acordo || !item.nome_anexo_salvo) {
                console.log("⚠️ Registro sem pasta_acordo/nome_anexo_salvo:", item.id);
                erros++;
                continue;
            }

            if (!extensaoPermitida(item.nome_anexo_salvo)) {
                console.log("⏭ Ignorado (não é PDF/imagem):", item.nome_anexo_salvo);
                await atualizarStatus(item, STATUS_IGNORADO);
                ignorados++;
                continue;
            }

            const origem = montarCaminhoAnexo(item);

            if (!(await existe(origem))) {
                console.log("❌ Arquivo NÃO encontrado:", origem);
                naoEncontrados++;
                continue;
            }

            const destino = path.join(opts.destino, montarNomeDestino(item));

            try {
                if (await existe(destino)) {
                    console.log("⚠️ Arquivo já existe no repositório:", destino);
                    jaExistiam++;
                } else {
                    await copiarArquivo(origem, destino);
                    console.log("✅ Arquivo copiado:", destino);
                    copiados++;
                }

                // o status de psts_anexos é atualizado pela trigger de docs_gdrives (0 sem docs, 2 com upload
                // pendente, 1 tudo enviado); se o registro falhar o anexo continua 0 e é tentado de novo
                await registrarDocGdrive(item);
            } catch (error) {
                console.log("❌ Erro ao copiar", item.nome_anexo_salvo, ":", error.message);
                erros++;
            }
        }

        console.log(`Resumo: ${copiados} copiados, ${jaExistiam} já existiam, ${ignorados} ignorados, ${naoEncontrados} não encontrados, ${erros} com erro.`);
        console.log("Fim Do Processamento!");

    } catch (error) {
        console.log("Erro:", error.response?.data?.message || error.message);
    }
}

iniciar();
