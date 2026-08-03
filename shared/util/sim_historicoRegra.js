const sim_historicoSrv = require('../service/sim_historicoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO sim_historicos */

exports.sim_historico_Inclusao = async function(sim_historico) { 
	try { 
		const obj = await sim_historicoSrv.getSim_Historico(sim_historico.id_empresa,sim_historico.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'SIM_HISTORICO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.sim_historico_Alteracao = async function(sim_historico) { 
	try { 
		const obj = await sim_historicoSrv.getSim_Historico(sim_historico.id_empresa,sim_historico.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'SIM_HISTORICO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.sim_historico_Exclusao = async function(id_empresa,id) { 
	try { 
		const obj = await sim_historicoSrv.getSim_Historico(id_empresa,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'SIM_HISTORICO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

