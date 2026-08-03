/* ROUTE contratos_cab */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const contrato_cabSrv = require('../../shared/service/contrato_cabService');
router.use(autenticarToken); 
/* ROTA GETONE contrato_cab */
router.get("/:id_empresa/:nome_arquivo/:pasta_arquivo/:aba",async function(req, res) {
try 
	{
		const lsLista = await contrato_cabSrv.getContrato_Cab(req.params.id_empresa,req.params.nome_arquivo,req.params.pasta_arquivo,req.params.aba);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Contrato_Cab Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'contrato_cab', message: err.message });
		}
	}
})
/* ROTA GETALL contrato_cab */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await contrato_cabSrv.getContratos_Cab();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'contrato_cab', message: err.message });
		}
	}
})
/* ROTA INSERT contrato_cab */
router.post("/",async function(req, res) {
try 
	{
		const contrato_cab = req.body;
		const registro = await contrato_cabSrv.insertContrato_Cab(contrato_cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Contrato_Cab Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Contrato_Cab', message: err.message });
		}
	}
})
/* ROTA UPDATE contrato_cab */
router.put("/",async function(req, res) {
try 
	{
		const contrato_cab = req.body;
		const registro = await contrato_cabSrv.updateContrato_Cab(contrato_cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Contrato_Cab Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Contrato_Cab', message: err.message });
		}
	}
})
/* ROTA DELETE contrato_cab */
router.delete("/:id_empresa/:nome_arquivo/:pasta_arquivo/:aba",async function(req, res) {
try 
	{
		await contrato_cabSrv.deleteContrato_Cab(req.params.id_empresa,req.params.nome_arquivo,req.params.pasta_arquivo,req.params.aba);
		res.status(200).json({ message: 'Contrato_Cab Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Contrato_Cab', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST contratos_cab */
router.post("/contratos_cab",async function(req, res) {
/*
	{
		"id_empresa":, 
		"nome_arquivo":"", 
		"pasta_arquivo":"", 
		"aba":"" 
	}
*/
try 
	{
		const params = req.body;
		const lsRegistros = await contrato_cabSrv.getContratos_Cab(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Contrato_Cab Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Contrato_Cab', message: err.message });
		}
	}
})

module.exports = router;
