/* ROUTE psts_anexos */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const pst_anexoSrv = require('../../shared/service/pst_anexoService');
router.use(autenticarToken); 
/* ROTA GETONE pst_anexo */
router.get("/:id_empresa/:id",async function(req, res) {
try 
	{
		const lsLista = await pst_anexoSrv.getPst_Anexo(req.params.id_empresa,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Pst_Anexo Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'pst_anexo', message: err.message });
		}
	}
})
/* ROTA GETALL pst_anexo */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await pst_anexoSrv.getPsts_Anexos();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'pst_anexo', message: err.message });
		}
	}
})
/* ROTA INSERT pst_anexo */
router.post("/",async function(req, res) {
try 
	{
		const pst_anexo = req.body;
		const registro = await pst_anexoSrv.insertPst_Anexo(pst_anexo);
		if (registro == null)
		{
			res.status(409).json({ message: 'Pst_Anexo Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pst_Anexo', message: err.message });
		}
	}
})
/* ROTA UPDATE pst_anexo */
router.put("/",async function(req, res) {
try 
	{
		const pst_anexo = req.body;
		const registro = await pst_anexoSrv.updatePst_Anexo(pst_anexo);
		if (registro == null)
		{
			res.status(409).json({ message: 'Pst_Anexo Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pst_Anexo', message: err.message });
		}
	}
})
/* ROTA DELETE pst_anexo */
router.delete("/:id_empresa/:id",async function(req, res) {
try 
	{
		await pst_anexoSrv.deletePst_Anexo(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Pst_Anexo Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pst_Anexo', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST psts_anexos */
router.post("/psts_anexos",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"acordo":"", 
		"nome_arquivo_pst":"", 
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
		const lsRegistros = await pst_anexoSrv.getPsts_Anexos(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Pst_Anexo Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Pst_Anexo', message: err.message });
		}
	}
})

module.exports = router;
