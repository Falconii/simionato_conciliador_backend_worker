/* SERVICE det_correcao */
const detCorrecaoData = require('../../shared/data/detCorrecaoData');
const validacao = require('../../shared/util/validacao');
const parametros = require('../../shared/util/detCorrecaoParametros');
const erroDB = require('../../shared/util/userfunctiondb');
const regras = require('../../shared/util/detCorrecaoRegra');
const TABELA = 'DET_CORRECAO';
/* CRUD GET SERVICE */
exports.getDetCorrecao = async function(id_empresa,id){
	return detCorrecaoData.getDetCorrecao(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getDetCorrecoes = async function(params){
	return detCorrecaoData.getDetCorrecoes(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertDetCorrecao = async function(det){
try
{
	await regras.detCorrecao_Inclusao(det);
	validacao.Validacao(TABELA,det, parametros.detCorrecao());
	return await detCorrecaoData.insertDetCorrecao(det);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - UPDATE - SERVICE */
exports.updateDetCorrecao = async function(det){
try
{
	await regras.detCorrecao_Alteracao(det);
	validacao.Validacao(TABELA,det, parametros.detCorrecao());
	return await detCorrecaoData.updateDetCorrecao(det);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - DELETE - SERVICE */
exports.deleteDetCorrecao = async function(id_empresa,id){
try
{
	await regras.detCorrecao_Exclusao(id_empresa,id);
	return await detCorrecaoData.deleteDetCorrecao(id_empresa,id);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
