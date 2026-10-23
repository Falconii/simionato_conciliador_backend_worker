/* DATA det_correcao */
const db = require('../../shared/infra/database');
const shared = require("../../shared/util/shared.js");

/* SELECT compartilhado pelas consultas */
const camposSelect = `
			   det_correcao.id as id
			,  det_correcao.id_empresa as id_empresa
			,  det_correcao.id_cab as id_cab
			,  det_correcao.mensagem as mensagem
			, to_char(det_correcao.data, 'DD/MM/YYYY HH24:MI:SS') as data
			,  det_correcao.id_auditor as id_auditor
			,  det_correcao.status as status
			,  det_correcao.user_insert as user_insert
			,  det_correcao.user_update as user_update
			,  audi.razao as exec_nome `;

/* FROM + JOIN compartilhado pelas consultas */
const fromDet = ` from det_correcoes det_correcao
			inner join usuarios audi on det_correcao.id_empresa = audi.id_empresa and det_correcao.id_auditor = audi.id `;

/* ORDENAÇÃO permitida (whitelist): só estas chaves chegam ao SQL */
const ORDENACAO = {
	'': 'det_correcao.id_empresa,det_correcao.id',
	'000001': 'det_correcao.id_empresa,det_correcao.id_cab',
	'000002': 'det_correcao.id_empresa,det_correcao.data'
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

/* Condição de igualdade para textos curtos (status). Valor vai como parâmetro */
function condicaoIgual(coluna, valor, condicoes, valores) {
	const v = String(valor ?? '').trim();
	if (v === '') return;
	valores.push(v);
	condicoes.push(`${coluna} = $${valores.length}`);
}

/* GET CAMPOS */
exports.getCampos = function(DetCorrecao){
return [
			DetCorrecao.id,
			DetCorrecao.id_empresa,
			DetCorrecao.id_cab,
			DetCorrecao.mensagem,
			DetCorrecao.data,
			DetCorrecao.id_auditor,
			DetCorrecao.status,
			DetCorrecao.user_insert,
			DetCorrecao.user_update,
 ];
};
/* CRUD GET */
exports.getDetCorrecao = function(id_empresa,id){
	const strSql = `select ${camposSelect} ${fromDet}
			 where det_correcao.id_empresa = $1 and det_correcao.id = $2 `;
	return db.oneOrNone(strSql, [id_empresa, id]);
};
/* CRUD GET ALL*/
exports.getDetCorrecoes = function(params){
if (params) {
	const condicoes = [];
	const valores = [];
	let paginacao = "";

	const orderby = Object.hasOwn(ORDENACAO, params.orderby) ? ORDENACAO[params.orderby] : '';

	condicaoNumero('det_correcao.id_empresa', params.id_empresa, condicoes, valores);
	condicaoNumero('det_correcao.id', params.id, condicoes, valores);
	condicaoNumero('det_correcao.id_cab', params.id_cab, condicoes, valores);
	condicaoIgual('det_correcao.status', params.status, condicoes, valores);

	/* data é timestamp: o filtro compara só o dia */
	const data = String(params.data ?? '').trim();
	if (data !== '') {
		valores.push(shared.formatDateYYYYMMDD(data));
		condicoes.push(`det_correcao.data::date = $${valores.length}`);
	}

	const where = condicoes.length > 0 ? " where " + condicoes.join(" and ") : "";
	const orderbySql = orderby != "" ? " order by " + orderby : "";

	if (params.contador == 'S') {
		const sqlStr = `SELECT COALESCE(COUNT(*),0) as total
				  ${fromDet}
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

	const strSql = `select ${camposSelect} ${fromDet}
			${where} ${orderbySql} ${paginacao} `;
	return db.manyOrNone(strSql, valores);
} else {
	const strSql = `select ${camposSelect} ${fromDet} `;
	return db.manyOrNone(strSql);
}
}
/* CRUD - INSERT */
exports.insertDetCorrecao = function(det){
	const strSql = `insert into det_correcoes (
			     id_empresa
			 ,   id_cab
			 ,   mensagem
			 ,   data
			 ,   id_auditor
			 ,   status
			 ,   user_insert
			 ,   user_update
			 )
			 values(
			     $1, $2, $3, $4, $5, $6, $7, $8
			 )
	 returning * `;
	const valores = [
		det.id_empresa,
		det.id_cab,
		det.mensagem,
		det.data,
		det.id_auditor,
		det.status,
		det.user_insert,
		det.user_update
	];
	return db.oneOrNone(strSql, valores);
};
/* CRUD - UPDATE */
exports.updateDetCorrecao = function(det){
	const strSql = `update det_correcoes set
			     id_cab = $1
	 		 ,   mensagem = $2
	 		 ,   data = $3
	 		 ,   id_auditor = $4
	 		 ,   status = $5
	 		 ,   user_update = $6
	 		 where id_empresa = $7 and  id = $8  returning * `;
	const valores = [
		det.id_cab,
		det.mensagem,
		det.data,
		det.id_auditor,
		det.status,
		det.user_update,
		det.id_empresa,
		det.id
	];
	return db.oneOrNone(strSql, valores);
};
/* CRUD - DELETE */
exports.deleteDetCorrecao = function(id_empresa,id){
	const strSql = `delete from det_correcoes
			 where id_empresa = $1 and  id = $2  `;
	return db.oneOrNone(strSql, [id_empresa, id]);
};
