const credencialEmailSrv = require('../service/credencialEmailService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO credencial_email */

exports.credencialEmail_Inclusao = async function(cred) {
	try {
		const obj = await credencialEmailSrv.getCredencialEmail(cred.id_empresa,cred.id);
		if (obj != null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CREDENCIAL_EMAIL', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.credencialEmail_Alteracao = async function(cred) {
	try {
		const obj = await credencialEmailSrv.getCredencialEmail(cred.id_empresa,cred.id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CREDENCIAL_EMAIL', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.credencialEmail_Exclusao = async function(id_empresa,id) {
	try {
		const obj = await credencialEmailSrv.getCredencialEmail(id_empresa,id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CREDENCIAL_EMAIL', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}
