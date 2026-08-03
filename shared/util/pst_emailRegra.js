const pst_emailSrv = require('../service/pst_emailService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO psts_emails */

exports.pst_email_Inclusao = async function(pst_email) { 
	try { 
		const obj = await pst_emailSrv.getPst_Email(pst_email.id_empresa,pst_email.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PST_EMAIL', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.pst_email_Alteracao = async function(pst_email) { 
	try { 
		const obj = await pst_emailSrv.getPst_Email(pst_email.id_empresa,pst_email.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PST_EMAIL', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.pst_email_Exclusao = async function(id_empresa,id) { 
	try { 
		const obj = await pst_emailSrv.getPst_Email(id_empresa,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PST_EMAIL', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

