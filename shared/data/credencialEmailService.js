/* SERVICE credencial_email */
const credencialEmailData = require('../../shared/data/credencialEmailData');
const validacao = require('../../shared/util/validacao');
const parametros = require('../../shared/util/credencialEmailParametros');
const erroDB = require('../../shared/util/userfunctiondb');
const regras = require('../../shared/util/credencialEmailRegra');
const TABELA = 'CREDENCIAL_EMAIL';
/* CRUD GET SERVICE */
exports.getCredencialEmail = async function(id_empresa,id){
	return credencialEmailData.getCredencialEmail(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getCredenciaisEmails = async function(params){
	return credencialEmailData.getCredenciaisEmails(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertCredencialEmail = async function(cred){
try
{
	await regras.credencialEmail_Inclusao(cred);
	validacao.Validacao(TABELA,cred, parametros.credencialEmail());
	return await credencialEmailData.insertCredencialEmail(cred);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - UPDATE - SERVICE */
exports.updateCredencialEmail = async function(cred){
try
{
	await regras.credencialEmail_Alteracao(cred);
	validacao.Validacao(TABELA,cred, parametros.credencialEmail());
	return await credencialEmailData.updateCredencialEmail(cred);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - DELETE - SERVICE */
exports.deleteCredencialEmail = async function(id_empresa,id){
try
{
	await regras.credencialEmail_Exclusao(id_empresa,id);
	return await credencialEmailData.deleteCredencialEmail(id_empresa,id);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
