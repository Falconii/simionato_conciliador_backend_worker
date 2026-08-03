/* SERVICE psts_emails */
const pst_emailData = require('../data/pst_emailData');
const validacao = require('../util/validacao');
const parametros = require('../util/pst_emailParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/pst_emailRegra');
const TABELA = 'PSTS_EMAILS';
/* CRUD GET SERVICE */
exports.getPst_Email = async function(id_empresa,id){
	return pst_emailData.getPst_Email(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getPsts_Emails = async function(params){
	return pst_emailData.getPsts_Emails(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPst_Email = async function(pst_email){
try 
{
	await regras.pst_email_Inclusao(pst_email);
	validacao.Validacao(TABELA,pst_email, parametros.psts_emails());
	return pst_emailData.insertPst_Email(pst_email);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePst_Email = async function(pst_email){try 
{
	await regras.pst_email_Alteracao(pst_email);
	validacao.Validacao(TABELA,pst_email, parametros.psts_emails());
	return pst_emailData.updatePst_Email(pst_email);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePst_Email = async function(id_empresa,id){try 
{
	await  regras.pst_email_Exclusao(id_empresa,id);
	return pst_emailData.deletePst_Email(id_empresa,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
