const arkerSrv = require('../service/arkerService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO arker */

exports.arker_Inclusao = async function(arker) { 
	try { 
		const obj = await arkerSrv.getArker(arker.id_empresa,arker.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ARKER', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.arker_Alteracao = async function(arker) { 
	try { 
		const obj = await arkerSrv.getArker(arker.id_empresa,arker.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ARKER', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.arker_Exclusao = async function(id_empresa,id) { 
	try { 
		const obj = await arkerSrv.getArker(id_empresa,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ARKER', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

