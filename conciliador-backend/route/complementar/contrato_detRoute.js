/* ROUTE contratos_det */
const db = require("../../../shared/infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../../../shared/middleware/autenticartoken");
const contrato_detSrv = require("../../../shared/service/complementar/contrato_detService");

router.use(autenticarToken);

/* ROTA CONSULTA POST contratos_det */
router.post("/contratos_paf_google", async function (req, res) {
  /*
                              {
                                  "id_empresa":0, 
                                  "status_arquivos":"0", 
                                  "status":"1"
                                  "pasta":"", 
                                  "pagina":0, 
                                  "tamPagina":50, 
                                  "contador":"N", 
                                  "orderby":"", 
                                  "sharp":false 
                              }
                          */
  try {
    const params = req.body;
    const lsRegistros = await contrato_detSrv.getContratos_Det_Paf(params);
    if (lsRegistros.length == 0) {
      res
        .status(409)
        .json({ message: "Contrato_Det Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "Contrato_Det",
        message: err.message,
      });
    }
  }
});

router.post("/gettabelasauxiliares", async function (req, res) {
  /*
                              {
                                  "id_empresa":0, 
                                  "tabela"    :"acao",  
                              }
                          */
  try {
    const params = req.body;
    const lsRegistros = await contrato_detSrv.getTabelasAuxiliares(params);
    if (lsRegistros.length == 0) {
      res.status(409).json({ message: "Nenhuma Tabela Auxiliar Encontrada!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "Tabelas Auxiliares",
        message: err.message,
      });
    }
  }
});

router.post("/resumo_tipo_doc", async function (req, res) {
  /*
                              {
                                  "id_empresa":1, 
                                  "tipo"    :"SIM",  
                              }
                          */
  try {
    const params = req.body;
    const lsRegistros = await contrato_detSrv.getResumo01(params);
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
        tabela: "Resumo Tipo De Contrato",
        message: err.message,
      });
    }
  }
});

router.post("/getContratos_Det_Paf_Assinatura", async function (req, res) {
  /*
  
  {
	 "id_empresa":0,
	 "id_id_paf":0,
	 "id":0,
   "ass_resposta":"",
	 "pagina":0,
	 "tamPagina":50,
	 "contador":  'N',
	 "orderby": '',
	 "sharp": false,
  }

  */
  try {
    const params = req.body;
    const lsRegistros =
      await contrato_detSrv.getContratos_Det_Paf_Assinatura(params);
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
        tabela: "CONTRATOS_ASSINATURA",
        message: err.message,
      });
    }
  }
});

router.post("/getContratos_Det_Paf_Assi_Sintetico", async function (req, res) {
  /*
  
          {
              "id_empresa":0,
              "id":0,
              "pagina":0,
              "tamPagina":50,
              "contador":  'N',
              "orderby": '',
              "sharp": false,
          }

          */
  try {
    const params = req.body;
    const lsRegistros =
      await contrato_detSrv.getContratos_Det_Paf_Assi_Sintetico(params);
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
        tabela: "CONTRATOS_ASSINATURA_SINTETICO",
        message: err.message,
      });
    }
  }
});

router.post("/getContratos_Det_Assi_Sintetico", async function (req, res) {
  /*
  
   {
	"id_empresa":1,
	"id":0,
  "id_paf":0,
	 "pagina":1,
	 "tamPagina":3,
	 "contador":  "N",
	 "orderby": "",
	 "sharp": false
}

    */
  try {
    const params = req.body;
    const lsRegistros =
      await contrato_detSrv.getContratos_Det_Assi_Sintetico(params);
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
        tabela: "CONTRATOS_ASSINATURA_SINTETICO",
        message: err.message,
      });
    }
  }
});

module.exports = router;
