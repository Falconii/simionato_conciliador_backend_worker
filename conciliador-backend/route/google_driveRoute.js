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
const funcoes = require("../../shared/util/googleFuncoes");
const { autenticarToken } = require("../../shared/middleware/autenticartoken.js");
const { google } = require("googleapis");
const pastaSrv = require("../../shared/service/pastaService.js")
const arquivo_googleService = require("../../shared/service/arquivo_googleService.js")

router.use(autenticarToken);

router.post("/download", async function (req, res) {
  try {
    // Validação
    const dados = {
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      id_doc: req.body.id_doc,
    };

    const camposObrigatorios = ["id_empresa", "id_usuario", "id_doc"];
    const camposAusentes = camposObrigatorios.filter((campo) => !dados[campo]);

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    const id_empresa = req.id_empresa;
    const id_usuario = req.id_usuario;
    const id_doc = req.body.id_doc;

    console.log("Dados Recebidos:", { id_empresa, id_usuario, id_doc });

    const docModel = await doc_gdriveSrv.getDoc_Gdrive(id_empresa, id_doc);

    console.log("Documento Encontrado:", docModel);

    if (!docModel) {
      return response.notFound(res, "DOCUMENTO", {
        "doc id": id_doc,
        doc: docModel,
      });
    }

    if (docModel.status_upload !== "1") {
      return response.error(res, "Documento Não Fez Upload", 401, {
        "doc id": id_doc,
        doc: docModel,
      });
    }

    // Autenticação Google
    const params = await funcoes.loadCredencials(id_empresa);
    const oauth2Client = funcoes.getoauth2Client(params);
    const driveService = google.drive({ version: "v3", auth: oauth2Client });

    const fileId = docModel.id_file;

    // Obtenho o mimeType
    const fileMeta = await driveService.files.get({
      fileId,
      fields: "mimeType, name",
    });

    const mimeType = fileMeta.data.mimeType;
    const fileName = fileMeta.data.name;

    const driveResponse = await driveService.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" },
    );

    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${docModel.file_name.trim()}"`,
    );

    driveResponse.data.pipe(res);
  } catch (err) {
    console.log(err);
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BACK-END",
        tabela: "Importacao",
        message: err.message,
      });
    }
  }
});


router.get(
  "/diretorio/:id_empresa/:id_folder/:sigla_pasta",async function(req, res) {

    const id_empresa      = req.params.id_empresa;
    const id_folder       = req.params.id_folder;
    const sigla_pasta     = req.params.sigla_pasta;

    let  driveService;  
    
    try {

      const pasta = await pastaSrv.getPasta(id_empresa, id_folder, sigla_pasta);

      if (!pasta) {
          throw new Error("Pasta não encontrada para os parâmetros fornecidos.");
      }
          
      const folder_id       = pasta.pasta;

      const params          = await funcoes.loadCredencials(id_empresa);

      const oauth2Client    = funcoes.getoauth2Client(params);
  
      driveService          = google.drive({ version: "v3", auth: oauth2Client });
           
      const response        = await funcoes.diretorio(driveService,folder_id);

      response.forEach(async (res) => {
        
            const arquivo = {
            id_empresa    :	id_empresa,
            pasta 		    :	pasta.pasta,
            id_file 	    : res.id_file , 	
            folder_id     : folder_id,
            name_file     : res.name_file, 
            size          : res.size,
            data          : res.data,
            user_insert   :	16,
            user_update   :	0
          }
          
          try {
             await arquivo_googleService.insertArquivo_Google(arquivo);
          }
          catch(error){
              console.log(res);
              console.log(error);
          }

      }); 

      res.status(200).json(response);

    } catch (err) {
          if (err.name == "MyExceptionDB") {
              res.status(409).json(err);
          } else {
              res
                  .status(500)
                  .json({ erro: "BAK-END", tabela: "diretorio", message: err.message });
          }
    }
  }
);
module.exports = router;
