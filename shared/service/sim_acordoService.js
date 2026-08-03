/* SERVICE sim_acordos */
const sim_acordoData = require('../data/sim_acordoData');
const validacao = require('../util/validacao');
const parametros = require('../util/sim_acordoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/sim_acordoRegra');
const TABELA = 'SIM_ACORDOS';
/* CRUD GET SERVICE */
exports.getSim_Acordo = async function(id_empresa,id_sim,acordo){
	return sim_acordoData.getSim_Acordo(id_empresa,id_sim,acordo);
};
/* CRUD GET ALL SERVICE */
exports.getSim_Acordos = async function(params){
	return sim_acordoData.getSim_Acordos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertSim_Acordo = async function(sim_acordo){
try 
{
	await regras.sim_acordo_Inclusao(sim_acordo);
	validacao.Validacao(TABELA,sim_acordo, parametros.sim_acordos());
	return sim_acordoData.insertSim_Acordo(sim_acordo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateSim_Acordo = async function(sim_acordo){try 
{
	await regras.sim_acordo_Alteracao(sim_acordo);
	validacao.Validacao(TABELA,sim_acordo, parametros.sim_acordos());
	return sim_acordoData.updateSim_Acordo(sim_acordo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteSim_Acordo = async function(id_empresa,id_sim,acordo){try 
{
	await  regras.sim_acordo_Exclusao(id_empresa,id_sim,acordo);
	return sim_acordoData.deleteSim_Acordo(id_empresa,id_sim,acordo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
