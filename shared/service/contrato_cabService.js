/* SERVICE contratos_cab */
const contrato_cabData = require('../data/contrato_cabData');
const validacao = require('../util/validacao');
const parametros = require('../util/contrato_cabParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/contrato_cabRegra');
const TABELA = 'CONTRATOS_CAB';
/* CRUD GET SERVICE */
exports.getContrato_Cab = async function(id_empresa,nome_arquivo,pasta_arquivo,aba){
	return contrato_cabData.getContrato_Cab(id_empresa,nome_arquivo,pasta_arquivo,aba);
};
/* CRUD GET ALL SERVICE */
exports.getContratos_Cab = async function(params){
	return contrato_cabData.getContratos_Cab(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertContrato_Cab = async function(contrato_cab){
try 
{
	await regras.contrato_cab_Inclusao(contrato_cab);
	validacao.Validacao(TABELA,contrato_cab, parametros.contratos_cab());
	return contrato_cabData.insertContrato_Cab(contrato_cab);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateContrato_Cab = async function(contrato_cab){try 
{
	await regras.contrato_cab_Alteracao(contrato_cab);
	validacao.Validacao(TABELA,contrato_cab, parametros.contratos_cab());
	return contrato_cabData.updateContrato_Cab(contrato_cab);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteContrato_Cab = async function(id_empresa,nome_arquivo,pasta_arquivo,aba){try 
{
	await  regras.contrato_cab_Exclusao(id_empresa,nome_arquivo,pasta_arquivo,aba);
	return contrato_cabData.deleteContrato_Cab(id_empresa,nome_arquivo,pasta_arquivo,aba);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
