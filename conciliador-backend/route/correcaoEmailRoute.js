/* ROUTE correcao_email */
const express = require('express');
const router = express.Router();
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const correcaoEmailSrv = require('../../shared/service/correcaoEmailService');
router.use(autenticarToken);
/* ROTA GETONE correcao_email */
router.get("/:id_empresa/:id_auditor",async function(req, res) {
try
	{
		const lsLista = await correcaoEmailSrv.getCorrecaoEmail(req.params.id_empresa,req.params.id_auditor);
		if (lsLista == null)
		{
			res.status(409).json({ message: 'Correção de E-mail Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'correcao_email', message: err.message });
		}
	}
})
/* ROTA GETALL correcao_email */
router.get("/",async function(req, res) {
try
	{
		const lsLista = await correcaoEmailSrv.getCorrecoesEmails();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'correcao_email', message: err.message });
		}
	}
})
/* ROTA INSERT correcao_email */
router.post("/",async function(req, res) {
try
	{
		const cor = req.body;
		const registro = await correcaoEmailSrv.insertCorrecaoEmail(cor);
		if (registro == null)
		{
			res.status(409).json({ message: 'Correção de E-mail Cadastrada!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'correcao_email', message: err.message });
		}
	}
})
/* ROTA UPDATE correcao_email */
router.put("/",async function(req, res) {
try
	{
		const cor = req.body;
		const registro = await correcaoEmailSrv.updateCorrecaoEmail(cor);
		if (registro == null)
		{
			res.status(409).json({ message: 'Correção de E-mail Alterada Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'correcao_email', message: err.message });
		}
	}
})
/* ROTA DELETE correcao_email */
router.delete("/:id_empresa/:id_auditor",async function(req, res) {
try
	{
		await correcaoEmailSrv.deleteCorrecaoEmail(req.params.id_empresa,req.params.id_auditor);
		res.status(200).json({ message: 'Correção de E-mail Excluída Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'correcao_email', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST correcao_email */
router.post("/correcoes_emails",async function(req, res) {
/*
	{
		"id_empresa":0,
		"id":0,
		"id_auditor":0,
		"auditor_grupo":0,
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
		const lsRegistros = await correcaoEmailSrv.getCorrecoesEmails(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Correção de E-mail Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'correcao_email', message: err.message });
		}
	}
})

module.exports = router;
