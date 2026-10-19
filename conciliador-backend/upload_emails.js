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
    .name("upload_emails")
    .description("Processador de uploads de emails")
    .version("1.0.0")
    .requiredOption("--id_usuario <id>", "ID do usuário para login")
    .requiredOption("--senha <senha>", "Senha do usuário para login");

program.parse();

const opts = program.opts();

// Prefixo gravado no banco x caminho equivalente nesta máquina
const PREFIXO_BANCO = "E:\\SISTEMAS\\O Conciliador - GP\\SUP\\";
const PREFIXO_LOCAL = "Y:\\";

// Somente PDF e imagens serão enviados
const EXTENSOES_PERMITIDAS = [".pdf", ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tif", ".tiff", ".webp"];

function extensaoPermitida(nomeArquivo) {
    return EXTENSOES_PERMITIDAS.includes(path.extname(nomeArquivo).toLowerCase());
}

function montarCaminhoAnexo(item) {
    const pasta = item.pasta_acordo.startsWith(PREFIXO_BANCO)
        ? PREFIXO_LOCAL + item.pasta_acordo.substring(PREFIXO_BANCO.length)
        : item.pasta_acordo;

    const caminho = path.join(pasta, item.nome_anexo_salvo);

    return fs.existsSync(caminho) ? caminho : null;
}

async function iniciar() {

    await login(opts.id_usuario, opts.senha.toString());

    try {

        const emails = await emailService.getPsts_Anexos({
            id_empresa: 1,
            id: 0,
            acordo: "",
            status_arquivos: "0",
            pagina: 1,
            tamPagina: 3000,
        });

        console.log("emails: ",emails);

        for (const item of emails) {

            console.log("🔍 Processando anexo:", item.id);

            if (!item.pasta_acordo || !item.nome_anexo_salvo) {
                console.log("⚠️ Registro sem pasta_acordo/nome_anexo_salvo:", item.id);
                continue;
            }

            if (!extensaoPermitida(item.nome_anexo_salvo)) {
                console.log("⏭ Ignorado (não é PDF/imagem):", item.nome_anexo_salvo);
                continue;
            }

            const caminhoArquivo = montarCaminhoAnexo(item);

            if (!caminhoArquivo) {
                console.log("❌ Arquivo NÃO encontrado:", item.pasta_acordo, item.nome_anexo_salvo);
                continue;
            }

            console.log("✔ Arquivo encontrado:", caminhoArquivo);

            await emailService.uploadArquivoEmail(caminhoArquivo, item.id);

            console.log("✅ Arquivo enviado:", item.nome_anexo_salvo);
        }
    console.log("Fim Do Processamento!");
 
} catch(error){
        if (error.response?.status === 409) {
            console.log("⚠️", error.response.data.message);
        } else {
            console.log("Erro:", error);
        }
}
 }

iniciar();