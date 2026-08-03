const contrato_detSrv = require('../service/contrato_detService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO contratos_det */

exports.contrato_det_Inclusao = async function(contrato_det) { 
	try { 
		const obj = await contrato_detSrv.getContrato_Det(contrato_det.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CONTRATO_DET', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.contrato_det_Alteracao = async function(contrato_det) { 
	try { 
		const obj = await contrato_detSrv.getContrato_Det(contrato_det.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CONTRATO_DET', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.contrato_det_Exclusao = async function(id) { 
	try { 
		const obj = await contrato_detSrv.getContrato_Det(id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CONTRATO_DET', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

