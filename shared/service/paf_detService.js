/* SERVICE paf_det */
const paf_detData = require('../data/paf_detData');
const validacao = require('../util/validacao');
const parametros = require('../util/paf_detParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/paf_detRegra');
const TABELA = 'PAF_DET';
/* CRUD GET SERVICE */
exports.getPaf_Det = async function(id){
	return paf_detData.getPaf_Det(id);
};
/* CRUD GET ALL SERVICE */
exports.getPafs_Det = async function(params){
	return paf_detData.getPafs_Det(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPaf_Det = async function(paf_det){
try 
{
	await regras.paf_det_Inclusao(paf_det);
	validacao.Validacao(TABELA,paf_det, parametros.paf_det());
	return paf_detData.insertPaf_Det(paf_det);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePaf_Det = async function(paf_det){try 
{
	await regras.paf_det_Alteracao(paf_det);
	validacao.Validacao(TABELA,paf_det, parametros.paf_det());
	return paf_detData.updatePaf_Det(paf_det);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePaf_Det = async function(id){try 
{
	await  regras.paf_det_Exclusao(id);
	return paf_detData.deletePaf_Det(id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
