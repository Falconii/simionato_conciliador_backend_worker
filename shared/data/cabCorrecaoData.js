/* DATA cab_correcao */
const db = require('../../shared/infra/database');
const shared = require("../../shared/util/shared.js");

/* SELECT compartilhado pelas consultas */
const camposSelect = `
			   cab_correcao.id as id
			,  cab_correcao.id_empresa as id_empresa
			,  cab_correcao.descricao as descricao
			, to_char(cab_correcao.cadastr, 'DD/MM/YYYY') as cadastr
			,  cab_correcao.origem as origem
			,  cab_correcao.id_origem as id_origem
			,  cab_correcao.id_exec as id_exec
			,  cab_correcao.id_sol as id_sol
			,  cab_correcao.tarefa as tarefa
			,  cab_correcao.status as status
			,  cab_correcao.user_insert as user_insert
			,  cab_correcao.user_update as user_update
			,  coalesce(exec.razao,'')  as exec_nome
			,  coalesce(exec.email,'') as exec_email
			,  coalesce(sol.razao,'')  as sol_nome
			,  coalesce(sol.email,'')  as sol_email
			,  coalesce(sim.codemp,0) as sim_cod_emp
			,  coalesce(sim.numpro,0) as sim_num_pro `;

/* FROM + JOIN compartilhado pelas consultas */
const fromCab = ` from cab_correcoes cab_correcao
			inner join  usuarios sol on cab_correcao.id_empresa = sol.id_empresa and cab_correcao.id_sol = sol.id
			left  join  usuarios exec on cab_correcao.id_empresa = exec.id_empresa and cab_correcao.id_exec = exec.id
			left  join  sim_historicos sim on cab_correcao.id_empresa = sim.id_empresa and cab_correcao.id_origem = sim.id and cab_correcao.origem = 'SIM' 
		`;
/* ORDENAÇÃO permitida (whitelist): só estas chaves chegam ao SQL */
const ORDENACAO = {
	'': 'cab_correcao.id_empresa,cab_correcao.id',
	'000001': 'cab_correcao.id_empresa,cab_correcao.id',
	'000002': 'cab_correcao.id_empresa,cab_correcao.descricao',
	'000003': 'cab_correcao.id_empresa,cab_correcao.cadastr',
	'000004': 'cab_correcao.id_empresa,cab_correcao.status'
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
exports.getCampos = function(CabCorrecao){
return [
			CabCorrecao.id,
			CabCorrecao.id_empresa,
			CabCorrecao.descricao,
			CabCorrecao.cadastr,
			CabCorrecao.origem,
			CabCorrecao.id_origem,
			CabCorrecao.id_exec,
			CabCorrecao.id_sol,
			CabCorrecao.tarefa,
			CabCorrecao.status,
			CabCorrecao.user_insert,
			CabCorrecao.user_update,
 ];
};
/* CRUD GET */
exports.getCabCorrecao = function(id_empresa,id){
	const strSql = `select ${camposSelect} ${fromCab}
			 where cab_correcao.id_empresa = $1 and cab_correcao.id = $2 `;
	return db.oneOrNone(strSql, [id_empresa, id]);
};
/* CRUD GET ALL*/
exports.getCabCorrecoes = function(params){
if (params) {
	const condicoes = [];
	const valores = [];
	let paginacao = "";

	const orderby = Object.hasOwn(ORDENACAO, params.orderby) ? ORDENACAO[params.orderby] : '';

	condicaoNumero('cab_correcao.id_empresa', params.id_empresa, condicoes, valores);
	condicaoNumero('cab_correcao.id', params.id, condicoes, valores);
	condicaoNumero('cab_correcao.id_origem', params.id_origem, condicoes, valores);
	condicaoTexto('cab_correcao.origem', params.origem, params.sharp, condicoes, valores);
	condicaoTexto('cab_correcao.descricao', params.descricao, params.sharp, condicoes, valores);
	condicaoNumero('cab_correcao.id_sol', params.id_sol, condicoes, valores);
	condicaoNumero('cab_correcao.id_exec', params.id_exec, condicoes, valores);
	condicaoTexto('cab_correcao.tarefa', params.tarefa, params.sharp, condicoes, valores);

	const cadastr = String(params.cadastr ?? '').trim();
	if (cadastr !== '') {
		valores.push(shared.formatDateYYYYMMDD(cadastr));
		condicoes.push(`cab_correcao.cadastr = $${valores.length}`);
	}

	const status = String(params.status ?? '').trim();
	if (status !== '') {
		valores.push(status);
		condicoes.push(`cab_correcao.status = $${valores.length}`);
	}

	const where = condicoes.length > 0 ? " where " + condicoes.join(" and ") : "";
	const orderbySql = orderby != "" ? " order by " + orderby : "";

	if (params.contador == 'S') {
		const sqlStr = `SELECT COALESCE(COUNT(*),0)::int4 as total
				  ${fromCab}
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

	const strSql = `select ${camposSelect} ${fromCab}
			${where} ${orderbySql} ${paginacao} `;
	console.log("strsql",strSql);
	return db.manyOrNone(strSql, valores);
} else {
	const strSql = `select ${camposSelect} ${fromCab} `;
	return db.manyOrNone(strSql);
}
}
/* CRUD - INSERT */
exports.insertCabCorrecao = function(cab){
    const strSql = `
        insert into cab_correcoes (
            id_empresa,
            descricao,
            cadastr,
            origem,
            id_origem,
            id_exec,
            id_sol,
            tarefa,
            status,
            user_insert,
            user_update
        )
        values (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
        returning *;
    `;

    const valores = [
        cab.id_empresa,
        cab.descricao,
        shared.formatDateYYYYMMDD(cab.cadastr),
        cab.origem,
        cab.id_origem,
        cab.id_exec,
        cab.id_sol,
        cab.tarefa,
        cab.status,
        cab.user_insert,
        cab.user_update
    ];

    return db.oneOrNone(strSql, valores);
};


/* CRUD - UPDATE */
exports.updateCabCorrecao = function(cab){
	const strSql = `update cab_correcoes set
			     descricao = $1
	 		 ,   cadastr = $2
	 		 ,   origem = $3
	 		 ,   id_origem = $4
	 		 ,   id_exec = $5
	 		 ,   id_sol = $6
	 		 ,   tarefa = $7
	 		 ,   status = $8
	 		 ,   user_update = $9
	 		 where id_empresa = $10 and  id = $11  returning * `;
	const valores = [
		cab.descricao,
		shared.formatDateYYYYMMDD(cab.cadastr),
		cab.origem,
		cab.id_origem,
		cab.id_exec,
		cab.id_sol,
		cab.tarefa,
		cab.status,
		cab.user_update,
		cab.id_empresa,
		cab.id
	];
	return db.oneOrNone(strSql, valores);
};
/* CRUD - DELETE */
exports.deleteCabCorrecao = function(id_empresa,id){
	const strSql = `delete from cab_correcoes
			 where id_empresa = $1 and  id = $2  `;
	return db.oneOrNone(strSql, [id_empresa, id]);
};
