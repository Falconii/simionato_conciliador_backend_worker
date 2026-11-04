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

// Prefixo gravado no banco x caminho equivalente nesta máquina
const PREFIXO_BANCO = "E:\\SISTEMAS\\O Conciliador - GP\\SUP\\";
const PREFIXO_LOCAL = "Y:\\";

// Somente PDF e imagens serão copiados
const EXTENSOES_PERMITIDAS = [".pdf", ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tif", ".tiff", ".webp"];

// status_arquivos: 0 = pendente, 1 = copiado para o repositório, 3 = ignorado (não é PDF/imagem)
const STATUS_COPIADO = "1";
const STATUS_IGNORADO = "3";

function extensaoPermitida(nomeArquivo) {
    return EXTENSOES_PERMITIDAS.includes(path.extname(nomeArquivo).toLowerCase());
}

function montarCaminhoAnexo(item) {
    const pasta = item.pasta_acordo.startsWith(PREFIXO_BANCO)
        ? PREFIXO_LOCAL + item.pasta_acordo.substring(PREFIXO_BANCO.length)
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

        // pagina: 0 faz a API ignorar a paginação (usar o intervalo de ids);
        // para testes, informe pagina 1, 2, 3... para trazer só uma página
        const emails = await emailService.getPsts_Anexos({
            id_empresa: ID_EMPRESA,
            id: 0,
            id_inicial: opts.id_inicial,
            id_final: opts.id_final,
            acordo: "",
            status_arquivos: "0",
            pagina: 0,
            tamPagina: 2000,
        });

        console.log("total de anexos pendentes: ", emails.length);

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

                await atualizarStatus(item, STATUS_COPIADO);
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
