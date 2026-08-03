/* ROUTE sim_acordos */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const sim_acordoSrv = require('../../shared/service/sim_acordoService');
router.use(autenticarToken); 
/* ROTA GETONE sim_acordo */
router.get("/:id_empresa/:id_sim/:acordo",async function(req, res) {
try 
	{
		const lsLista = await sim_acordoSrv.getSim_Acordo(req.params.id_empresa,req.params.id_sim,req.params.acordo);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Sim_Acordo Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'sim_acordo', message: err.message });
		}
	}
})
/* ROTA GETALL sim_acordo */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await sim_acordoSrv.getSim_Acordos();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'sim_acordo', message: err.message });
		}
	}
})
/* ROTA INSERT sim_acordo */
router.post("/",async function(req, res) {
try 
	{
		const sim_acordo = req.body;
		const registro = await sim_acordoSrv.insertSim_Acordo(sim_acordo);
		if (registro == null)
		{
			res.status(409).json({ message: 'Sim_Acordo Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Sim_Acordo', message: err.message });
		}
	}
})
/* ROTA UPDATE sim_acordo */
router.put("/",async function(req, res) {
try 
	{
		const sim_acordo = req.body;
		const registro = await sim_acordoSrv.updateSim_Acordo(sim_acordo);
		if (registro == null)
		{
			res.status(409).json({ message: 'Sim_Acordo Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Sim_Acordo', message: err.message });
		}
	}
})
/* ROTA DELETE sim_acordo */
router.delete("/:id_empresa/:id_sim/:acordo",async function(req, res) {
try 
	{
		await sim_acordoSrv.deleteSim_Acordo(req.params.id_empresa,req.params.id_sim,req.params.acordo);
		res.status(200).json({ message: 'Sim_Acordo Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Sim_Acordo', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST sim_acordos */
router.post("/sim_acordos",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"id_sim":0, 
		"pagina":0, 
		"tamPagina":50, 
		"contador":"N", 
		"orderby":"", 
		"sharp":false, 
		"saida":0 
	}
*/
try 
	{
		const params = req.body;
		const lsRegistros = await sim_acordoSrv.getSim_Acordos(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Sim_Acordo Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Sim_Acordo', message: err.message });
		}
	}
})

module.exports = router;
