const { Command } = require("commander");
const { login } = require("../shared/service/authService");
const emailService = require("../shared/service/emailService");
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

// status_arquivos de psts_anexos: este script grava o 3 (ignorado: não é PDF/imagem) e o 2 (falha na cópia/upload,
// para tentar de novo). O 0, o 1 e o 2 do upload em andamento quem atualiza é a trigger de docs_gdrives.
const STATUS_IGNORADO = "3";
const STATUS_PENDENTE = "2";

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

// Pausa até o usuário apertar Enter (para conferir a pasta de destino antes de o script terminar)
function aguardarEnter(mensagem) {
    const readline = require("readline");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(mensagem, () => { rl.close(); resolve(); }));
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

// Envia a cópia de D: para o Google Drive pela rota /importacaoemail/anexo. O arquivo já tem o nome único do Drive
// (<empresa>_<id>_<nome>), que a rota usa como está. Ela envia à pasta EMAILS e só então grava o registro em
// docs_gdrives (origem EMAIL, id_origem = id do anexo) já com id_folder, id_file e status_upload '1'.
// Devolve 'enviado', 'jaNoDrive' (o Drive já tinha o arquivo: a rota completou o registro com o id existente)
// ou 'jaRegistrado' (docs_gdrives já estava completo).
async function enviarParaDrive(item, destino) {
    const resposta = await emailService.uploadAnexoEmail(destino, item.id, item.nome_anexo_salvo);
    return resposta.status;
}

// 409 da API = consulta sem resultado
async function buscarAnexos(status) {
    try {
        return await emailService.getPsts_Anexos({
            id_empresa: ID_EMPRESA,
            id: 0,
            id_inicial: opts.id_inicial,
            id_final: opts.id_final,
            acordo: "",
            status_arquivos: status,
            pagina: 1,
            tamPagina: 5,
        });
    } catch (error) {
        if (error.response?.status === 409) return [];
        throw error;
    }
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

        // somente status 0 (ainda não processado). Os com falha (status 2) ficam de fora e são tratados à parte
        const emails = await buscarAnexos("0");

        console.log("anexos novos: ", emails.length);
        console.log("destino: ", opts.destino);
        console.log("início do processamento...");

        let copiados = 0, jaExistiam = 0, ignorados = 0, naoEncontrados = 0, erros = 0;
        let enviados = 0, jaRegistrados = 0, jaNoDrive = 0;
        
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
                    // anexo novo não deveria ter cópia: pausa para conferir
                    await aguardarEnter("\nArquivo já existe. Tecle ENTER para continuar... ");
                } else {
                    await copiarArquivo(origem, destino);
                    console.log("✅ Arquivo copiado:", destino);
                    copiados++;
                }

                // a rota grava docs_gdrives depois do upload e a trigger leva psts_anexos para 1.
                // Se algo falhar o anexo fica em 2 (ver o catch) e é retomado na próxima execução
                const resultado = await enviarParaDrive(item, destino);
                if (resultado === "enviado") {
                    console.log("☁️ Enviado para o Google Drive:", montarNomeDestino(item));
                    enviados++;
                } else if (resultado === "jaRegistrado") {
                    console.log("ℹ️ Já estava no Google Drive e registrado:", montarNomeDestino(item));
                    jaRegistrados++;
                } else {
                    console.log("ℹ️ O Drive já tinha o arquivo; registro completado:", montarNomeDestino(item));
                    jaNoDrive++;
                }
            } catch (error) {
                console.log("❌ Erro ao copiar/enviar", item.nome_anexo_salvo, ":", error.response?.data?.message || error.message);
                erros++;
                // falha de internet, arquivo corrompido etc.: fica em 2 para ser retomado na próxima execução.
                // A rota só grava docs_gdrives depois do upload, então numa falha não há registro e a trigger não
                // age: o 2 vem daqui
                if (item.status_arquivos !== STATUS_PENDENTE) {
                    await atualizarStatus(item, STATUS_PENDENTE);
                }
            }
        }

        console.log(`Resumo: ${copiados} copiados, ${jaExistiam} já existiam, ${ignorados} ignorados, ${naoEncontrados} não encontrados, ${erros} com erro.`);
        console.log(`Google Drive: ${enviados} enviados, ${jaRegistrados} já registrados, ${jaNoDrive} já estavam no Drive (registro completado).`);
        console.log("Fim Do Processamento!");

        await aguardarEnter("\nProcessamento concluído. Confira a pasta de destino e tecle ENTER para sair... ");

    } catch (error) {
        console.log("Erro:", error.response?.data?.message || error.message);
    }
}

iniciar();
