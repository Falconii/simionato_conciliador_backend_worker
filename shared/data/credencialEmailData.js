/* DATA credencial_email */
const db = require('../../shared/infra/database');
const shared = require("../../shared/util/shared.js");

/* SELECT compartilhado pelas consultas */
const camposSelect = `
			   credencial_email.id as id
			,  credencial_email.id_empresa as id_empresa
			,  credencial_email.descricao as descricao
			,  credencial_email.email as email
			,  credencial_email.smtp as smtp
			,  credencial_email.pass as pass
			,  credencial_email.user_insert as user_insert
			,  credencial_email.user_update as user_update `;

/* FROM compartilhado pelas consultas */
const fromCred = ` from credenciais_emails credencial_email `;

/* ORDENAÇÃO permitida (whitelist): só estas chaves chegam ao SQL */
const ORDENACAO = {
	'': 'credencial_email.id_empresa,credencial_email.descricao',
	'000001': 'credencial_email.id_empresa,credencial_email.id'
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

/* Condição de texto (sharp = igualdade, senão contém). Valor vai como parâmetro */
function condicaoTexto(coluna, valor, sharp, condicoes, valores) {
	const v = String(valor ?? '').trim().toUpperCase();
	if (v === '') return;
	valores.push(sharp ? v : `%${v}%`);
	condicoes.push(sharp ? `UPPER(${coluna}) = $${valores.length}` : `UPPER(${coluna}) like $${valores.length}`);
}

/* GET CAMPOS */
exports.getCampos = function(CredencialEmail){
return [
			CredencialEmail.id,
			CredencialEmail.id_empresa,
			CredencialEmail.descricao,
			CredencialEmail.email,
			CredencialEmail.smtp,
			CredencialEmail.pass,
			CredencialEmail.user_insert,
			CredencialEmail.user_update,
 ];
};
/* CRUD GET */
exports.getCredencialEmail = function(id_empresa,id){
	const strSql = `select ${camposSelect} ${fromCred}
			 where credencial_email.id_empresa = $1 and credencial_email.id = $2 `;
	return db.oneOrNone(strSql, [id_empresa, id]);
};
/* CRUD GET ALL*/
exports.getCredenciaisEmails = function(params){
if (params) {
	const condicoes = [];
	const valores = [];
	let paginacao = "";

	const orderby = Object.hasOwn(ORDENACAO, params.orderby) ? ORDENACAO[params.orderby] : '';

	condicaoNumero('credencial_email.id_empresa', params.id_empresa, condicoes, valores);
	condicaoNumero('credencial_email.id', params.id, condicoes, valores);
	condicaoTexto('credencial_email.descricao', params.descricao, params.sharp, condicoes, valores);
	condicaoTexto('credencial_email.email', params.email, params.sharp, condicoes, valores);

	const where = condicoes.length > 0 ? " where " + condicoes.join(" and ") : "";
	const orderbySql = orderby != "" ? " order by " + orderby : "";

	if (params.contador == 'S') {
		const sqlStr = `SELECT COALESCE(COUNT(*),0) as total
				  ${fromCred}
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

	const strSql = `select ${camposSelect} ${fromCred}
			${where} ${orderbySql} ${paginacao} `;
	return db.manyOrNone(strSql, valores);
} else {
	const strSql = `select ${camposSelect} ${fromCred} `;
	return db.manyOrNone(strSql);
}
}
/* CRUD - INSERT */
exports.insertCredencialEmail = function(cred){
	const strSql = `insert into credenciais_emails (
			     id_empresa
			 ,   descricao
			 ,   email
			 ,   smtp
			 ,   pass
			 ,   user_insert
			 ,   user_update
			 )
			 values(
			     $1, $2, $3, $4, $5, $6, $7
			 )
	 returning * `;
	const valores = [
		cred.id_empresa,
		cred.descricao,
		cred.email,
		cred.smtp,
		cred.pass,
		cred.user_insert,
		cred.user_update
	];
	return db.oneOrNone(strSql, valores);
};
/* CRUD - UPDATE */
exports.updateCredencialEmail = function(cred){
	const strSql = `update credenciais_emails set
			     descricao = $1
	 		 ,   email = $2
	 		 ,   smtp = $3
	 		 ,   pass = $4
	 		 ,   user_update = $5
	 		 where id_empresa = $6 and  id = $7  returning * `;
	const valores = [
		cred.descricao,
		cred.email,
		cred.smtp,
		cred.pass,
		cred.user_update,
		cred.id_empresa,
		cred.id
	];
	return db.oneOrNone(strSql, valores);
};
/* CRUD - DELETE */
exports.deleteCredencialEmail = function(id_empresa,id){
	const strSql = `delete from credenciais_emails
			 where id_empresa = $1 and  id = $2  `;
	return db.oneOrNone(strSql, [id_empresa, id]);
};
