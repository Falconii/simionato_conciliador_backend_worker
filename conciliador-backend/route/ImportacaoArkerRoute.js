/* ROUTE participantes */
const db = require("../../shared/infra/database.js");;
const uploadArquivoArker = require("../uploadConfig/uploadArquivoArker.js");
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
  "/load_file_arker",
  uploadArquivoArker.single("file"),
  async function (req, res) {
    const file = req.file;
    try {
      // Validação
      const dados = {
        id_empresa: req.id_empresa,
        id_usuario: req.id_usuario,
        id_arker: req.body.id_arker,
        subpasta: req.body.subpasta,
        file: req.file,
      };

      
      console.log("id_arker Importacao->",dados.id_arker);

      //console.log(req);
     
      const camposObrigatorios = [
        "id_empresa",
        "id_usuario",
        "file",
        "id_arker",
        "subpasta"
      ];

      const camposAusentes = camposObrigatorios.filter(
        (campo) => !dados[campo],
      );

      if (camposAusentes.length > 0) {
        return response.validationError(res, camposAusentes);
      }

      const id_empresa = req.id_empresa;
      const id_usuario = req.id_usuario;
      const id_arker = req.body.id_arker;
      const subpasta = req.body.subpasta;

      let g_doc = "";


      try {
        const originalName = shared.fixFileNameEncoding(file.originalname);

        const par = {
          id_empresa: id_empresa,
          id: 0,
          id_folder: "",
          id_file: "",
          file_name: "",
          origem: "ARKER",
          file_name_original: shared.caractersbarra(originalName),
          status_upload: "",
          id_origem: 0,
          pagina: 0,
          tamPagina: 50,
          contador: "N",
          orderby: "",
          sharp: false,
        };

        g_doc = await doc_gdriveSrv.getDocs_Gdrives(par);

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
          const g_docModel = {
            id_empresa: id_empresa,
            id: 0,
            id_folder: "",
            id_file: "",
            file_name: `${id_empresa.toString().padStart(2, "0")}_${id_arker.toString().padStart(6, "0")}_${subpasta}_${originalName}`,
            id_origem: id_arker,
            origem: "ARKER",
            file_name_original: originalName,
            status_upload: "0",
            user_insert: id_usuario,
            user_update: 0,
          };

          console.log("INSERT",g_docModel);


          g_doc = await doc_gdriveSrv.insertDoc_Gdrive(g_docModel);

          console.log("g_doc", g_doc);
        }

        
        const resposta = await dbController.processaUploadDocumentos(
          file,
          4,
          "ARKER_DOC",
          `${id_empresa.toString().padStart(2, "0")}_${id_arker
            .toString()
            .padStart(6, "0")}_${subpasta}_${originalName}`,
        );
        if (resposta.data !== null) {
            g_doc.id_folder = resposta.data.id_folder;
            g_doc.id_file = resposta.data.id;
            g_doc.status_upload = "1";
            g_doc = await doc_gdriveSrv.updateDoc_Gdrive(g_doc);
        } else {
            g_doc.status_upload = (resposta.error === "Arquivo Já Existe Na Pasta! GOOGLE DRIVE") ? "1" : "2";
            g_doc = await doc_gdriveSrv.updateDoc_Gdrive(g_doc);
        }

        console.log("Retorno do Google", resposta);
      } catch (err) {
        console.log("Deu Erro Na Gravação do Google", err);
        g_doc.status_upload = "2";
        g_doc = await doc_gdriveSrv.updateDoc_Gdrive(g_doc);
      }
      res.status(200).json({ message: "Fim Do Processamento!" });
    } catch (err) {
      console.log("erro do upload: ",err);
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
          if (!file.path) {
            console.warn("Arquivo sem path, nada para remover:", file);
          }

          try {
            await fs.promises.unlink(file.path);
            console.log("Arquivo removido:", file.path);
          } catch (err) {
            console.error("Erro ao remover:", file.path, err);
          }
        }
  },
);

module.exports = router;
