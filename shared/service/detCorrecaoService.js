/* SERVICE det_correcao */
const detCorrecaoData = require('../../shared/data/detCorrecaoData');
const cabCorrecaoData = require('../../shared/data/cabCorrecaoData');
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
	const registro = await detCorrecaoData.insertDetCorrecao(det);
	if (registro) await cabCorrecaoData.atualizaAguardandoResposta(registro.id_empresa, registro.id_cab);
	return registro;
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
	const det = await detCorrecaoData.getDetCorrecao(id_empresa,id);
	const retorno = await detCorrecaoData.deleteDetCorrecao(id_empresa,id);
	if (det) await cabCorrecaoData.atualizaAguardandoResposta(id_empresa, det.id_cab);
	return retorno;
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
