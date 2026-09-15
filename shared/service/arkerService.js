/* SERVICE arker */
const arkerData = require('../../shared/data/arkerData');
const validacao = require('../../shared/util/validacao');
const parametros = require('../../shared/util/arkerParametros');
const erroDB = require('../../shared/util/userfunctiondb');
const regras = require('../../shared/util/arkerRegra');
const TABELA = 'ARKER';
/* CRUD GET SERVICE */
exports.getArker = async function(id_empresa,id){
	return arkerData.getArker(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getArkets = async function(params){
	return arkerData.getArkets(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertArker = async function(arker){
try 
{
	await regras.arker_Inclusao(arker);
	validacao.Validacao(TABELA,arker, parametros.arker());
	return arkerData.insertArker(arker);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateArker = async function(arker){
try 
{
	await regras.arker_Alteracao(arker);
	validacao.Validacao(TABELA,arker, parametros.arker());
	return arkerData.updateArker(arker);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteArker = async function(id_empresa,id){
try 
{
	await  regras.arker_Exclusao(id_empresa,id);
	return arkerData.deleteArker(id_empresa,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
