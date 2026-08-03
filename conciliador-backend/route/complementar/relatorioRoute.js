/* ROUTE contratos_det */
const db = require("../../../shared/infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../../../shared/middleware/autenticartoken");
const contrato_detSrv = require("../../../shared/service/complementar/contrato_detService");
const usuarioSrv = require("../../../shared/service/usuarioService.js")
const response = require("../../../shared/util/respostaPadrao.js");
const fs = require('fs').promises;
const path = require('path');
const funcoes = require("../../../shared/email/funcoes");

router.use(autenticarToken);


router.post("/checkfile", async function (req, res) {


  const { fileName, tentativa, maxTentativas } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: "fileName é obrigatório" });
  }

  console.log(path.join(__dirname, '..', '..','planilhas', fileName),"Tentativa:",tentativa);

  const caminhoArquivo = path.join(__dirname, '..', '..','planilhas', fileName);

  // Controle de tentativas

  if (Number(tentativa) > Number(maxTentativas)) {
      return res.status(408).json({
      status: "failed",
      message: "Limite de tentativas excedido"
    });
  }

  try {
    await fs.access(caminhoArquivo);

    return res.status(200).json({
      status: "ready",
      message: "Arquivo disponível"
    });

  } catch (err) {
    return res.status(200).json({
      status: "pending",
      message: "Arquivo ainda não disponível"
    });
  }
});

  

  /* 
    // ---------------------------
    // TIPO 2 → DOWNLOAD
    // ---------------------------
    if (tipo == 2) {

      res.download(caminhoArquivo, `relatorio_${owner}.xlsx`, (err) => {

        if (err) {
          console.error("Erro ao enviar arquivo:", err);
        }

        // Apaga o arquivo após o download
        fs.unlink(caminhoArquivo, (erro) => {
          if (erro) console.error("Erro ao excluir arquivo:", erro);
          else console.log("Arquivo excluído:", caminhoArquivo);
        });
      });

      return; // impede segunda resposta
    }
 */


router.post("/finalizarelatorio/email", async function (req, res) {
  try {
    const dados = {
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      owner: req.body.owner,
      filename: req.body.filename
    };

    const camposObrigatorios = ["id_empresa", "id_usuario", "owner", "filename"];
    const camposAusentes = camposObrigatorios.filter(c => !dados[c]);

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    const usuario = await usuarioSrv.getUsuario(dados.id_empresa, dados.id_usuario);
    if (!usuario) {
      return response.notFound(res, "Usuário", { usuario: dados.id_usuario });
    }

    const caminhoArquivo = path.join(__dirname, '..', '..', 'planilhas', dados.filename);

    try {
      await fs.access(caminhoArquivo);

      funcoes.preparaEmailRelatorioEvento(usuario, dados.owner, caminhoArquivo)
        .then((data) => {
          return response.success(res, "E-Mail", { mensagem: data.message });
        })
        .catch((error) => {
          return response.error(res, "E-Mail", { erro: error.message });
        })
        .finally(() => {
          fs.unlink(caminhoArquivo, (erro) => {
            if (erro) console.error("Erro ao excluir arquivo:", erro);
          });
        });

    } catch (err) {
      return response.notFound(res, "Arquivo", { arquivo: dados.filename });
    }

  } catch (err) {
    console.log("erro:", err);
    res.status(500).json({ erro: 'BACK-END', tabela: 'Finalização De Relatório', message: err.message });
  }
});


router.post("/finalizarelatorio/download", async function (req, res) {
  try {
    const dados = {
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      filename: req.body.filename
    };

    const camposObrigatorios = ["id_empresa", "id_usuario", "filename"];
    const camposAusentes = camposObrigatorios.filter(c => !dados[c]);

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    const usuario = await usuarioSrv.getUsuario(dados.id_empresa, dados.id_usuario);
    if (!usuario) {
      return response.notFound(res, "Usuário", { usuario: dados.id_usuario });
    }

    const caminhoArquivo = path.join(__dirname, '..', '..', 'planilhas', dados.filename);

    try {
      await fs.access(caminhoArquivo);

     res.sendFile(caminhoArquivo);

     res.on("finish", () => {
        fs.unlink(caminhoArquivo, (err) => {
          if (err) console.error("Erro ao excluir arquivo:", err);
          else console.log("Arquivo excluído:", caminhoArquivo);
        });
      });

    } catch (err) {
      return response.notFound(res, "Arquivo", { arquivo: dados.filename });
    }

  } catch (err) {
    console.log("erro:", err);
    res.status(500).json({ erro: 'BACK-END', tabela: 'Finalização De Relatório', message: err.message });
  }
});


module.exports = router;
