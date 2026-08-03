/* ROUTE sim_historicos */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const sim_historicoSrv = require('../../shared/service/sim_historicoService');
router.use(autenticarToken); 
/* ROTA GETONE sim_historico */
router.get("/:id_empresa/:id",async function(req, res) {
try 
	{
		const lsLista = await sim_historicoSrv.getSim_Historico(req.params.id_empresa,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Sim_Historico Não Encontrada.' });
		}
	else
		{
			res.status(200).json(lsLista);
		}
	}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'sim_historico', message: err.message });
		}
	}
})
/* ROTA GETALL sim_historico */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await sim_historicoSrv.getSim_Historicos();
		if (lsLista.length == 0) 
		{
			res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.'} );
		}
	else
		{
			res.status(200).json(lsLista);
		}
	}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'sim_historico', message: err.message });
		}
	}
})
/* ROTA INSERT sim_historico */
router.post("/",async function(req, res) {
try 
	{
		const sim_historico = req.body;
		const registro = await sim_historicoSrv.insertSim_Historico(sim_historico);
		if (registro == null)
		{
			res.status(409).json({ message: 'Sim_Historico Cadastrado!' });
		}
		else
		{
			res.status(200).json(registro);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Sim_Historico', message: err.message });
		}
	}
})
/* ROTA UPDATE sim_historico */
router.put("/",async function(req, res) {
try 
	{
		const sim_historico = req.body;
		const registro = await sim_historicoSrv.updateSim_Historico(sim_historico);
		if (registro == null)
		{
			res.status(409).json({ message: 'Sim_Historico Alterado Com Sucesso!' });
		}
		else
		{
			res.status(200).json(registro);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Sim_Historico', message: err.message });
		}
	}
})
/* ROTA DELETE sim_historico */
router.delete("/:id_empresa/:id",async function(req, res) {
try 
	{
		await sim_historicoSrv.deleteSim_Historico(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Sim_Historico Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Sim_Historico', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST sim_historicos */
router.post("/sim_historicos",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"codemp":0, 
		"numpro":0, 
		"cod_cli_sim":"", 
		"datini":"", 
		"id_contrato":0, 
		"status_conciliador":"", 
		"status_arquivos":"", 
		"status_assinatura":"", 
		"pagina":0, 
		"tamPagina":50, 
		"contador":"N", 
		"orderby":"", 
		"sharp":false 
	}
*/
try 
	{
		console.log("estou aqui");
		const params = req.body;
		const lsRegistros = await sim_historicoSrv.getSim_Historicos(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Sim_Historico Nenhum Registro Encontrado!' });
		}
		else
		{
			res.status(200).json(lsRegistros);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Sim_Historico', message: err.message });
		}
	}
})

module.exports = router;
