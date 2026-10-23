/* ROUTE det_correcao */
const express = require('express');
const router = express.Router();
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const detCorrecaoSrv = require('../../shared/service/detCorrecaoService');
router.use(autenticarToken);
/* ROTA GETONE det_correcao */
router.get("/:id_empresa/:id",async function(req, res) {
try
	{
		const lsLista = await detCorrecaoSrv.getDetCorrecao(req.params.id_empresa,req.params.id);
		if (lsLista == null)
		{
			res.status(409).json({ message: 'Detalhe de Correção Não Encontrado.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'det_correcao', message: err.message });
		}
	}
})
/* ROTA GETALL det_correcao */
router.get("/",async function(req, res) {
try
	{
		const lsLista = await detCorrecaoSrv.getDetCorrecoes();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'det_correcao', message: err.message });
		}
	}
})
/* ROTA INSERT det_correcao */
router.post("/",async function(req, res) {
try
	{
		const det = req.body;
		const registro = await detCorrecaoSrv.insertDetCorrecao(det);
		if (registro == null)
		{
			res.status(409).json({ message: 'Detalhe de Correção Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'det_correcao', message: err.message });
		}
	}
})
/* ROTA UPDATE det_correcao */
router.put("/",async function(req, res) {
try
	{
		const det = req.body;
		const registro = await detCorrecaoSrv.updateDetCorrecao(det);
		if (registro == null)
		{
			res.status(409).json({ message: 'Detalhe de Correção Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'det_correcao', message: err.message });
		}
	}
})
/* ROTA DELETE det_correcao */
router.delete("/:id_empresa/:id",async function(req, res) {
try
	{
		await detCorrecaoSrv.deleteDetCorrecao(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Detalhe de Correção Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'det_correcao', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST det_correcao */
router.post("/detcorrecoes",async function(req, res) {
/*
	{
		"id_empresa":0,
		"id":0,
		"id_cab":0,
		"data":"",
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
		const lsRegistros = await detCorrecaoSrv.getDetCorrecoes(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Detalhe de Correção Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'det_correcao', message: err.message });
		}
	}
})

module.exports = router;
