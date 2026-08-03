/* ROUTE credenciais */
const express = require("express");
const router = express.Router();
const erroDB = require("../../shared/util/userfunctiondb");
const task = require("../task/send-email");
const fs = require("fs");

/* Enviar Email */
router.post("/enviar_email", async function (req, res) {
  try {
    console.log("Recebido pedido para enviar email.");

    res.status(200).json({
      message: "Worker Send Email Task Iniciado com Sucesso!",
    });

    // roda a task sem bloquear a resposta
    task.sendEmailTask().catch((err) => {
      console.error("Erro na task:", err);
    });
  } catch (err) {
    res.status(500).json({ erro: "BAK-END", message: err.message });
  }
});

router.post("/relatoriocontratos", async function (req, res) {
 /*  {
    "id_empresa" : 1,
    "id_usuario" : 16,
    "params"     : params
  } */
  try {
    console.log("Preparando relatorio de contratos.");

    res.status(200).json({
      message: "Preparando relatorio de contratos com Sucesso!",
    });

    // roda a task sem bloquear a resposta
    /* task.sendEmailTask().catch((err) => {
      console.error("Erro na task:", err);
    }); */
  } catch (err) {
    res.status(500).json({ erro: "BAK-END", message: err.message });
  }
});

module.exports = router;
