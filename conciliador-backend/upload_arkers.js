const { login } = require("../shared/service/authService.js");
const arkerUploadSrv = require("../shared/service/arker_uploadService.js");
const fs = require("fs");
const path = require("path");

function procurarPastaPorAcordo(caminhoCompleto,subPasta) {

    const itens = fs.readdirSync(caminhoCompleto, { withFileTypes: true });

    for (const item of itens) {

        const caminhoCompleto = path.join(raiz, item.name);

        if (item.isDirectory() && item.name.includes(subPasta)) {
            return caminhoCompleto;
        }

        if (item.isDirectory()) {
            const resultado = procurarPastaPorAcordo(caminhoCompleto, subPasta);
            if (resultado) return resultado;
        }
    }

    return null;
}


async function enviarPastaParaGoogleDrive(caminhoPasta,id_arker,subpasta) {

    const arquivos = fs.readdirSync(caminhoPasta);

    for (const arquivo of arquivos) {

        const caminhoCompleto = path.join(caminhoPasta, arquivo);

        if (fs.lstatSync(caminhoCompleto).isDirectory()) continue;

        await arkerUploadSrv.uploadArquivoArker(
            caminhoCompleto,
            id_arker, // vem do banco
            subpasta
        );   

        //
        //break; // Remove este break para enviar todos os arquivos, está aqui apenas para teste
    }

    console.log("✅ Pasta enviada com sucesso:", caminhoPasta);
}

async function iniciar() {

    await login();

    try {

        const arkers = await arkerUploadSrv.getArkers(
            {
            id_empresa: 1,
            id:3
        });

        if (arkers.length === 0) {
            console.log("⚠️ Nenhum Dado No Banco Para Processar");
            return;
        }

        console.log("Total De Arkes: ", arkers.length);


        const raiz = "C://Conciliador//arquivos arker//arquivos";

        let subpasta = "Acordos";

        for (const arker of arkers) {

            console.log(`🔍 Processando ${subpasta}:`, arker.id);

            const pasta = path.join(raiz, arker.id.toString(),subpasta);

            console.log("pasta:", pasta);


            if (pasta) {
                console.log("✔ Pasta encontrada:", pasta);
                await enviarPastaParaGoogleDrive(pasta,arker.id,subpasta);
            } else {
                console.log("❌ Pasta NÃO encontrada para:", arker.id);
            } 
        }


        subpasta = "Comprovacao";

        for (const arker of arkers) {

            const pasta = path.join(raiz, arker.id.toString(),subpasta);

            if (pasta) {
                console.log("✔ Pasta encontrada:", pasta);
                await enviarPastaParaGoogleDrive(pasta,arker.id,subpasta);
            } else {
                console.log("❌ Pasta NÃO encontrada para:", arker.id);
            } 
            }


        console.log("Fim Do Processamento!");

} catch(error){
    if (error.status == 409){
        console.log(error);
        console.log(`message: ${error} `);
    } else {
        console.log(`Erro: ${error}`); 
        console.log("Erro Do Upload");
    }
}
    
}

iniciar();