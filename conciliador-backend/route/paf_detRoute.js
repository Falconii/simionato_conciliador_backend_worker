/* ROUTE paf_det */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const paf_detSrv = require('../../shared/service/paf_detService');
router.use(autenticarToken); 
/* ROTA GETONE paf_det */
router.get("/:id",async function(req, res) {
try 
	{
		const lsLista = await paf_detSrv.getPaf_Det(req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Paf_Det Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'paf_det', message: err.message });
		}
	}
})
/* ROTA GETALL paf_det */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await paf_detSrv.getPafs_Det();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'paf_det', message: err.message });
		}
	}
})
/* ROTA INSERT paf_det */
router.post("/",async function(req, res) {
try 
	{
		const paf_det = req.body;
		const registro = await paf_detSrv.insertPaf_Det(paf_det);
		if (registro == null)
		{
			res.status(409).json({ message: 'Paf_Det Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Paf_Det', message: err.message });
		}
	}
})
/* ROTA UPDATE paf_det */
router.put("/",async function(req, res) {
try 
	{
		const paf_det = req.body;
		const registro = await paf_detSrv.updatePaf_Det(paf_det);
		if (registro == null)
		{
			res.status(409).json({ message: 'Paf_Det Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Paf_Det', message: err.message });
		}
	}
})
/* ROTA DELETE paf_det */
router.delete("/:id",async function(req, res) {
try 
	{
		await paf_detSrv.deletePaf_Det(req.params.id);
		res.status(200).json({ message: 'Paf_Det Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Paf_Det', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST paf_det */
router.post("/pafs_det",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"id_cab":0, 
		"file_name":"", 
		"status":"" 
	}
*/
try 
	{
		const params = req.body;
		const lsRegistros = await paf_detSrv.getPafs_Det(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Paf_Det Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Paf_Det', message: err.message });
		}
	}
})

module.exports = router;
