/* ROUTE cab_correcao */
const express = require('express');
const router = express.Router();
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const cabCorrecaoSrv = require('../../shared/service/cabCorrecaoService');
const usuarioSrv = require("../../shared/service/usuarioService");
const tokenSrv = require("../../shared/service/tokenService");
const response = require("../../shared/util/respostaPadrao.js");
router.use(autenticarToken);
/* ROTA GETONE cab_correcao */
router.get("/:id_empresa/:id",async function(req, res) {
try
	{
		const lsLista = await cabCorrecaoSrv.getCabCorrecao(req.params.id_empresa,req.params.id);
		if (lsLista == null)
		{
			res.status(409).json({ message: 'Correção Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA GETALL cab_correcao */
router.get("/",async function(req, res) {
try
	{
		const lsLista = await cabCorrecaoSrv.getCabCorrecoes();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA INSERT cab_correcao */
router.post("/",async function(req, res) {
try
	{
		const cab = req.body;
		const registro = await cabCorrecaoSrv.insertCabCorrecao(cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Correção Cadastrada!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA UPDATE cab_correcao */
router.put("/",async function(req, res) {
try
	{
		const cab = req.body;
		const registro = await cabCorrecaoSrv.updateCabCorrecao(cab);
		if (registro == null)
		{
			res.status(409).json({ message: 'Correção Alterada Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA DELETE cab_correcao */
router.delete("/:id_empresa/:id",async function(req, res) {
try
	{
		await cabCorrecaoSrv.deleteCabCorrecao(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Correção Excluída Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST cab_correcao */
router.post("/cabcorrecoes",async function(req, res) {
/*
	{
		"id_empresa":0,
		"id":0,
		"id_origem":0,
		"origem":"",
		"id_sol":0,
		"id_exec":0,
		"tarefa":"",
		"cadastr":"",
		"status":"",
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
		const lsRegistros = await cabCorrecaoSrv.getCabCorrecoes(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Correção Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})
/* ROTA RESUMO POST cab_correcao por solicitante/executor */
router.post("/resumoexecutorsolicitante",async function(req, res) {
/*
	{
		"id_empresa":0,
		"id_solicitante":0,
		"id_executor":0,
		"foco":"",   // SOLICITANTE ou EXECUTOR
		"orderby":"" // 000001 = id, 000002 = nome (padrão)
	}
*/
try
	{
		const lsRegistros = await cabCorrecaoSrv.getResumoExecutorSolicitante(req.body);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Correção Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
		}
	}
})

router.post("/ajusta_status",async function(req, res) {
/*
	{
        "id_cab_correcao",
		"status":0,
	}
*/

		try {
			// Validação
			const dados = {
				id_empresa: req.id_empresa,
				id_usuario: req.id_usuario,
				id_cab_correcao: req.body.id_cab_correcao,
				status:req.body.status
			};

			const camposObrigatorios = [
				"id_empresa",
				"id_usuario",
				"id_cab_correcao",
				"status"
			];

			const camposAusentes = camposObrigatorios.filter(
				(campo) => !dados[campo],
			);

			if (camposAusentes.length > 0) {
				return response.validationError(res, camposAusentes);
			}

			const id_empresa      = req.id_empresa;
			const id_usuario      = req.id_usuario;
			const id_cab_correcao = req.body.id_cab_correcao;
			const status          = req.body.status;

			/* validar cab-correcao */
			let cab = await cabCorrecaoSrv.getCabCorrecao(id_empresa, id_cab_correcao);

			if (!cab) {
				return response.notFound(res, "CAB_CORRECAO", { id_cab_correcao });
			}

			if (cab.status == '0'){
				return response.error(res,"Status = 0, Não Aceita Mudança!",400,"")
			}

			if (status == '1'){
				return response.error(res,"Status = 1, Não Pode Ser Alterado Por Esta API!",400,"")
			}

	    	if (cab.status == '9'){
				return response.error(res,"Status = 9, Correção Encerrada!",400,"")
			}

			cab.status = status;

            cab.user_update = id_usuario;

			cab = await cabCorrecaoSrv.updateCabCorrecao(cab);

			return response.success(res, 'Status Alterado Com Sucesso!', {
				cabCorrecao: cab,
			});

		} catch (err) {
			if (err.name == "MyExceptionDB") {
				res.status(409).json(err);
			} else {
				res.status(500).json({
					erro: "BAK-END",
					tabela: "Cab-Correcao",
					message: err.message,
				});
			}
		} 
	},
);

router.post("/aceite_cabcorrecao",async function(req, res) {
/*
	{
		"id_cab_correcao": 1,
		"token": "token_aceite recebido no e-mail" } o executor é sempre o usuário logado (token de login) */

		try {
			// Validação
			const dados = {
				id_empresa: req.id_empresa,
				id_usuario: req.id_usuario,
				id_cab_correcao: req.body.id_cab_correcao,
				token: req.body.token
			};

			const camposObrigatorios = [
				"id_empresa",
				"id_usuario",
				"id_cab_correcao", "token" ];

			const camposAusentes = camposObrigatorios.filter(
				(campo) => !dados[campo],
			);

			if (camposAusentes.length > 0) {
				return response.validationError(res, camposAusentes);
			}

			const { id_empresa, id_usuario, id_cab_correcao } = dados;
				const id_exec = id_usuario;

				/* token do e-mail: válido, do tipo aceite, deste usuário, desta correção e desta empresa */
				const tokenAceite = await tokenSrv.verifyTokenAceite(dados.token);

				if (tokenAceite.status !== 200) {
					return response.error(res, `Link De Aceite Inválido Ou Expirado! ${tokenAceite.mensagem ?? ""}`.trim(), 403, "");
				}

				if (tokenAceite.id_usuario != id_usuario) {
					return response.error(res, "Este Link De Aceite Foi Enviado Para Outro Usuário!", 403, "");
				}

				if (tokenAceite.id_cab_correcao != id_cab_correcao || tokenAceite.id_empresa != id_empresa) {
					return response.error(res, "Este Link De Aceite Não Pertence A Esta Correção!", 403, "");
				}

			/* validar cab-correcao */
			let cab = await cabCorrecaoSrv.getCabCorrecao(id_empresa, id_cab_correcao);

			if (!cab) {
				return response.notFound(res, "CAB_CORRECAO", { id_cab_correcao });
			}

			if (cab.status != '1'){
				return response.error(res,`Status = ${cab.status}, Aceite Só Permitido Com Status = 1 (Aguardando Executor)!`,400,"")
			}

			/* validar executor */
			const exec = await usuarioSrv.getUsuario(id_empresa, id_exec);

			if (!exec) {
				return response.notFound(res, "USUARIO_EXEC", { id_exec });
			}

			cab.status      = '2';
			cab.id_exec     = id_exec;
			cab.user_update = id_usuario;

			cab = await cabCorrecaoSrv.updateCabCorrecao(cab);

			return response.success(res, 'Correção Aceita Com Sucesso!', {
				cabCorrecao: cab,
			});

		} catch (err) {
			if (err.name == "MyExceptionDB") {
				res.status(409).json(err);
			} else {
				res.status(500).json({
					erro: "BAK-END",
					tabela: "Cab-Correcao",
					message: err.message,
				});
			}
		}
	},
);

module.exports = router;
