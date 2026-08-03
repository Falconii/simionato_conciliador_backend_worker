const { login } = require("./service/authService");
const emailService = require("./service/emailService");
const fs = require("fs");
const path = require("path");

function procurarPastaPorAcordo(raiz, acordo) {
    const itens = fs.readdirSync(raiz, { withFileTypes: true });

    for (const item of itens) {
        const caminhoCompleto = path.join(raiz, item.name);

        if (item.isDirectory() && item.name.includes(acordo)) {
            return caminhoCompleto;
        }

        if (item.isDirectory()) {
            const resultado = procurarPastaPorAcordo(caminhoCompleto, acordo);
            if (resultado) return resultado;
        }
    }

    return null;
}

async function enviarArquivoGoogleDrive(caminhoArquivo) {}

async function enviarPastaParaGoogleDrive(caminhoPasta, id_email) {

    console.log("📁 Enviando arquivos da pasta:", caminhoPasta);

    const arquivos = fs.readdirSync(caminhoPasta);

    for (const arquivo of arquivos) {

        const caminhoCompleto = path.join(caminhoPasta, arquivo);

        if (fs.lstatSync(caminhoCompleto).isDirectory()) continue;

        console.log("Caminho Completo:",caminhoCompleto,caminho);

         await emailService.uploadArquivoEmail(
            caminhoCompleto,
            id_email, // vem do banco
        );  

        //
        break; // Remove este break para enviar todos os arquivos, está aqui apenas para teste
    }

    console.log("✅ Pasta enviada com sucesso:", caminhoPasta);
}

async function iniciar() {
    await login();

    try {

    const emails = await emailService.getPsts_Anexos({
        id_empresa: 1,
        id: 0,
        pagina: 1,
        acordo: "01/09",
        status_arquivos: "0",
        tamPagina: 1,
    });

    if (emails.length === 0) {
        console.log("⚠️ Nenhum email encontrado para processar.");
        return;
    }

  
    const raiz = "Y:\\";

    for (const item of emails) {

        console.log("🔍 Processando email:", item.id);

        const acordo = item.acordo;

        const pasta = procurarPastaPorAcordo(raiz, acordo.replace("/", "_"));

        if (pasta) {
            console.log("✔ Pasta encontrada:", pasta);
            await enviarPastaParaGoogleDrive(pasta, item.id);
        } else {
            console.log("❌ Pasta NÃO encontrada para:", acordo);
        }
    }
    console.log("Fim Do Processamento!");

} catch(error){
    if (error.status == 409){
        console.log(error);
        console.log(`message: ${error} `);
    } else {
        console.log(`Erro: ${error}`); 
    }
}
}

iniciar();