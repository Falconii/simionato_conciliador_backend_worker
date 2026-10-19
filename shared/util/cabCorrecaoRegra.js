const cabCorrecaoSrv = require('../service/cabCorrecaoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO cab_correcao */

exports.cabCorrecao_Inclusao = async function(cab) {
	try {
		const obj = await cabCorrecaoSrv.getCabCorrecao(cab.id_empresa,cab.id);
		if (obj != null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CAB_CORRECAO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.cabCorrecao_Alteracao = async function(cab) {
	try {
		const obj = await cabCorrecaoSrv.getCabCorrecao(cab.id_empresa,cab.id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CAB_CORRECAO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.cabCorrecao_Exclusao = async function(id_empresa,id) {
	try {
		const obj = await cabCorrecaoSrv.getCabCorrecao(id_empresa,id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CAB_CORRECAO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}
