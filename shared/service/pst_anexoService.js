/* SERVICE psts_anexos */
const pst_anexoData = require('../data/pst_anexoData');
const validacao = require('../util/validacao');
const parametros = require('../util/pst_anexoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/pst_anexoRegra');
const TABELA = 'PSTS_ANEXOS';
/* CRUD GET SERVICE */
exports.getPst_Anexo = async function(id_empresa,id){
	return pst_anexoData.getPst_Anexo(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getPsts_Anexos = async function(params){
	return pst_anexoData.getPsts_Anexos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertPst_Anexo = async function(pst_anexo){
try 
{
	await regras.pst_anexo_Inclusao(pst_anexo);
	validacao.Validacao(TABELA,pst_anexo, parametros.psts_anexos());
	return pst_anexoData.insertPst_Anexo(pst_anexo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updatePst_Anexo = async function(pst_anexo){try 
{
	await regras.pst_anexo_Alteracao(pst_anexo);
	validacao.Validacao(TABELA,pst_anexo, parametros.psts_anexos());
	return pst_anexoData.updatePst_Anexo(pst_anexo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deletePst_Anexo = async function(id_empresa,id){try 
{
	await  regras.pst_anexo_Exclusao(id_empresa,id);
	return pst_anexoData.deletePst_Anexo(id_empresa,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
