/* ROUTE assinaturas */
const db = require("../../../shared/infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../../../shared/middleware/autenticartoken");
const assinaturaSrv = require("../../../shared/service/assinaturaService");
const assinatuaComplementarSrv = require("../../../shared/service/complementar/assinaturaService");

router.use(autenticarToken);

/* atualiza assinatura */
router.post("/atualizarassinatura", async function (req, res) {
  try {
    const assinatura = req.body;
    const id_usuario = req.id_usuario;
    const id_empresa = req.id_empresa;

    console.log("Assinatura Recebida: ", assinatura);

    var registro = await assinaturaSrv.getAssinatura(
      assinatura.id_empresa,
      assinatura.id_cab,
    );

    if (registro == null) {
      assinatura.user_insert = id_usuario;
      registro = await assinaturaSrv.insertAssinatura(assinatura);

      res.status(201).json(registro);
    } else {
      assinatura.user_update = id_usuario;
      registro = await assinaturaSrv.updateAssinatura(assinatura);

      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Assinatura", message: err.message });
    }
  }
});

router.post("/getresumoobs", async function (req, res) {
  /*
                       id_empresa:0
                       paf:"S",
                       sim:""

                    */
  try {
    const id_usuario = req.id_usuario;

    const id_empresa = req.id_empresa;

    console.log("getresumoobs", req.body);

    const params = req.body;

    var registro = await assinatuaComplementarSrv.getResumoObs(params);

    res.status(201).json(registro);
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Assinatura", message: err.message });
    }
  }
});

router.post("/atualizarassinaturasim", async function (req, res) {
  try {
    const assinatura = req.body;
    const id_usuario = req.id_usuario;
    const id_empresa = req.id_empresa;

    console.log("Assinatura Recebida sim: ", assinatura);

    var registro = await assinaturaSrv.getAssinaturaSim(
      assinatura.id_empresa,
      assinatura.id_sim,
    );

    if (registro == null) {
      assinatura.user_insert = id_usuario;
      console.log("indo para inclusao", assinatura);
      registro = await assinaturaSrv.insertAssinatura(assinatura);

      res.status(201).json(registro);
    } else {
      assinatura.user_update = id_usuario;
      registro = await assinaturaSrv.updateAssinaturaSim(assinatura);

      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Assinatura", message: err.message });
    }
  }
});

module.exports = router;
