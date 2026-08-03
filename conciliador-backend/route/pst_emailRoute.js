/* ROUTE psts_emails */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const pst_emailSrv = require('../../shared/service/pst_emailService');
router.use(autenticarToken); 
/* ROTA GETONE pst_email */
router.get("/:id_empresa/:id",async function(req, res) {
try 
	{
		const lsLista = await pst_emailSrv.getPst_Email(req.params.id_empresa,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Pst_Email Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'pst_email', message: err.message });
		}
	}
})
/* ROTA GETALL pst_email */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await pst_emailSrv.getPsts_Emails();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'pst_email', message: err.message });
		}
	}
})
/* ROTA INSERT pst_email */
router.post("/",async function(req, res) {
try 
	{
		const pst_email = req.body;
		const registro = await pst_emailSrv.insertPst_Email(pst_email);
		if (registro == null)
		{
			res.status(409).json({ message: 'Pst_Email Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pst_Email', message: err.message });
		}
	}
})
/* ROTA UPDATE pst_email */
router.put("/",async function(req, res) {
try 
	{
		const pst_email = req.body;
		const registro = await pst_emailSrv.updatePst_Email(pst_email);
		if (registro == null)
		{
			res.status(409).json({ message: 'Pst_Email Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pst_Email', message: err.message });
		}
	}
})
/* ROTA DELETE pst_email */
router.delete("/:id_empresa/:id",async function(req, res) {
try 
	{
		await pst_emailSrv.deletePst_Email(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Pst_Email Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pst_Email', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST psts_emails */
router.post("/psts_emails",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"id_pafs_det":0, 
		"acordo":"", 
		"assunto_email":"", 
		"status_arquivos":"", 
		"status_assinatura":"", 
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
		const lsRegistros = await pst_emailSrv.getPsts_Emails(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Pst_Email Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pst_Email', message: err.message });
		}
	}
})

module.exports = router;
