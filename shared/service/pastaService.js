/* SERVICE pastas */
const pastaData = require('../data/pastaData');
const validacao = require('../util/validacao');
const parametros = require('../util/pastaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/pastaRegra');
const TABELA = 'PASTAS';
/* CRUD GET SERVICE */
exports.getPasta = async function(id_empresa,id,sigla){
	return pastaData.getPasta(id_empresa,id,sigla);
};
/* CRUD GET ALL SERVICE */
exports.getPastas = async function(params){
	return pastaData.getPastas(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPasta = async function(pasta){
try 
{
	await regras.pasta_Inclusao(pasta);
	validacao.Validacao(TABELA,pasta, parametros.pastas());
	return pastaData.insertPasta(pasta);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePasta = async function(pasta){try 
{
	await regras.pasta_Alteracao(pasta);
	validacao.Validacao(TABELA,pasta, parametros.pastas());
	return pastaData.updatePasta(pasta);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePasta = async function(id_empresa,id,sigla){try 
{
	await  regras.pasta_Exclusao(id_empresa,id,sigla);
	return pastaData.deletePasta(id_empresa,id,sigla);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
