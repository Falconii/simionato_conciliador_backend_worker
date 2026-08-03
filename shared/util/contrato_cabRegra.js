const contrato_cabSrv = require('../service/contrato_cabService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO contratos_cab */

exports.contrato_cab_Inclusao = async function(contrato_cab) { 
	try { 
		const obj = await contrato_cabSrv.getContrato_Cab(contrato_cab.id_empresa,contrato_cab.nome_arquivo,contrato_cab.pasta_arquivo,contrato_cab.aba);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CONTRATO_CAB', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.contrato_cab_Alteracao = async function(contrato_cab) { 
	try { 
		const obj = await contrato_cabSrv.getContrato_Cab(contrato_cab.id_empresa,contrato_cab.nome_arquivo,contrato_cab.pasta_arquivo,contrato_cab.aba);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CONTRATO_CAB', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.contrato_cab_Exclusao = async function(id_empresa,nome_arquivo,pasta_arquivo,aba) { 
	try { 
		const obj = await contrato_cabSrv.getContrato_Cab(id_empresa,nome_arquivo,pasta_arquivo,aba);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CONTRATO_CAB', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

