const paf_detSrv = require('../service/paf_detService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO paf_det */

exports.paf_det_Inclusao = async function(paf_det) { 
	try { 
		const obj = await paf_detSrv.getPaf_Det(paf_det.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PAF_DET', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.paf_det_Alteracao = async function(paf_det) { 
	try { 
		const obj = await paf_detSrv.getPaf_Det(paf_det.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PAF_DET', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.paf_det_Exclusao = async function(id) { 
	try { 
		const obj = await paf_detSrv.getPaf_Det(id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PAF_DET', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

