/* ROUTE sim_historicos */
const db = require("../../../shared/infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../../../shared/middleware/autenticartoken");
const sim_historicoSrv = require("../../../shared/service/complementar/sim_historicoService.js");
router.use(autenticarToken);

/* ROTA CONSULTA POST sim_historicos */
router.post("/sim_historicos_empresas", async function (req, res) {
  try {
    const lsRegistros = await sim_historicoSrv.getSim_Historicos_Empresas();
    if (lsRegistros.length == 0) {
      res.status(409).json({
        message: "Sim_Historico Empresas Nenhum Registro Encontrado!",
      });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "Sim_Historico",
        message: err.message,
      });
    }
  }
});

router.post("/simassisintetico", async function (req, res) {
  /*
  
   {
	"id_empresa":1,
	"id":0,
    "id_sim":0,
	 "pagina":1,
	 "tamPagina":3,
	 "contador":  "N",
	 "orderby": "",
	 "sharp": false
}

	*/
  try {
    const params = req.body;
    const lsRegistros = await sim_historicoSrv.getSim_Assi_Sintetico(params);
    if (lsRegistros.length == 0) {
      res.status(409).json({ message: "Nenhum Dado Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "SIM_HISTORICOS_ASSINATURA_SINTETICO",
        message: err.message,
      });
    }
  }
});

module.exports = router;
