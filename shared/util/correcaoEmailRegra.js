const correcaoEmailSrv = require('../service/correcaoEmailService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO correcao_email */

exports.correcaoEmail_Inclusao = async function(cor) {
	try {
		const obj = await correcaoEmailSrv.getCorrecaoEmail(cor.id_empresa,cor.id_auditor);
		if (obj != null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CORRECAO_EMAIL', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.correcaoEmail_Alteracao = async function(cor) {
	try {
		const obj = await correcaoEmailSrv.getCorrecaoEmail(cor.id_empresa,cor.id_auditor);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CORRECAO_EMAIL', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.correcaoEmail_Exclusao = async function(id_empresa,id_auditor) {
	try {
		const obj = await correcaoEmailSrv.getCorrecaoEmail(id_empresa,id_auditor);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CORRECAO_EMAIL', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}
