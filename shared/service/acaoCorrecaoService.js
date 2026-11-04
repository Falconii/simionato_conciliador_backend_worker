/* SERVICE acao_correcao */
const acaoCorrecaoData = require('../../shared/data/acaoCorrecaoData');
const validacao = require('../../shared/util/validacao');
const parametros = require('../../shared/util/acaoCorrecaoParametros');
const erroDB = require('../../shared/util/userfunctiondb');
const regras = require('../../shared/util/acaoCorrecaoRegra');
const TABELA = 'ACAO_CORRECAO';
/* CRUD GET SERVICE */
exports.getAcaoCorrecao = async function(id_empresa,id){
	return acaoCorrecaoData.getAcaoCorrecao(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getAcoesCorrecoes = async function(params){
	return acaoCorrecaoData.getAcoesCorrecoes(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertAcaoCorrecao = async function(acao){
try
{
	await regras.acaoCorrecao_Inclusao(acao);
	validacao.Validacao(TABELA,acao, parametros.acaoCorrecao());
	return await acaoCorrecaoData.insertAcaoCorrecao(acao);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - UPDATE - SERVICE */
exports.updateAcaoCorrecao = async function(acao){
try
{
	await regras.acaoCorrecao_Alteracao(acao);
	validacao.Validacao(TABELA,acao, parametros.acaoCorrecao());
	return await acaoCorrecaoData.updateAcaoCorrecao(acao);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
//* CRUD - DELETE - SERVICE */
exports.deleteAcaoCorrecao = async function(id_empresa,id){
try
{
	await regras.acaoCorrecao_Exclusao(id_empresa,id);
	return await acaoCorrecaoData.deleteAcaoCorrecao(id_empresa,id);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
