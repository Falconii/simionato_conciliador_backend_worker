/* SERVICE correcao_email */
const correcaoEmailData = require('../../shared/data/correcaoEmailData');
const validacao = require('../../shared/util/validacao');
const parametros = require('../../shared/util/correcaoEmailParametros');
const erroDB = require('../../shared/util/userfunctiondb');
const regras = require('../../shared/util/correcaoEmailRegra');
const TABELA = 'CORRECAO_EMAIL';
/* CRUD GET SERVICE */
exports.getCorrecaoEmail = async function(id_empresa,id_auditor){
	return correcaoEmailData.getCorrecaoEmail(id_empresa,id_auditor);
};
/* CRUD GET ALL SERVICE */
exports.getCorrecoesEmails = async function(params){
	return correcaoEmailData.getCorrecoesEmails(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertCorrecaoEmail = async function(cor){
try
{
	await regras.correcaoEmail_Inclusao(cor);
	validacao.Validacao(TABELA,cor, parametros.correcaoEmail());
	return await correcaoEmailData.insertCorrecaoEmail(cor);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - UPDATE - SERVICE */
exports.updateCorrecaoEmail = async function(cor){
try
{
	await regras.correcaoEmail_Alteracao(cor);
	validacao.Validacao(TABELA,cor, parametros.correcaoEmail());
	return await correcaoEmailData.updateCorrecaoEmail(cor);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - DELETE - SERVICE */
exports.deleteCorrecaoEmail = async function(id_empresa,id_auditor){
try
{
	await regras.correcaoEmail_Exclusao(id_empresa,id_auditor);
	return await correcaoEmailData.deleteCorrecaoEmail(id_empresa,id_auditor);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
