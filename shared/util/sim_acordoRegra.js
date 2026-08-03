const sim_acordoSrv = require('../service/sim_acordoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO sim_acordos */

exports.sim_acordo_Inclusao = async function(sim_acordo) { 
	try { 
		const obj = await sim_acordoSrv.getSim_Acordo(sim_acordo.id_empresa,sim_acordo.id_sim,sim_acordo.acordo);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'SIM_ACORDO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.sim_acordo_Alteracao = async function(sim_acordo) { 
	try { 
		const obj = await sim_acordoSrv.getSim_Acordo(sim_acordo.id_empresa,sim_acordo.id_sim,sim_acordo.acordo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'SIM_ACORDO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.sim_acordo_Exclusao = async function(id_empresa,id_sim,acordo) { 
	try { 
		const obj = await sim_acordoSrv.getSim_Acordo(id_empresa,id_sim,acordo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'SIM_ACORDO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

