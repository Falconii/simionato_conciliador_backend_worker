/* ROUTE participantes */
const db = require("../../shared/infra/database.js");
const uploadPaf = require("../../shared/uploadConfig/uploadPaf.js");
const dbController = require("../../shared/controllers/doccontroller.js");
const doc_gdriveSrv = require("../../shared/service/doc_gdriveService.js");
const express = require("express");
const router = express.Router();
const shared = require("../../shared/util/shared.js");
const response = require("../../shared/util/respostaPadrao.js");
const fs = require("fs");
const path = require("path");
const { autenticarToken } = require("../../shared/middleware/autenticartoken.js");

router.use(autenticarToken);

router.post(
    "/load_file_paf",
    uploadPaf.single("file"),
    async function(req, res) {
        const file = req.file;
        try {
            // Validação
            const dados = {
                id_empresa: req.id_empresa,
                id_usuario: req.id_usuario,
                id_cab_paf: req.body.id_cab_paf,
                file: req.file,
            };

            console.log("req.file", req.file);

            console.log("req.body", req.body);

            const camposObrigatorios = [
                "id_empresa",
                "id_usuario",
                "file",
                "id_cab_paf",
            ];

            const camposAusentes = camposObrigatorios.filter(
                (campo) => !dados[campo],
            );

            if (camposAusentes.length > 0) {
                return response.validationError(res, camposAusentes);
            }

            const id_empresa = req.id_empresa;
            const id_usuario = req.id_usuario;
            const id_cab_paf = req.body.id_cab_paf;

            console.log("id_empresa", id_empresa);
            console.log("id_usuario", id_usuario);
            console.log("id_cab_paf", id_cab_paf);

            const par = {
                id_empresa: id_empresa,
                id: 0,
                id_folder: "",
                id_file: "",
                file_name: "",
                origem: "PAF",
                file_name_original: file.originalname,
                status_upload: "",
                id_origem: 0,
                pagina: 0,
                tamPagina: 50,
                contador: "N",
                orderby: "",
                sharp: false,
            };

            let g_doc = await doc_gdriveSrv.getDocs_Gdrives(par);

            console.log("g_doc da pesquisa", g_doc, g_doc.length);

            if (g_doc.length > 0) {
                if (g_doc[0].status_upload !== "0") {
                    res.status(200).json({
                        message: "Arquivo Já Existe Na Base De Dados.",
                    });
                    return;
                } else {
                    g_doc = g_doc[0];
                    g_doc.status_upload = "0";
                }
            } else {
                g_docModel = {
                    id_empresa: id_empresa,
                    id: 0,
                    id_folder: "",
                    id_file: "",
                    file_name: `${id_empresa.toString().padStart(2, "0")}_${id_cab_paf
            .toString()
            .padStart(6, "0")}_${file.originalname}`,
                    id_origem: id_cab_paf,
                    origem: "PAF",
                    file_name_original: file.originalname,
                    status_upload: "0",
                    user_insert: id_usuario,
                    user_update: 0,
                };
                console.log("Indo gravar docs");
                g_doc = await doc_gdriveSrv.insertDoc_Gdrive(g_docModel);
            }
            console.log("g_doc após insert ou update", g_doc);
            const resposta = await dbController.processaUploadDocumentos(
                file,
                1,
                "PAF",
                `${id_empresa.toString().padStart(2, "0")}_${id_cab_paf
          .toString()
          .padStart(6, "0")}_${file.originalname}`,
            );
            console.log("resposta", resposta);
            if (resposta.data !== null) {
                g_doc.id_folder = resposta.data.id_folder;
                g_doc.id_file = resposta.data.id;
                g_doc.status_upload = "1";
                console.log("indo para gravação", g_doc);
                g_doc = await doc_gdriveSrv.updateDoc_Gdrive(g_doc);
                res.status(200).json(resposta.data);
            } else {
                response.error(
                    res,
                    "Erro ao fazer upload do arquivo para o Google Drive.",
                );
            }
        } catch (err) {
            if (err.name == "MyExceptionDB") {
                res.status(409).json(err);
            } else {
                res.status(500).json({
                    erro: "BAK-END",
                    tabela: "Importacao",
                    message: err.message,
                });
            }
        } finally {
            /*
                                                                                                try {
                                                                                                  await fs.unlink(file.path);
                                                                                                  console.log("Arquivo removido:", file.path);
                                                                                                } catch (err) {
                                                                                                  console.error("Erro ao remover arquivo:", file.path, err);
                                                                                                }
                                                                                                  */
        }
    },
);

router.post(
    "/load_file_email",
    uploadPaf.single("file"),
    async function(req, res) {
        const file = req.file;

        console.log("📥 [Upload Email] Iniciando processamento...");
        try {
            // Validação
            const dados = {
                id_empresa: req.id_empresa,
                id_usuario: req.id_usuario,
                id_pst_anexo: req.body.id_pst_anexo,
                file: req.file,
            };

            console.log("req.file", req.file);

            console.log("req.body", req.body);

            const camposObrigatorios = [
                "id_empresa",
                "id_usuario",
                "file",
                "id_pst_anexo",
            ];

            const camposAusentes = camposObrigatorios.filter(
                (campo) => !dados[campo],
            );

            if (camposAusentes.length > 0) {
                return response.validationError(res, camposAusentes);
            }

            const id_empresa = req.id_empresa;
            const id_usuario = req.id_usuario;
            const id_pst_anexo = req.body.id_pst_anexo;

            console.log("id_empresa", id_empresa);
            console.log("id_usuario", id_usuario);
            console.log("id_pst_anexo", id_pst_anexo);

            const par = {
                id_empresa: id_empresa,
                id: 0,
                id_folder: "",
                id_file: "",
                file_name: "",
                origem: "EMAIL",
                file_name_original: file.originalname,
                status_upload: "",
                id_origem: id_pst_anexo,
                pagina: 0,
                tamPagina: 50,
                contador: "N",
                orderby: "",
                sharp: false,
            };

            let g_doc = await doc_gdriveSrv.getDocs_Gdrives(par);

            console.log("g_doc da pesquisa", g_doc, g_doc.length);

            if (g_doc.length > 0) {
                if (g_doc[0].status_upload !== "0") {
                    res.status(200).json({
                        message: "Arquivo Já Existe Na Base De Dados.",
                    });
                    return;
                } else {
                    g_doc = g_doc[0];
                    g_doc.status_upload = "0";
                }
            } else {
                g_docModel = {
                    id_empresa: id_empresa,
                    id: 0,
                    id_folder: "",
                    id_file: "",
                    file_name: `${id_empresa.toString().padStart(2, "0")}_${id_pst_anexo
            .toString()
            .padStart(6, "0")}_${file.originalname}`,
                    id_origem: id_pst_anexo,
                    origem: "EMAIL",
                    file_name_original: file.originalname,
                    status_upload: "0",
                    user_insert: id_usuario,
                    user_update: 0,
                };
                console.log("Indo gravar docs");
                g_doc = await doc_gdriveSrv.insertDoc_Gdrive(g_docModel);
            }
            console.log("g_doc após insert ou update", g_doc);

            const nomeOriginal =  `${id_empresa.toString().padStart(2, "0")}_${id_pst_anexo.toString().padStart(6, "0")}_${file.originalname}`;

            const nomeUTF8 = Buffer.from(nomeOriginal, "utf8").toString();

            const resposta = await dbController.processaUploadDocumentos(
                file,
                3,
                "EMAILS",
                nomeUTF8,
            );
            console.log("resposta", resposta);
            if (resposta.data !== null) {
                g_doc.id_folder = resposta.data.id_folder;
                g_doc.id_file = resposta.data.id;
                g_doc.status_upload = "1";
                console.log("indo para gravação", g_doc);
                g_doc = await doc_gdriveSrv.updateDoc_Gdrive(g_doc);
                res.status(200).json(resposta.data);
            } else {
                response.error(
                    res,
                    "Erro ao fazer upload do arquivo para o Google Drive.",
                );
            }
        } catch (err) {
            if (err.name == "MyExceptionDB") {
                res.status(409).json(err);
            } else {
                res.status(500).json({
                    erro: "BAK-END",
                    tabela: "Importacao",
                    message: err.message,
                });
            }
        } finally {
            /*
                                                                                                      try {
                                                                                                        await fs.unlink(file.path);
                                                                                                        console.log("Arquivo removido:", file.path);
                                                                                                      } catch (err) {
                                                                                                        console.error("Erro ao remover arquivo:", file.path, err);
                                                                                                      }
                                                                                                        */
        }
    },
);

module.exports = router;