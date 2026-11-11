/* ROUTE cab_correcao */
const express = require('express');
const router = express.Router();
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const cabCorrecaoSrv = require('../../shared/service/cabCorrecaoService');
const usuarioSrv = require("../../shared/service/usuarioService");
const tokenSrv = require("../../shared/service/tokenService");
const response = require("../../shared/util/respostaPadrao.js");
router.use(autenticarToken);
/* ROTA PENDÊNCIAS do usuário logado: o usuário vem do token, nunca do cliente.
   { aguardando_resposta: n, abertas: n } */
router.get("/pendencias",async function(req, res) {
try
	{
		const pendencias = await cabCorrecaoSrv.getPendencias(req.id_empresa, req.id_usuario);
		res.status(200).json(pendencias);
	}
catch (err)
	{
		res.status(500).json({ erro: 'BAK-END', tabela: 'cab_correcao', message: err.message });
	}
})
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
		/* só o solicitante da correção exclui (a tela avisa antes; aqui é a trava de verdade).
		   A regra de status 0 ou 1 fica em cabCorrecao_Exclusao */
		const cab = await cabCorrecaoSrv.getCabCorrecao(req.params.id_empresa,req.params.id);
		if (cab && cab.id_sol != req.id_usuario)
		{
			return res.status(403).json({ message: 'Somente O Usuário Solicitante Pode Excluir' });
		}
		await cabCorrecaoSrv.deleteCabCorrecao(req.params.id_empresa,req.params.id,req.id_usuario);
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

/* ROTA ENCERRAMENTO: passa a correção para 9 (Encerrada). Só o solicitante, e só com status 2 ou 3.
   Corpo: { "id_cab_correcao": 1 } */
router.post("/encerrar",async function(req, res) {
	try {
		const id_cab_correcao = Number(req.body?.id_cab_correcao);
		if (!Number.isInteger(id_cab_correcao) || id_cab_correcao <= 0) {
			return response.validationError(res, ["id_cab_correcao"]);
		}

		const r = await cabCorrecaoSrv.encerrarCabCorrecao(req.id_empresa, id_cab_correcao, req.id_usuario);
		if (!r.ok) {
			return response.error(res, r.mensagem, r.codigo, "");
		}

		const cab = await cabCorrecaoSrv.getCabCorrecao(req.id_empresa, id_cab_correcao);
		return response.success(res, r.mensagem, { cabCorrecao: cab });
	} catch (err) {
		if (err.name == "MyExceptionDB") {
			res.status(409).json(err);
		} else {
			res.status(500).json({ erro: "BAK-END", tabela: "Cab-Correcao", message: err.message });
		}
	}
});

/* ROTA ACEITE EM LOTE: o usuário logado vira executor das correções com status 1 que ele pode aceitar.
   Só atualiza o banco (sem e-mail). Corpo: { "ids": [1,2,3] }  ou  { "filtro": { ...mesmos campos da consulta } }
   Retorno: { total, aceitas, recusadas, itens:[{ id, aceita, mensagem }] } */
router.post("/aceite_lote",async function(req, res) {
	try {
		const { ids, filtro } = req.body || {};
		const max = cabCorrecaoSrv.MAX_ACEITE_LOTE;
		let lista;
		let totalFiltro;

		if (Array.isArray(ids)) {
			lista = [...new Set(ids.map(Number))];
			if (lista.length === 0 || lista.some((id) => !Number.isInteger(id) || id <= 0)) {
				return response.error(res, "Informe Ids De Correção Válidos!", 400, "");
			}
			if (lista.length > max) {
				return response.error(res, `Aceite Em Lote Aceita No Máximo ${max} Correções Por Vez!`, 400, "");
			}
		} else if (filtro && typeof filtro === 'object') {
			const selecao = await cabCorrecaoSrv.selecionarParaAceite(req.id_empresa, req.id_usuario, filtro);
			lista = selecao.ids;
			totalFiltro = selecao.total_filtro;
		} else {
			return response.error(res, "Informe Os Ids Ou O Filtro Das Correções!", 400, "");
		}

		const resultado = await cabCorrecaoSrv.aceitarCabCorrecoes(req.id_empresa, req.id_usuario, lista);
		if (totalFiltro !== undefined) {
			resultado.total_filtro = totalFiltro;
		}

		return response.success(res, `${resultado.aceitas} De ${resultado.total} Correções Aceitas!`, resultado);
	} catch (err) {
		if (err.name == "MyExceptionDB") {
			res.status(409).json(err);
		} else {
			res.status(500).json({ erro: "BAK-END", tabela: "Cab-Correcao", message: err.message });
		}
	}
});

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
