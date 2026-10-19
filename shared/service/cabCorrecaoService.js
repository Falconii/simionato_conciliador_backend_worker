/* SERVICE cab_correcao */
const cabCorrecaoData = require('../../shared/data/cabCorrecaoData');
const validacao = require('../../shared/util/validacao');
const parametros = require('../../shared/util/cabCorrecaoParametros');
const erroDB = require('../../shared/util/userfunctiondb');
const regras = require('../../shared/util/cabCorrecaoRegra');
const TABELA = 'CAB_CORRECAO';
/* CRUD GET SERVICE */
exports.getCabCorrecao = async function(id_empresa,id){
	return cabCorrecaoData.getCabCorrecao(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getCabCorrecoes = async function(params){
	return cabCorrecaoData.getCabCorrecoes(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertCabCorrecao = async function(cab){
try
{
	await regras.cabCorrecao_Inclusao(cab);
	validacao.Validacao(TABELA,cab, parametros.cabCorrecao());
	return await cabCorrecaoData.insertCabCorrecao(cab);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - UPDATE - SERVICE */
exports.updateCabCorrecao = async function(cab){
try
{
	await regras.cabCorrecao_Alteracao(cab);
	validacao.Validacao(TABELA,cab, parametros.cabCorrecao());
	return await cabCorrecaoData.updateCabCorrecao(cab);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - DELETE - SERVICE */
exports.deleteCabCorrecao = async function(id_empresa,id){
try
{
	await regras.cabCorrecao_Exclusao(id_empresa,id);
	return await cabCorrecaoData.deleteCabCorrecao(id_empresa,id);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
