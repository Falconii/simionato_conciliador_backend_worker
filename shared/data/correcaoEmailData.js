/* DATA correcao_email */
const db = require('../../shared/infra/database');
const shared = require("../../shared/util/shared.js");

/* SELECT compartilhado pelas consultas */
const camposSelect = `
			   cred_email.id as id
			,  cred_email.id_empresa as id_empresa
			,  cred_email.id_auditor as id_auditor
			,  cred_email.user_insert as user_insert
			,  cred_email.user_update as user_update
			,  audi.razao as auditor_nome
			,  audi.grupo as auditor_grupo
			,  audi.email as auditor_email `;

/* FROM + JOIN compartilhado pelas consultas */
const fromCor = ` from correcoes_emails cred_email
			inner join usuarios audi on cred_email.id_empresa = audi.id_empresa and cred_email.id_auditor = audi.id `;

/* ORDENAÇÃO permitida (whitelist): só estas chaves chegam ao SQL */
const ORDENACAO = {
	'': 'cred_email.id_empresa,cred_email.id_auditor',
	'000001': 'cred_email.id_empresa,cred_email.id'
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

/* GET CAMPOS */
exports.getCampos = function(CorrecaoEmail){
return [
			CorrecaoEmail.id,
			CorrecaoEmail.id_empresa,
			CorrecaoEmail.id_auditor,
			CorrecaoEmail.user_insert,
			CorrecaoEmail.user_update,
 ];
};
/* CRUD GET */
exports.getCorrecaoEmail = function(id_empresa,id_auditor){
	const strSql = `select ${camposSelect} ${fromCor}
			 where cred_email.id_empresa = $1 and cred_email.id_auditor = $2 `;
	return db.oneOrNone(strSql, [id_empresa, id_auditor]);
};
/* CRUD GET ALL*/
exports.getCorrecoesEmails = function(params){
if (params) {
	const condicoes = [];
	const valores = [];
	let paginacao = "";

	const orderby = Object.hasOwn(ORDENACAO, params.orderby) ? ORDENACAO[params.orderby] : '';

	condicaoNumero('cred_email.id_empresa', params.id_empresa, condicoes, valores);
	condicaoNumero('cred_email.id', params.id, condicoes, valores);
	/* id_auditor chega como texto ou número: toInt converte; auditor_grupo é coluna do join (audi.grupo) */
	condicaoNumero('cred_email.id_auditor', params.id_auditor, condicoes, valores);
	condicaoNumero('audi.grupo', params.auditor_grupo, condicoes, valores);

	const where = condicoes.length > 0 ? " where " + condicoes.join(" and ") : "";
	const orderbySql = orderby != "" ? " order by " + orderby : "";

	if (params.contador == 'S') {
		const sqlStr = `SELECT COALESCE(COUNT(*),0) as total
				  ${fromCor}
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

	const strSql = `select ${camposSelect} ${fromCor}
			${where} ${orderbySql} ${paginacao} `;
	return db.manyOrNone(strSql, valores);
} else {
	const strSql = `select ${camposSelect} ${fromCor} `;
	return db.manyOrNone(strSql);
}
}
/* CRUD - INSERT */
exports.insertCorrecaoEmail = function(cor){
	const strSql = `insert into correcoes_emails (
			     id_empresa
			 ,   id_auditor
			 ,   user_insert
			 ,   user_update
			 )
			 values(
			     $1, $2, $3, $4
			 )
	 returning * `;
	const valores = [
		cor.id_empresa,
		cor.id_auditor,
		cor.user_insert,
		cor.user_update
	];
	return db.oneOrNone(strSql, valores);
};
/* CRUD - UPDATE */
exports.updateCorrecaoEmail = function(cor){
	const strSql = `update correcoes_emails set
			     user_update = $1
	 		 where id_empresa = $2 and  id_auditor = $3  returning * `;
	const valores = [
		cor.user_update,
		cor.id_empresa,
		cor.id_auditor
	];
	return db.oneOrNone(strSql, valores);
};
/* CRUD - DELETE */
exports.deleteCorrecaoEmail = function(id_empresa,id_auditor){
	const strSql = `delete from correcoes_emails
			 where id_empresa = $1 and  id_auditor = $2  `;
	return db.oneOrNone(strSql, [id_empresa, id_auditor]);
};
