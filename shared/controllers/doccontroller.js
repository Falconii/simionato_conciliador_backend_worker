const fs = require("fs");
const erroDB = require("../../shared/util/userfunctiondb");
const { google } = require("googleapis");
const funcoes = require("../../shared/util/googleFuncoes");
const pastaSrv = require("../../shared/service/pastaService");

async function processaUploadDocumentos(
    file,
    id_folder,
    sigla,
    googleFileName,
) {
    try {
        const id_empresa = 1;

        console.log("📥 [processaUploadFoto] Iniciando processamento...");

        const pasta = await pastaSrv.getPasta(id_empresa, id_folder, sigla);

        if (!pasta) {
            throw new Error("Pasta não encontrada para os parâmetros fornecidos.");
        }

        const folder_id = pasta.pasta;

        console.log("📁 [processaUploadFoto] Pasta obtida:", pasta);
        // Autenticação Google
        const params = await funcoes.loadCredencials(id_empresa);
        const oauth2Client = funcoes.getoauth2Client(params);
        const driveService = google.drive({ version: "v3", auth: oauth2Client });

        let saved = await funcoes.saveFile(
            driveService,
            file,
            folder_id,
            googleFileName,
        );

        if (saved.data !== null) {
            saved.data.id_folder = folder_id;
        }
        return saved;
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
}

async function processaUploadPaf(file) {
    const id_empresa = 1;

    console.log("📥 [processaUploadFoto] Iniciando processamento...");

    const pasta = await pastaSrv.getPasta(id_empresa, 1, "PAF");

    const folder_id = pasta.pasta;

    console.log("📁 [processaUploadFoto] Pasta obtida:", folder_id);

    // Autenticação Google
    const params = await funcoes.loadCredencials(id_empresa);
    const oauth2Client = funcoes.getoauth2Client(params);
    const driveService = google.drive({ version: "v3", auth: oauth2Client });

    const saved = await funcoes.saveFile(driveService, file, folder_id);

    return saved;
}

module.exports = {
    processaUploadDocumentos,
    processaUploadPaf,
};