/* SERVICE contratos_det */
const contrato_detData = require('../data/contrato_detData');
const validacao = require('../util/validacao');
const parametros = require('../util/contrato_detParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/contrato_detRegra');
const TABELA = 'CONTRATOS_DET';
/* CRUD GET SERVICE */
exports.getContrato_Det = async function(id){
	return contrato_detData.getContrato_Det(id);
};
/* CRUD GET ALL SERVICE */
exports.getContratos_Det = async function(params){
	return contrato_detData.getContratos_Det(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertContrato_Det = async function(contrato_det){
try 
{
	await regras.contrato_det_Inclusao(contrato_det);
	validacao.Validacao(TABELA,contrato_det, parametros.contratos_det());
	return contrato_detData.insertContrato_Det(contrato_det);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateContrato_Det = async function(contrato_det){try 
{
	await regras.contrato_det_Alteracao(contrato_det);
	validacao.Validacao(TABELA,contrato_det, parametros.contratos_det());
	return contrato_detData.updateContrato_Det(contrato_det);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteContrato_Det = async function(id){try 
{
	await  regras.contrato_det_Exclusao(id);
	return contrato_detData.deleteContrato_Det(id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
