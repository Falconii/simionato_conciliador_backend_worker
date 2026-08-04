/* ROUTE tarefas */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const tarefaSrv = require('../../shared/service/tarefaService');
router.use(autenticarToken); 
/* ROTA GETONE tarefa */
router.get("/:id_empresa/:name_file",async function(req, res) {
try 
	{
		const lsLista = await tarefaSrv.getTarefa(req.params.id_empresa,req.params.name_file);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Tarefa Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'tarefa', message: err.message });
		}
	}
})
/* ROTA GETALL tarefa */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await tarefaSrv.getTarefas();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'tarefa', message: err.message });
		}
	}
})
/* ROTA INSERT tarefa */
router.post("/",async function(req, res) {
try 
	{
		const tarefa = req.body;
		const registro = await tarefaSrv.insertTarefa(tarefa);
		if (registro == null)
		{
			res.status(409).json({ message: 'Tarefa Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Tarefa', message: err.message });
		}
	}
})
/* ROTA UPDATE tarefa */
router.put("/",async function(req, res) {
try 
	{
		const tarefa = req.body;
		const registro = await tarefaSrv.updateTarefa(tarefa);
		if (registro == null)
		{
			res.status(409).json({ message: 'Tarefa Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Tarefa', message: err.message });
		}
	}
})
/* ROTA DELETE tarefa */
router.delete("/:id_empresa/:name_file",async function(req, res) {
try 
	{
		await tarefaSrv.deleteTarefa(req.params.id_empresa,req.params.name_file);
		res.status(200).json({ message: 'Tarefa Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Tarefa', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST tarefas */
router.post("/tarefas",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id":0, 
		"id_usuario":0, 
		"sigla":"0", 
		"name_file":"", 
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
		const lsRegistros = await tarefaSrv.getTarefas(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Tarefa Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Tarefa', message: err.message });
		}
	}
})

module.exports = router;
