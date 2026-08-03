/* SERVICE sim_historicos */
const sim_historicoData = require('../data/sim_historicoData');
const validacao = require('../util/validacao');
const parametros = require('../util/sim_historicoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/sim_historicoRegra');
const TABELA = 'SIM_HISTORICOS';
/* CRUD GET SERVICE */
exports.getSim_Historico = async function(id_empresa,id){
	return sim_historicoData.getSim_Historico(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getSim_Historicos = async function(params){
	return sim_historicoData.getSim_Historicos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertSim_Historico = async function(sim_historico){
try 
{
	await regras.sim_historico_Inclusao(sim_historico);
	validacao.Validacao(TABELA,sim_historico, parametros.sim_historicos());
	return sim_historicoData.insertSim_Historico(sim_historico);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateSim_Historico = async function(sim_historico){try 
{
	await regras.sim_historico_Alteracao(sim_historico);
	validacao.Validacao(TABELA,sim_historico, parametros.sim_historicos());
	return sim_historicoData.updateSim_Historico(sim_historico);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteSim_Historico = async function(id_empresa,id){try 
{
	await  regras.sim_historico_Exclusao(id_empresa,id);
	return sim_historicoData.deleteSim_Historico(id_empresa,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
