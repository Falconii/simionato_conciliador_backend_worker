/* ROUTE credencial_email */
const express = require('express');
const router = express.Router();
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const credencialEmailSrv = require('../../shared/service/credencialEmailService');
router.use(autenticarToken);
/* ROTA GETONE credencial_email */
router.get("/:id_empresa/:id",async function(req, res) {
try
	{
		const lsLista = await credencialEmailSrv.getCredencialEmail(req.params.id_empresa,req.params.id);
		if (lsLista == null)
		{
			res.status(409).json({ message: 'Credencial de E-mail Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'credencial_email', message: err.message });
		}
	}
})
/* ROTA GETALL credencial_email */
router.get("/",async function(req, res) {
try
	{
		const lsLista = await credencialEmailSrv.getCredenciaisEmails();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'credencial_email', message: err.message });
		}
	}
})
/* ROTA INSERT credencial_email */
router.post("/",async function(req, res) {
try
	{
		const cred = req.body;
		const registro = await credencialEmailSrv.insertCredencialEmail(cred);
		if (registro == null)
		{
			res.status(409).json({ message: 'Credencial de E-mail Cadastrada!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'credencial_email', message: err.message });
		}
	}
})
/* ROTA UPDATE credencial_email */
router.put("/",async function(req, res) {
try
	{
		const cred = req.body;
		const registro = await credencialEmailSrv.updateCredencialEmail(cred);
		if (registro == null)
		{
			res.status(409).json({ message: 'Credencial de E-mail Alterada Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'credencial_email', message: err.message });
		}
	}
})
/* ROTA DELETE credencial_email */
router.delete("/:id_empresa/:id",async function(req, res) {
try
	{
		await credencialEmailSrv.deleteCredencialEmail(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Credencial de E-mail Excluída Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'credencial_email', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST credencial_email */
router.post("/credenciais_emails",async function(req, res) {
/*
	{
		"id_empresa":0,
		"id":0,
		"descricao":"",
		"email":"",
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
		const lsRegistros = await credencialEmailSrv.getCredenciaisEmails(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Credencial de E-mail Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'credencial_email', message: err.message });
		}
	}
})

module.exports = router;
