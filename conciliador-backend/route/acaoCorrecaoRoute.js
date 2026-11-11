/* ROUTE acao_correcao */
const express = require('express');
const router = express.Router();
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const acaoCorrecaoSrv = require('../../shared/service/acaoCorrecaoService');
const funcoes = require('../../shared/email/funcoes.js');

/* avisa a contra-partida por e-mail sem prender a resposta da inclusão: erro só vai para o log */
function avisaNovaAcao(acao, registro) {
	funcoes.PreparaEmailAcaoCorrecao({ ...acao, ...registro })
		.then((envio) => console.log('E-mail ação da correção:', envio.message))
		.catch((err) => console.error('Erro no e-mail da ação da correção:', err));
}
router.use(autenticarToken);

/* a ação só é alterada ou excluída por quem a criou (user_insert). Responde 403 e devolve true quando não é o criador;
   ação inexistente segue para a regra de negócio, que já devolve a mensagem própria */
async function naoECriador(req, id_empresa, id, res, verbo) {
	const atual = await acaoCorrecaoSrv.getAcaoCorrecao(id_empresa, id);
	if (atual && Number(atual.user_insert) !== Number(req.id_usuario)) {
		res.status(403).json({ message: `Somente O Usuário Que Criou A Ação Pode ${verbo}` });
		return true;
	}
	return false;
}
/* ROTA GETONE acao_correcao */
router.get("/:id_empresa/:id",async function(req, res) {
try
	{
		const lsLista = await acaoCorrecaoSrv.getAcaoCorrecao(req.params.id_empresa,req.params.id);
		if (lsLista == null)
		{
			res.status(409).json({ message: 'Ação de Correção Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'acao_correcao', message: err.message });
		}
	}
})
/* ROTA GETALL acao_correcao */
router.get("/",async function(req, res) {
try
	{
		const lsLista = await acaoCorrecaoSrv.getAcoesCorrecoes();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'acao_correcao', message: err.message });
		}
	}
})
/* ROTA INSERT acao_correcao */
router.post("/",async function(req, res) {
try
	{
		const acao = req.body;
		const registro = await acaoCorrecaoSrv.insertAcaoCorrecao(acao);
		if (registro == null)
		{
			res.status(409).json({ message: 'Ação de Correção Cadastrada!' });
		}
		else
		{
			res.status(200).json(registro);
			avisaNovaAcao(acao, registro);
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'acao_correcao', message: err.message });
		}
	}
})
/* ROTA UPDATE acao_correcao */
router.put("/",async function(req, res) {
try
	{
		const acao = req.body;
		if (await naoECriador(req, acao.id_empresa, acao.id, res, 'Alterar')) return;
			const registro = await acaoCorrecaoSrv.updateAcaoCorrecao(acao);
		if (registro == null)
		{
			res.status(409).json({ message: 'Ação de Correção Alterada Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'acao_correcao', message: err.message });
		}
	}
})
/* ROTA DELETE acao_correcao */
router.delete("/:id_empresa/:id",async function(req, res) {
try
	{
		if (await naoECriador(req, req.params.id_empresa, req.params.id, res, 'Excluir')) return;
			await acaoCorrecaoSrv.deleteAcaoCorrecao(req.params.id_empresa,req.params.id);
		res.status(200).json({ message: 'Ação de Correção Excluída Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'acao_correcao', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST acao_correcao */
router.post("/acoes_correcoes",async function(req, res) {
/*
	{
		"id_empresa":0,
		"id":0,
		"id_cab_correcoes":0,
		"id_auditor":0,
		"id_exec":0,
		"flag_acao":"",
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
		const lsRegistros = await acaoCorrecaoSrv.getAcoesCorrecoes(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Ação de Correção Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'acao_correcao', message: err.message });
		}
	}
})

module.exports = router;
