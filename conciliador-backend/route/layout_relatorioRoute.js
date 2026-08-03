/* ROUTE layouts_relatorios */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const layout_relatorioSrv = require('../../shared/service/layout_relatorioService');
router.use(autenticarToken); 
/* ROTA GETONE layout_relatorio */
router.get("/:id_empresa/:layout",async function(req, res) {
try 
	{
		const lsLista = await layout_relatorioSrv.getLayout_Relatorio(req.params.id_empresa,req.params.layout);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Layout_Relatorio Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'layout_relatorio', message: err.message });
		}
	}
})
/* ROTA GETALL layout_relatorio */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await layout_relatorioSrv.getLayouts_Relatorios();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'layout_relatorio', message: err.message });
		}
	}
})
/* ROTA INSERT layout_relatorio */
router.post("/",async function(req, res) {
try 
	{
		const layout_relatorio = req.body;
		const registro = await layout_relatorioSrv.insertLayout_Relatorio(layout_relatorio);
		if (registro == null)
		{
			res.status(409).json({ message: 'Layout_Relatorio Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Layout_Relatorio', message: err.message });
		}
	}
})
/* ROTA UPDATE layout_relatorio */
router.put("/",async function(req, res) {
try 
	{
		const layout_relatorio = req.body;
		const registro = await layout_relatorioSrv.updateLayout_Relatorio(layout_relatorio);
		if (registro == null)
		{
			res.status(409).json({ message: 'Layout_Relatorio Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Layout_Relatorio', message: err.message });
		}
	}
})
/* ROTA DELETE layout_relatorio */
router.delete("/:id_empresa/:layout",async function(req, res) {
try 
	{
		await layout_relatorioSrv.deleteLayout_Relatorio(req.params.id_empresa,req.params.layout);
		res.status(200).json({ message: 'Layout_Relatorio Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Layout_Relatorio', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST layouts_relatorios */
router.post("/layouts_relatorios",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"layout":"", 
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
		const lsRegistros = await layout_relatorioSrv.getLayouts_Relatorios(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Layout_Relatorio Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Layout_Relatorio', message: err.message });
		}
	}
})

module.exports = router;
