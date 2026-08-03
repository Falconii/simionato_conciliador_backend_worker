const paf_cabSrv = require('../service/paf_cabService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO pafs_cab */

exports.paf_cab_Inclusao = async function(paf_cab) { 
	try { 
		const obj = await paf_cabSrv.getPaf_Cab(paf_cab.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PAF_CAB', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.paf_cab_Alteracao = async function(paf_cab) { 
	try { 
		const obj = await paf_cabSrv.getPaf_Cab(paf_cab.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PAF_CAB', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.paf_cab_Exclusao = async function(id) { 
	try { 
		const obj = await paf_cabSrv.getPaf_Cab(id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PAF_CAB', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

