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
exports.deleteCabCorrecao = async function(id_empresa,id,id_usuario){
try
{
	await regras.cabCorrecao_Exclusao(id_empresa,id);
	return await cabCorrecaoData.deleteCabCorrecao(id_empresa,id,id_usuario);
}
catch (err)
{
	throw new erroDB.UserException(err.erro, err);
}
};

/* ACEITE EM LOTE SERVICE
   Só atualiza o banco (sem e-mail). Quem pode aceitar segue a regra do e-mail de aceite (util/grupoAceite).
   Cada correção é tratada sozinha: a que não puder ser aceita volta com o motivo e não impede as outras */
exports.MAX_ACEITE_LOTE = 100;

/* motivo da recusa, olhando a correção depois de o UPDATE condicional não ter atualizado nenhuma linha */
function motivoRecusaAceite(cab) {
	if (!cab) return 'Correção Não Encontrada';
	if (Number(cab.id_exec) > 0) return 'Esta Correção Já Possui Executor';
	if (cab.status == '0') return 'Esta Correção Ainda Não Foi Enviada Para Aceite';
	if (cab.status != '1') return 'Esta Correção Não Está Aguardando Executor';
	return 'Você Não Está Autorizado A Aceitar Esta Correção';
}

exports.aceitarCabCorrecoes = async function(id_empresa, id_usuario, ids){
	const itens = [];

	for (const id of ids) {
		const aceita = await cabCorrecaoData.aceitarCabCorrecao(id_empresa, id, id_usuario);

		if (aceita) {
			/* igual ao aceite individual: recalcula quem aguarda a próxima resposta */
			await cabCorrecaoData.atualizaAguardandoResposta(id_empresa, id);
			itens.push({ id, aceita: true, mensagem: 'Correção Aceita' });
		} else {
			const cab = await cabCorrecaoData.getCabCorrecao(id_empresa, id);
			itens.push({ id, aceita: false, mensagem: motivoRecusaAceite(cab) });
		}
	}

	const aceitas = itens.filter((i) => i.aceita).length;
	return { total: itens.length, aceitas, recusadas: itens.length - aceitas, itens };
};

/* ids das correções do filtro que o usuário pode aceitar (situação 1), até o limite do lote.
   O filtro vem da tela, mas empresa, situação, usuário e página são sempre impostos aqui */
exports.selecionarParaAceite = async function(id_empresa, id_usuario, filtro){
	const base = {
		...(filtro || {}),
		id_empresa,
		status: '1',
		aceitavel_por: id_usuario,
		orderby: '000001',
	};

	const contagem = await cabCorrecaoData.getCabCorrecoes({ ...base, contador: 'S' });
	const lista = await cabCorrecaoData.getCabCorrecoes({
		...base,
		contador: 'N',
		pagina: 1,
		tamPagina: exports.MAX_ACEITE_LOTE,
	});

	return { total_filtro: contagem.total, ids: lista.map((c) => c.id) };
};

/* ENCERRAMENTO SERVICE
   Só o solicitante encerra, só correção Em Andamento (2) ou Aceita - Aguardando Ação (3), e só sem assinatura
   pendente nem ação pendente. Devolve { ok, codigo, mensagem }: o motivo da recusa já vem pronto para a tela */

/* por que a correção não pode ser encerrada agora; null = pode */
async function motivoNaoEncerra(id_empresa, id) {
	const cab = await cabCorrecaoData.getCabCorrecao(id_empresa, id);

	if (!cab) {
		return { codigo: 404, mensagem: 'Correção Não Encontrada' };
	}
	if (cab.status == '9') {
		return { codigo: 400, mensagem: 'Esta Correção Já Está Encerrada' };
	}
	if (cab.status != '2' && cab.status != '3') {
		return { codigo: 400, mensagem: 'Só É Possível Encerrar Correção Em Andamento Ou Aceita, Aguardando Ação!' };
	}

	const pendencias = [];

	const faltam = [];
	if (cab.status_assinatura_cliente == 'N') faltam.push('Cliente');
	if (cab.status_assinatura_gp == 'N') faltam.push('GP');
	if (faltam.length > 0) {
		pendencias.push(`Assinatura Pendente (${faltam.join(' E ')})`);
	}

	const acoes = await cabCorrecaoData.contarAcoesPendentes(id_empresa, id);
	if (acoes > 0) {
		pendencias.push(`Ação Pendente (${acoes})`);
	}

	if (pendencias.length > 0) {
		return { codigo: 400, mensagem: `Não É Possível Encerrar: ${pendencias.join(' E ')}!` };
	}
	return null;
}

exports.encerrarCabCorrecao = async function(id_empresa, id, id_usuario){
	const cab = await cabCorrecaoData.getCabCorrecao(id_empresa, id);

	if (!cab) {
		return { ok: false, codigo: 404, mensagem: 'Correção Não Encontrada' };
	}
	if (cab.id_sol != id_usuario) {
		return { ok: false, codigo: 403, mensagem: 'Somente O Usuário Solicitante Pode Encerrar' };
	}

	let motivo = await motivoNaoEncerra(id_empresa, id);
	if (motivo) {
		return { ok: false, ...motivo };
	}

	const encerrada = await cabCorrecaoData.encerrarCabCorrecao(id_empresa, id, id_usuario);
	if (encerrada) {
		return { ok: true, codigo: 200, mensagem: 'Correção Encerrada Com Sucesso!' };
	}

	/* o UPDATE condicional não pegou nada: algo mudou entre a checagem e o encerramento */
	motivo = await motivoNaoEncerra(id_empresa, id);
	return { ok: false, ...(motivo ?? { codigo: 400, mensagem: 'Não Foi Possível Encerrar A Correção!' }) };
};
