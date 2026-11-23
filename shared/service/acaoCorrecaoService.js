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
			/* ação concluída: a correção não é encerrada aqui, o encerramento é da própria correção */
			const { verificacao } = await aposConclusaoAcao(atualizada, acao.user_update);
			return { ...atualizada, aguardando_verificacao: verificacao };
		}
	}
	return atualizada;
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};
/* O que acontece com a correção depois que uma ação é concluída (nunca a encerra: o encerramento é da própria correção):
   - upload concluído e sem outro upload pendente: Aguardando Verificação (4), o solicitante confere os arquivos
     (exclusão pendente não impede: é do próprio solicitante);
   - sem nenhuma ação pendente: a correção Aceita (3) volta para Em Andamento (2) e, por compatibilidade, a
     assinatura do documento de origem fica com resposta 'S' e obs vazia.
   Devolve quantas ações ainda estão pendentes e se a correção acabou de passar para Aguardando Verificação
   (a rota usa isso para avisar o solicitante por e-mail; o aviso não fica aqui para não criar dependência circular) */
async function aposConclusaoAcao(acao, id_usuario) {
	const { id_empresa, id_cab_correcoes } = acao;
	let verificacao = false;
	if (String(acao.flag_acao) === '1') {
		const uploads = await cabCorrecaoData.contarAcoesPendentes(id_empresa, id_cab_correcoes, '1');
		if (uploads === 0) {
			verificacao = !!(await cabCorrecaoData.marcarAguardandoVerificacao(id_empresa, id_cab_correcoes));
		}
	}
	const pendentes = await cabCorrecaoData.contarAcoesPendentes(id_empresa, id_cab_correcoes);
	if (pendentes === 0) {
		await cabCorrecaoData.voltarParaEmAndamento(id_empresa, id_cab_correcoes);
		await cabCorrecaoData.liberarAssinaturaOrigem(id_empresa, id_cab_correcoes, id_usuario);
	}
	return { pendentes, verificacao };
}
/* Conclui a ação depois da execução (ex.: upload do arquivo).
   Devolve a ação concluída com acoes_pendentes (as que restam) e status_cab (situação da correção depois da
   conclusão), ou null se ela já não estava pendente */
exports.executarAcaoCorrecao = async function(id_empresa, id, id_docs_gdrives, id_usuario){
try
{
	const executada = await acaoCorrecaoData.executarAcaoCorrecao(id_empresa, id, id_docs_gdrives, id_usuario);
	if (!executada) return null;
	const { pendentes, verificacao } = await aposConclusaoAcao(executada, id_usuario);
	const cab = await cabCorrecaoData.getCabCorrecao(executada.id_empresa, executada.id_cab_correcoes);
	return { ...executada, acoes_pendentes: pendentes, status_cab: cab ? cab.status : '', aguardando_verificacao: verificacao };
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
