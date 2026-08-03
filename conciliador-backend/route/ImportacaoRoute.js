/* ROUTE importacao */
const db = require("../../shared/infra/database");
const express = require("express");
const router = express.Router();
const shared = require("../../shared/util/shared.js");
const doccontroller = require("../../shared/controllers/doccontroller.js");
const uploadPlanilha = require("../../shared/uploadConfig/uploadPlanilha");
const { autenticarToken } = require("../../shared/middleware/autenticartoken");

router.use(autenticarToken);

router.post(
  "/uploadplanilha",
  uploadPlanilha.single("file"),
  async function (req, res) {
    try {
      const parametros = {
        id_empresa: req.id_empresa,
        id_evento: req.body.id_evento,
        id_usuario: req.id_usuario,
      };

      res.status(200).json({
        message: "Upload realizado com sucesso!",
        file: {
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (err) {
      console.log(err);

      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res.status(500).json({
          erro: "BAK-END",
          tabela: "Importacao",
          message: err.message,
        });
      }
    }
  }
);

router.post(
  "/uploadpaf",
  uploadPlanilha.single("file"),
  async function (req, res) {
    try {
      // Validação
      const dados = {
        id_empresa: req.id_empresa,
        id_usuario: req.id_usuario,
      };

      const camposObrigatorios = ["id_empresa", "id_usuario"];

      const camposAusentes = camposObrigatorios.filter(
        (campo) => !dados[campo]
      );

      if (camposAusentes.length > 0) {
        return response.validationError(res, camposAusentes);
      }

      const id_empresa = req.id_empresa;
      const id_usuario = req.id_usuario;

      res.status(200).json({
        message: "Upload realizado com sucesso!",
        file: {
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
      });

      doccontroller
        .processaUploadPaf(req.file)
        .then((foto) => {
          console.log("Upload PAF Processado Com Sucesso:", foto);
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      console.log(err);

      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res.status(500).json({
          erro: "BAK-END",
          tabela: "Importacao",
          message: err.message,
        });
      }
    }
  }
);

module.exports = router;
