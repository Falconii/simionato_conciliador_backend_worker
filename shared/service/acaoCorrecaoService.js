/* SERVICE acao_correcao */
const acaoCorrecaoData = require('../../shared/data/acaoCorrecaoData');
const cabCorrecaoData = require('../../shared/data/cabCorrecaoData');
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
	const nova = await acaoCorrecaoData.insertAcaoCorrecao(acao);
	/* com ação pendente a correção Em Andamento (2) passa a Aceita - Aguardando Ação (3) */
	await cabCorrecaoData.marcarAguardandoAcao(acao.id_empresa, acao.id_cab_correcoes);
	return nova;
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
	const atualizada = await acaoCorrecaoData.updateAcaoCorrecao(acao);
	if (atualizada) {
		if (String(atualizada.status) === '1') {
			/* ação voltou a ficar pendente */
			await cabCorrecaoData.marcarAguardandoAcao(atualizada.id_empresa, atualizada.id_cab_correcoes);
		} else {
			/* ação concluída: se não restar ação pendente nem assinatura faltando, a correção é encerrada;
			   senão continua como está. O UPDATE de encerramento já confere as duas condições */
			await cabCorrecaoData.encerrarCabCorrecao(atualizada.id_empresa, atualizada.id_cab_correcoes, acao.user_update);
		}
	}
	return atualizada;
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
	const existente = await acaoCorrecaoData.getAcaoCorrecao(id_empresa,id);
	const excluida = await acaoCorrecaoData.deleteAcaoCorrecao(id_empresa,id);
	/* sem ação pendente, a correção Aceita - Aguardando Ação (3) volta para Em Andamento (2) */
	if (existente) {
		await cabCorrecaoData.voltarParaEmAndamento(id_empresa, existente.id_cab_correcoes);
	}
	return excluida;
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
