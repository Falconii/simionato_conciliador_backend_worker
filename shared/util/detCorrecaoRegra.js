const detCorrecaoSrv = require('../service/detCorrecaoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO det_correcao */

exports.detCorrecao_Inclusao = async function(det) {
	try {
		const obj = await detCorrecaoSrv.getDetCorrecao(det.id_empresa,det.id);
		if (obj != null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DET_CORRECAO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.detCorrecao_Alteracao = async function(det) {
	try {
		const obj = await detCorrecaoSrv.getDetCorrecao(det.id_empresa,det.id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DET_CORRECAO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.detCorrecao_Exclusao = async function(id_empresa,id) {
	try {
		const obj = await detCorrecaoSrv.getDetCorrecao(id_empresa,id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DET_CORRECAO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}
