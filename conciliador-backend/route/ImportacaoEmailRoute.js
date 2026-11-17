/* ROUTE importação dos anexos de e-mail para o Google Drive.
   Rota simples: o arquivo já chega com o nome único do Drive (<empresa>_<id do anexo>_<nome>), então o nome
   também não colide na pasta temporária do servidor, mesmo com vários uploads ao mesmo tempo. */
const express = require("express");
const fs = require("fs");
const { google } = require("googleapis");
const router = express.Router();
const uploadPaf = require("../../shared/uploadConfig/uploadPaf.js");
const doc_gdriveSrv = require("../../shared/service/doc_gdriveService.js");
const pastaSrv = require("../../shared/service/pastaService.js");
const dbController = require("../../shared/controllers/doccontroller.js");
const funcoes = require("../../shared/util/googleFuncoes.js");
const shared = require("../../shared/util/shared.js");
const response = require("../../shared/util/respostaPadrao.js");
const { autenticarToken } = require("../../shared/middleware/autenticartoken.js");

// pasta do Drive: tabela pastas, id 3 e sigla EMAILS
const ID_PASTA = 3;
const SIGLA_PASTA = "EMAILS";
const ORIGEM = "EMAIL";

router.use(autenticarToken);

/* id de um arquivo que já está na pasta do Drive */
async function buscaIdNoDrive(id_empresa, nomeDrive) {
    const pasta = await pastaSrv.getPasta(id_empresa, ID_PASTA, SIGLA_PASTA);
    if (!pasta) return null;
    const params = await funcoes.loadCredencials(id_empresa);
    const driveService = google.drive({ version: "v3", auth: funcoes.getoauth2Client(params) });
    const id = await funcoes.getFileIdByName(driveService, nomeDrive, pasta.pasta);
    return id ? { id, id_folder: pasta.pasta } : null;
}

/* Campos do form-data: file (nome já único), id_pst_anexo e nome_original (opcional).
   Resposta: { status: 'enviado' | 'jaNoDrive' | 'jaRegistrado', id_file, id_folder, id } */
router.post("/anexo", uploadPaf.single("file"), async function(req, res) {
    const file = req.file;
    try {
        const id_empresa = req.id_empresa;
        const id_usuario = req.id_usuario;
        const id_pst_anexo = Number(req.body.id_pst_anexo);

        const camposAusentes = [];
        if (!id_empresa) camposAusentes.push("id_empresa");
        if (!id_usuario) camposAusentes.push("id_usuario");
        if (!file) camposAusentes.push("file");
        if (!Number.isInteger(id_pst_anexo) || id_pst_anexo <= 0) camposAusentes.push("id_pst_anexo");
        if (camposAusentes.length > 0) {
            return response.validationError(res, camposAusentes);
        }

        const nomeDrive = shared.fixFileNameEncoding(file.originalname);
        const nomeOriginal = req.body.nome_original || nomeDrive;

        // um anexo tem no máximo um registro em docs_gdrives
        const existentes = await doc_gdriveSrv.getDocs_Gdrives({
            id_empresa, id: 0, id_folder: "", id_file: "", file_name: "", origem: ORIGEM,
            file_name_original: "", status_upload: "", id_origem: id_pst_anexo,
            pagina: 0, tamPagina: 50, contador: "N", orderby: "", sharp: false,
        });
        const doc = existentes.length > 0 ? existentes[0] : null;

        if (doc && doc.status_upload === "1" && doc.id_file) {
            return res.status(200).json({
                status: "jaRegistrado", id_file: doc.id_file, id_folder: doc.id_folder, id: doc.id,
            });
        }

        // envia ao Drive; se o arquivo já estiver lá (upload anterior que não chegou a gravar), usa o que existe
        let status, id_file, id_folder;
        const resposta = await dbController.processaUploadDocumentos(file, ID_PASTA, SIGLA_PASTA, nomeDrive);
        if (resposta.data) {
            status = "enviado";
            id_file = resposta.data.id;
            id_folder = resposta.data.id_folder;
        } else if (resposta.error && resposta.error.includes("Já Existe")) {
            const noDrive = await buscaIdNoDrive(id_empresa, nomeDrive);
            if (!noDrive) {
                return response.error(res, "O Drive acusou arquivo existente, mas não foi possível localizá-lo.");
            }
            status = "jaNoDrive";
            id_file = noDrive.id;
            id_folder = noDrive.id_folder;
        } else {
            return response.error(res, resposta.error || "Erro ao fazer upload do arquivo para o Google Drive.");
        }

        // só grava depois de ter o id do Drive: nunca fica registro com id_file vazio
        const registro = {
            id_empresa, id_folder, id_file, file_name: nomeDrive, id_origem: id_pst_anexo, origem: ORIGEM,
            file_name_original: nomeOriginal, status_upload: "1", user_insert: id_usuario, user_update: id_usuario,
        };
        let gravado;
        try {
            gravado = doc
                ? await doc_gdriveSrv.updateDoc_Gdrive({ ...doc, ...registro, id: doc.id, user_insert: doc.user_insert })
                : await doc_gdriveSrv.insertDoc_Gdrive({ ...registro, id: 0 });
        } catch (err) {
            // índice único ux_docs_gdrives_email: outra instância gravou este anexo no mesmo instante e já completou o
            // registro (e a trigger o status do anexo). Não é erro: devolve o registro que ficou
            if (err.code !== "23505" && err.erro?.code !== "23505") throw err;
            const outro = await doc_gdriveSrv.getDocs_Gdrives({
                id_empresa, id: 0, id_folder: "", id_file: "", file_name: "", origem: ORIGEM,
                file_name_original: "", status_upload: "", id_origem: id_pst_anexo,
                pagina: 0, tamPagina: 50, contador: "N", orderby: "", sharp: false,
            });
            return res.status(200).json({
                status: "jaRegistrado", id_file: outro[0]?.id_file, id_folder: outro[0]?.id_folder, id: outro[0]?.id,
            });
        }

        res.status(200).json({ status, id_file, id_folder, id: gravado?.id });
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: "BAK-END", tabela: "ImportacaoEmail", message: err.message });
        }
    } finally {
        if (file) {
            try {
                await fs.promises.unlink(file.path);
            } catch (err) {
                console.error("Erro ao remover arquivo temporário:", file.path, err.message);
            }
        }
    }
});

module.exports = router;
