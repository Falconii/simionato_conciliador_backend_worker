/* ROUTE arker */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const arkerSrv = require('../../shared/service/arkerService');
router.use(autenticarToken); 
/* ROTA GETONE arker */
router.get("/:id_empresa/:id",async function(req, res) {
try 
	{
		const lsLista = await arkerSrv.getArker(req.params.id_empresa,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Arker Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'arker', message: err.message });
		}
	}
})
/* ROTA GETALL arker */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await arkerSrv.getArkets();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'arker', message: err.message });
		}
	}
})
/* ROTA INSERT arker */
router.post("/",async function(req, res) {
try 
	{
		const arker = req.body;
		const registro = await arkerSrv.insertArker(arker);
		if (registro == null)
		{
			res.status(409).json({ message: 'Arker Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Arker', message: err.message });
		}
	}
})
/* ROTA UPDATE arker */
router.put("/",async function(req, res) {
try 
	{
		const arker = req.body;
		const registro = await arkerSrv.updateArker(arker);
		if (registro == null)
		{
			res.status(409).json({ message: 'Arker Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Arker', message: err.message });
		}
	}
})
/* ROTA DELETE arker */
router.delete("/:id_empresa/:id",async function(req, res) {
try 
	{
		await arkerSrv.deleteArker(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Arker Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Arker', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST arker */
router.post("/arkers",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"no_acao":"0", 
		"no_acordo":"0", 
		"data_lancamento":"", 
		"valor_liquido":, 
		"cod_fornecedor_execucao":"", 
		"denominacao_fornecedor_execucao":"", 
		"cnpj_fornecedor_execucao":"", 
		"denominacao_status_arker":"", 
		"frm_pagto":"", 
		"denominacao_bloqueio":"",
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
		const lsRegistros = await arkerSrv.getArkets(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Arker Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Arker', message: err.message });
		}
	}
})

module.exports = router;
