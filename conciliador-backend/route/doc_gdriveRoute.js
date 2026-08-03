/* ROUTE docs_gdrives */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const doc_gdriveSrv = require('../../shared/service/doc_gdriveService');
router.use(autenticarToken); 
/* ROTA GETONE doc_gdrive */
router.get("/:id_empresa/:id",async function(req, res) {
try 
	{
		const lsLista = await doc_gdriveSrv.getDoc_Gdrive(req.params.id_empresa,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Doc_Gdrive Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'doc_gdrive', message: err.message });
		}
	}
})
/* ROTA GETALL doc_gdrive */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await doc_gdriveSrv.getDocs_Gdrives();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'doc_gdrive', message: err.message });
		}
	}
})
/* ROTA INSERT doc_gdrive */
router.post("/",async function(req, res) {
try 
	{
		const doc_gdrive = req.body;
		const registro = await doc_gdriveSrv.insertDoc_Gdrive(doc_gdrive);
		if (registro == null)
		{
			res.status(409).json({ message: 'Doc_Gdrive Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Doc_Gdrive', message: err.message });
		}
	}
})
/* ROTA UPDATE doc_gdrive */
router.put("/",async function(req, res) {
try 
	{
		const doc_gdrive = req.body;
		const registro = await doc_gdriveSrv.updateDoc_Gdrive(doc_gdrive);
		if (registro == null)
		{
			res.status(409).json({ message: 'Doc_Gdrive Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Doc_Gdrive', message: err.message });
		}
	}
})
/* ROTA DELETE doc_gdrive */
router.delete("/:id_empresa/:id",async function(req, res) {
try 
	{
		await doc_gdriveSrv.deleteDoc_Gdrive(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Doc_Gdrive Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Doc_Gdrive', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST docs_gdrives */
router.post("/docs_gdrives",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"id_folder":"", 
		"id_file":"", 
		"file_name":"", 
		"origem":"", 
		"file_name_original":"", 
		"status_upload":"", 
		"id_origem":0, 
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
		const lsRegistros = await doc_gdriveSrv.getDocs_Gdrives(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Doc_Gdrive Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Doc_Gdrive', message: err.message });
		}
	}
})

module.exports = router;
