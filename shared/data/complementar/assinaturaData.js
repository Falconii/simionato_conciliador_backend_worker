/* DATA assinaturas */
const db = require("../../shared/../infra/database");

const shared = require("../../shared/../util/shared.js");

exports.getResumoObs = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";
        innerHistorico = "";

        orderby = "trim(assi.obs)";

        if (orderby != "") orderby = " order by " + orderby;

        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `assi.id_empresa = ${params.id_empresa} `;
        }
        if (params.paf !== "") {
            if (where != "") where += " and ";
            where += `assi.id_cab <> 0`;
        }
        if (params.sim !== "") {
            if (where != "") where += " and ";
            where += `assi.id_sim <> 0 `;
            innerHistorico = " inner join  sim_historicos h on h.id_empresa = assi.id_empresa and h.id = assi.id_sim ";
        }

        if (where != "") where = " where " + where;

        strSql = `select distinct  
			          trim(assi.obs) as  obs      
			FROM assinaturas assi      
			${innerHistorico} ${where} ${orderby}`;
        console.log("getResumoObs:", strSql);
        return db.manyOrNone(strSql);
    }
};