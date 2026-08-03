/* SERVICE arquivos_google */
const arquivo_googleData = require('../data/arquivo_googleData');
const validacao = require('../util/validacao');
const parametros = require('../util/arquivo_googleParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/arquivo_googleRegra');
const TABELA = 'ARQUIVOS_GOOGLE';
/* CRUD GET SERVICE */
exports.getArquivo_Google = async function(id_empresa,id_file){
	return arquivo_googleData.getArquivo_Google(id_empresa,id_file);
};
/* CRUD GET ALL SERVICE */
exports.getArquivos_Google = async function(params){
	return arquivo_googleData.getArquivos_Google(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertArquivo_Google = async function(arquivo_google){
try 
{
	await regras.arquivo_google_Inclusao(arquivo_google);
	validacao.Validacao(TABELA,arquivo_google, parametros.arquivos_google());
	return arquivo_googleData.insertArquivo_Google(arquivo_google);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateArquivo_Google = async function(arquivo_google){try 
{
	await regras.arquivo_google_Alteracao(arquivo_google);
	validacao.Validacao(TABELA,arquivo_google, parametros.arquivos_google());
	return arquivo_googleData.updateArquivo_Google(arquivo_google);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteArquivo_Google = async function(id_empresa,id_file){try 
{
	await  regras.arquivo_google_Exclusao(id_empresa,id_file);
	return arquivo_googleData.deleteArquivo_Google(id_empresa,id_file);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
