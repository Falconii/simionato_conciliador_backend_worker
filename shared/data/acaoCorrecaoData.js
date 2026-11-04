/* DATA acao_correcao */
const db = require('../../shared/infra/database');
const shared = require("../../shared/util/shared.js");

/* SELECT compartilhado pelas consultas.
   Campos dos LEFT JOIN (exec, docs) e colunas que aceitam nulo vão com COALESCE para nunca voltar null */
const camposSelect = `
			   acao_correcao.id as id
			,  acao_correcao.id_empresa as id_empresa
			,  acao_correcao.id_cab_correcoes as id_cab_correcoes
			,  acao_correcao.id_auditor as id_auditor
			,  COALESCE(acao_correcao.id_exec, 0) as id_exec
			,  to_char(acao_correcao.inicio, 'DD/MM/YYYY HH24:MI:SS') as inicio
			,  COALESCE(to_char(acao_correcao.final, 'DD/MM/YYYY HH24:MI:SS'), '') as final
			,  acao_correcao.descricao as descricao
			,  acao_correcao.flag_acao as flag_acao
			,  acao_correcao.id_docs_gdrives as id_docs_gdrives
			,  acao_correcao.status as status
			,  acao_correcao.user_insert as user_insert
			,  acao_correcao.user_update as user_update
			,  cab.id as cab_id
			,  cab.origem as cab_origem
			,  cab.id_origem as cab_id_origem
			,  audi.razao as audi_nome
			,  audi.email as audi_email
			,  COALESCE(exec.razao, '') as exec_nome
			,  COALESCE(exec.email, '') as exec_email
			,  COALESCE(docs.file_name, '') as docs_file_name
			,  COALESCE(docs.status_upload, '') as docs_status_upload `;

/* FROM + JOIN compartilhado pelas consultas */
const fromAcao = ` from acoes_correcoes acao_correcao
			inner join cab_correcoes cab on acao_correcao.id_empresa = cab.id_empresa and acao_correcao.id_cab_correcoes = cab.id
			inner join usuarios audi on audi.id_empresa = acao_correcao.id_empresa and audi.id = acao_correcao.id_auditor
			left join usuarios exec on acao_correcao.id_empresa = exec.id_empresa and acao_correcao.id_exec = exec.id
			left join docs_gdrives docs on acao_correcao.id_empresa = docs.id_empresa and acao_correcao.id_docs_gdrives = docs.id `;

/* ORDENAÇÃO permitida (whitelist): só estas chaves chegam ao SQL */
const ORDENACAO = {
	'': 'acao_correcao.id_empresa,acao_correcao.id',
	'000001': 'acao_correcao.id_empresa,acao_correcao.id_cab_correcoes,acao_correcao.id',
	'000002': 'acao_correcao.id_empresa,acao_correcao.inicio',
	'000003': 'acao_correcao.id_empresa,acao_correcao.inicio,acao_correcao.status'
};

/* Converte para inteiro; se não for número inteiro, vai 0 */
function toInt(valor) {
	const n = Number(valor);
	return Number.isInteger(n) ? n : 0;
}

/* Condição numérica: só entra no where se o valor for diferente de 0 */
function condicaoNumero(coluna, valor, condicoes, valores) {
	const n = toInt(valor);
	if (n !== 0) {
		valores.push(n);
		condicoes.push(`${coluna} = $${valores.length}`);
	}
}

/* Condição de igualdade para textos curtos (flag_acao, status). Valor vai como parâmetro */
function condicaoIgual(coluna, valor, condicoes, valores) {
	const v = String(valor ?? '').trim();
	if (v === '') return;
	valores.push(v);
	condicoes.push(`${coluna} = $${valores.length}`);
}

/* GET CAMPOS */
exports.getCampos = function(AcaoCorrecao){
return [
			AcaoCorrecao.id,
			AcaoCorrecao.id_empresa,
			AcaoCorrecao.id_cab_correcoes,
			AcaoCorrecao.id_auditor,
			AcaoCorrecao.id_exec,
			AcaoCorrecao.inicio,
			AcaoCorrecao.final,
			AcaoCorrecao.descricao,
			AcaoCorrecao.flag_acao,
			AcaoCorrecao.id_docs_gdrives,
			AcaoCorrecao.status,
			AcaoCorrecao.user_insert,
			AcaoCorrecao.user_update,
 ];
};
/* CRUD GET */
exports.getAcaoCorrecao = function(id_empresa,id){
	const strSql = `select ${camposSelect} ${fromAcao}
			 where acao_correcao.id_empresa = $1 and acao_correcao.id = $2 `;
	return db.oneOrNone(strSql, [id_empresa, id]);
};
/* CRUD GET ALL*/
exports.getAcoesCorrecoes = function(params){
if (params) {
	const condicoes = [];
	const valores = [];
	let paginacao = "";

	const orderby = Object.hasOwn(ORDENACAO, params.orderby) ? ORDENACAO[params.orderby] : '';

	condicaoNumero('acao_correcao.id_empresa', params.id_empresa, condicoes, valores);
	condicaoNumero('acao_correcao.id', params.id, condicoes, valores);
	condicaoNumero('acao_correcao.id_cab_correcoes', params.id_cab_correcoes, condicoes, valores);
	condicaoNumero('acao_correcao.id_auditor', params.id_auditor, condicoes, valores);
	condicaoNumero('acao_correcao.id_exec', params.id_exec, condicoes, valores);
	condicaoIgual('acao_correcao.flag_acao', params.flag_acao, condicoes, valores);
	condicaoIgual('acao_correcao.status', params.status, condicoes, valores);

	const where = condicoes.length > 0 ? " where " + condicoes.join(" and ") : "";
	const orderbySql = orderby != "" ? " order by " + orderby : "";

	if (params.contador == 'S') {
		const sqlStr = `SELECT COALESCE(COUNT(*),0) as total
				  ${fromAcao}
				  ${where} `;
		return db.one(sqlStr, valores);
	}

	const pagina = toInt(params.pagina);
	if (pagina != 0) {
		const tamPagina = toInt(params.tamPagina);
		valores.push(tamPagina);
		const limite = `$${valores.length}`;
		valores.push(Math.max(0, (pagina - 1) * tamPagina));
		const deslocamento = `$${valores.length}`;
		paginacao = `limit ${limite} offset ${deslocamento}`;
	}

	const strSql = `select ${camposSelect} ${fromAcao}
			${where} ${orderbySql} ${paginacao} `;
	return db.manyOrNone(strSql, valores);
} else {
	const strSql = `select ${camposSelect} ${fromAcao} `;
	return db.manyOrNone(strSql);
}
}
/* CRUD - INSERT */
exports.insertAcaoCorrecao = function(acao){
	const strSql = `insert into acoes_correcoes (
			     id_empresa
			 ,   id_cab_correcoes
			 ,   id_auditor
			 ,   id_exec
			 ,   inicio
			 ,   final
			 ,   descricao
			 ,   flag_acao
			 ,   id_docs_gdrives
			 ,   status
			 ,   user_insert
			 ,   user_update
			 )
			 values(
			     $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
			 )
	 returning * `;
	/* id_exec e final aceitam nulo: 0 e vazio viram null */
	const valores = [
		acao.id_empresa,
		acao.id_cab_correcoes,
		acao.id_auditor,
		acao.id_exec || null,
		acao.inicio,
		acao.final || null,
		acao.descricao,
		acao.flag_acao,
		acao.id_docs_gdrives ?? 0,
		acao.status,
		acao.user_insert,
		acao.user_update
	];
	return db.oneOrNone(strSql, valores);
};
/* CRUD - UPDATE */
exports.updateAcaoCorrecao = function(acao){
	const strSql = `update acoes_correcoes set
			     id_cab_correcoes = $1
	 		 ,   id_auditor = $2
	 		 ,   id_exec = $3
	 		 ,   inicio = $4
	 		 ,   final = $5
	 		 ,   descricao = $6
	 		 ,   flag_acao = $7
	 		 ,   id_docs_gdrives = $8
	 		 ,   status = $9
	 		 ,   user_update = $10
	 		 where id_empresa = $11 and  id = $12  returning * `;
	const valores = [
		acao.id_cab_correcoes,
		acao.id_auditor,
		acao.id_exec || null,
		acao.inicio,
		acao.final || null,
		acao.descricao,
		acao.flag_acao,
		acao.id_docs_gdrives ?? 0,
		acao.status,
		acao.user_update,
		acao.id_empresa,
		acao.id
	];
	return db.oneOrNone(strSql, valores);
};
/* CRUD - DELETE */
exports.deleteAcaoCorrecao = function(id_empresa,id){
	const strSql = `delete from acoes_correcoes
			 where id_empresa = $1 and  id = $2  `;
	return db.oneOrNone(strSql, [id_empresa, id]);
};
