/* ROUTE pafs_cab */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const paf_cabSrv = require('../../shared/service/paf_cabService');
router.use(autenticarToken); 
/* ROTA GETONE paf_cab */
router.get("/:id",async function(req, res) {
try 
	{
		const lsLista = await paf_cabSrv.getPaf_Cab(req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Paf_Cab Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'paf_cab', message: err.message });
		}
	}
})
/* ROTA GETALL paf_cab */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await paf_cabSrv.getPafs_Cab();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'paf_cab', message: err.message });
		}
	}
})
/* ROTA INSERT paf_cab */
router.post("/",async function(req, res) {
try 
	{
		const paf_cab = req.body;
		const registro = await paf_cabSrv.insertPaf_Cab(paf_cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Paf_Cab Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Paf_Cab', message: err.message });
		}
	}
})
/* ROTA UPDATE paf_cab */
router.put("/",async function(req, res) {
try 
	{
		const paf_cab = req.body;
		const registro = await paf_cabSrv.updatePaf_Cab(paf_cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Paf_Cab Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Paf_Cab', message: err.message });
		}
	}
})
/* ROTA DELETE paf_cab */
router.delete("/:id",async function(req, res) {
try 
	{
		await paf_cabSrv.deletePaf_Cab(req.params.id);
		res.status(200).json({ message: 'Paf_Cab Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Paf_Cab', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST pafs_cab */
router.post("/pafs_cab",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"nome_arquivo":"", 
		"file_name":"", 
		"processado":"", 
		"qtd_contratos":0, 
		"status":"", 
		"total_valor":0, 
		"status_assinatura":"", 
		"status_arquivo":"", 
		"ass_obs":"", 
		"ass_resposta":"", 
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
		const lsRegistros = await paf_cabSrv.getPafs_Cab(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Paf_Cab Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Paf_Cab', message: err.message });
		}
	}
})

module.exports = router;
