const pst_anexoSrv = require('../service/pst_anexoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO psts_anexos */

exports.pst_anexo_Inclusao = async function(pst_anexo) { 
	try { 
		const obj = await pst_anexoSrv.getPst_Anexo(pst_anexo.id_empresa,pst_anexo.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PST_ANEXO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.pst_anexo_Alteracao = async function(pst_anexo) { 
	try { 
		const obj = await pst_anexoSrv.getPst_Anexo(pst_anexo.id_empresa,pst_anexo.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PST_ANEXO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.pst_anexo_Exclusao = async function(id_empresa,id) { 
	try { 
		const obj = await pst_anexoSrv.getPst_Anexo(id_empresa,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PST_ANEXO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

