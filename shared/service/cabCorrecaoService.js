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
/* PENDÊNCIAS DO USUÁRIO SERVICE */
exports.getPendencias = async function(id_empresa, id_usuario){
	return cabCorrecaoData.getPendencias(id_empresa, id_usuario);
};
/* RESUMO EXECUTOR/SOLICITANTE SERVICE */
exports.getResumoExecutorSolicitante = async function(params){
	return cabCorrecaoData.getResumoExecutorSolicitante(params || {});
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
	const registro = await cabCorrecaoData.updateCabCorrecao(cab);
	if (registro) {
		await cabCorrecaoData.atualizaAguardandoResposta(registro.id_empresa, registro.id);
		/* devolve o valor já recalculado */
		return (await cabCorrecaoData.getCabCorrecao(registro.id_empresa, registro.id)) ?? registro;
	}
	return registro;
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
