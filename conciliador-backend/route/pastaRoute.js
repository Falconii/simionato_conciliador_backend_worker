/* ROUTE pastas */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const pastaSrv = require('../../shared/service/pastaService');
router.use(autenticarToken); 
/* ROTA GETONE pasta */
router.get("/:id_empresa/:id/:sigla",async function(req, res) {
try 
	{
		const lsLista = await pastaSrv.getPasta(req.params.id_empresa,req.params.id,req.params.sigla);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Pasta Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'pasta', message: err.message });
		}
	}
})
/* ROTA GETALL pasta */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await pastaSrv.getPastas();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'pasta', message: err.message });
		}
	}
})
/* ROTA INSERT pasta */
router.post("/",async function(req, res) {
try 
	{
		const pasta = req.body;
		const registro = await pastaSrv.insertPasta(pasta);
		if (registro == null)
		{
			res.status(409).json({ message: 'Pasta Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pasta', message: err.message });
		}
	}
})
/* ROTA UPDATE pasta */
router.put("/",async function(req, res) {
try 
	{
		const pasta = req.body;
		const registro = await pastaSrv.updatePasta(pasta);
		if (registro == null)
		{
			res.status(409).json({ message: 'Pasta Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pasta', message: err.message });
		}
	}
})
/* ROTA DELETE pasta */
router.delete("/:id_empresa/:id/:sigla",async function(req, res) {
try 
	{
		await pastaSrv.deletePasta(req.params.id_empresa,req.params.id,req.params.sigla);
		res.status(200).json({ message: 'Pasta Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pasta', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST pastas */
router.post("/pastas",async function(req, res) {
/*
	{
		"id_empresa":, 
		"id":0, 
		"sigla":"", 
		"pasta":"" 
	}
*/
try 
	{
		const params = req.body;
		const lsRegistros = await pastaSrv.getPastas(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Pasta Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pasta', message: err.message });
		}
	}
})

module.exports = router;
