/* SERVICE pafs_cab */
const paf_cabData = require('../data/paf_cabData');
const validacao = require('../util/validacao');
const parametros = require('../util/paf_cabParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/paf_cabRegra');
const TABELA = 'PAFS_CAB';
/* CRUD GET SERVICE */
exports.getPaf_Cab = async function(id){
	return paf_cabData.getPaf_Cab(id);
};
/* CRUD GET ALL SERVICE */
exports.getPafs_Cab = async function(params){
	return paf_cabData.getPafs_Cab(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPaf_Cab = async function(paf_cab){
try 
{
	await regras.paf_cab_Inclusao(paf_cab);
	validacao.Validacao(TABELA,paf_cab, parametros.pafs_cab());
	return paf_cabData.insertPaf_Cab(paf_cab);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePaf_Cab = async function(paf_cab){try 
{
	await regras.paf_cab_Alteracao(paf_cab);
	validacao.Validacao(TABELA,paf_cab, parametros.pafs_cab());
	return paf_cabData.updatePaf_Cab(paf_cab);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePaf_Cab = async function(id){try 
{
	await  regras.paf_cab_Exclusao(id);
	return paf_cabData.deletePaf_Cab(id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
