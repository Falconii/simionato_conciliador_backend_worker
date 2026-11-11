const acaoCorrecaoSrv = require('../service/acaoCorrecaoService');
const cabCorrecaoSrv = require('../service/cabCorrecaoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO acao_correcao */
/* Ações só têm CRUD com a correção em andamento ('2') ou aceita aguardando ação ('3') */
async function validaSituacaoCorrecao(operacao, id_empresa, id_cab_correcoes) {
	const cab = await cabCorrecaoSrv.getCabCorrecao(id_empresa, id_cab_correcoes);
	if (cab == null) {
		throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ACAO_CORRECAO', message: `"${operacao}" Correção Não Existe Na Base De Dados.!` }]);
	}
	if (cab.status != '2' && cab.status != '3') {
		throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ACAO_CORRECAO', message: `"${operacao}" Só Permitida Com A Correção Em Andamento Ou Aceita (Aguardando Ação).!` }]);
	}
	return cab;
}

/* o executor da ação não é escolhido: Upload De Arquivos ('1') = executor da correção;
   Exclusão De Arquivos ('2') = solicitante da correção */
function aplicaExecutor(acao, cab) {
	if (String(acao.flag_acao) === '1') {
		acao.id_exec = cab.id_exec;
	} else if (String(acao.flag_acao) === '2') {
		acao.id_exec = cab.id_sol;
	}
}


exports.acaoCorrecao_Inclusao = async function(acao) {
	try {
		const obj = await acaoCorrecaoSrv.getAcaoCorrecao(acao.id_empresa,acao.id);
		if (obj != null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ACAO_CORRECAO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
		const cab = await validaSituacaoCorrecao('INCLUSÃO', acao.id_empresa, acao.id_cab_correcoes);
		aplicaExecutor(acao, cab);
	} catch (err) {
		throw err;
	}


	return;
}

exports.acaoCorrecao_Alteracao = async function(acao) {
	try {
		const obj = await acaoCorrecaoSrv.getAcaoCorrecao(acao.id_empresa,acao.id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ACAO_CORRECAO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
		const cab = await validaSituacaoCorrecao('ALTERAÇÃO', obj.id_empresa, obj.id_cab_correcoes);
		aplicaExecutor(acao, cab);
	} catch (err) {
		throw err;
	}


	return;
}

exports.acaoCorrecao_Exclusao = async function(id_empresa,id) {
	try {
		const obj = await acaoCorrecaoSrv.getAcaoCorrecao(id_empresa,id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ACAO_CORRECAO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
		await validaSituacaoCorrecao('EXCLUSÃO', obj.id_empresa, obj.id_cab_correcoes);
	} catch (err) {
		throw err;
	}


	return;
}
