/* ROUTE cab_correcao */
const express = require('express');
const router = express.Router();
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const cabCorrecaoSrv = require('../../shared/service/cabCorrecaoService');
router.use(autenticarToken);
/* ROTA GETONE cab_correcao */
router.get("/:id_empresa/:id",async function(req, res) {
try
	{
		const lsLista = await cabCorrecaoSrv.getCabCorrecao(req.params.id_empresa,req.params.id);
		if (lsLista == null)
		{
			res.status(409).json({ message: 'Correção Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA GETALL cab_correcao */
router.get("/",async function(req, res) {
try
	{
		const lsLista = await cabCorrecaoSrv.getCabCorrecoes();
		if (lsLista.length == 0)
		{
			res.status(409).json({ message: 'Nenhuma Informação Para Esta Consulta.'} );
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA INSERT cab_correcao */
router.post("/",async function(req, res) {
try
	{
		const cab = req.body;
		const registro = await cabCorrecaoSrv.insertCabCorrecao(cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Correção Cadastrada!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA UPDATE cab_correcao */
router.put("/",async function(req, res) {
try
	{
		const cab = req.body;
		const registro = await cabCorrecaoSrv.updateCabCorrecao(cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Correção Alterada Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA DELETE cab_correcao */
router.delete("/:id_empresa/:id",async function(req, res) {
try
	{
		await cabCorrecaoSrv.deleteCabCorrecao(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Correção Excluída Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST cab_correcao */
router.post("/cab_correcoes",async function(req, res) {
/*
	{
		"id_empresa":0,
		"id":0,
		"id_origem":0,
		"origem":"",
		"descricao":"",
		"id_sol":0,
		"id_exec":0,
		"tarefa":"",
		"cadastr":"",
		"status":"",
		"pagina":0,
		"tamPagina":50,
		"contador":"N",
		"orderby":"",
		"sharp":false
	}
*/
try
	{
		const params = req.body;
		const lsRegistros = await cabCorrecaoSrv.getCabCorrecoes(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Correção Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})

module.exports = router;
