/* ROUTE contratos_cab */

const axios = require("axios");
const db = require("../../shared/infra/database");
const express = require("express");
const erroDB = require("../../shared/util/userfunctiondb");
const router = express.Router();
const fs = require("fs");
const {axiosWorker,workerURL} = require("../../shared/infra/conexao_http");
const { autenticarToken } = require("../../shared/middleware/autenticartoken");
const usuarioSrv = require("../../shared/service/usuarioService");

router.use(autenticarToken);


/* Teste */
router.get("/teste", async function (req, res) {
  try {
    const url = new URL("worker/enviar_email", workerURL).toString();

    const response = await axiosWorker.post(url);

    res.status(200).json({
      message: "Worker Foi Chamado com Sucesso!",
      status: response.status,
      data: response.data,
    });
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "Teste Worker",
        message: err.message,
      });
    }
  }
});

router.post("/relatoriocontratos", async function (req, res){
try 
	{
		const id_empresa = req.id_empresa;

    const id_usuario = req.id_usuario;
    
		const params = req.body;

		const usuario = await usuarioSrv.getUsuario(id_empresa,id_usuario);

	  const url = new URL("worker/relatoriocontratos", workerURL).toString();

    const response = await axiosWorker.post(url,{params:params});

    res.status(200).json({
      message: "Worker Foi Chamado com Sucesso!",
      status: response.status,
      data: response.data,
      params:params
    });

}
catch (err)
	{
    console.log("erro:",err);

		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Contrato_Det', message: err.message });
		}
	}
})

module.exports = router;
