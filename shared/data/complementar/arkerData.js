/* DATA arker */
const db = require('../../shared/../infra/database');
const shared = require("../../shared/../util/shared.js");

/* CRUD GET ALL*/
exports.getResumoStatusArker = function(params){
	if (params) {
		where = "";
		orderby = "";


		orderby = "order by arker.denominacao_status_arker ";

		if(params.id_empresa  !== 0 ){
			if (where != "") where += " and "; 
			where += `arker.id_empresa = ${params.id_empresa} `;
		}

		
        if (where != "") where = " where " + where;

		strSql = `select distinct 
			  arker.status_arker 
			, arker.denominacao_status_arker  
			from arkers arker 
			${where} 	${orderby} `;
	
		return  db.manyOrNone(strSql);
	}
}

exports.getResumoFrmPagto = function(params){
	if (params) {
		where = "";
		orderby = "";

		orderby = "order by arker.frm_pagto desc";

		if(params.id_empresa  !== 0 ){
			if (where != "") where += " and "; 
			where += `arker.id_empresa = ${params.id_empresa} `;
		}

		
        if (where != "") where = " where " + where;

		strSql = `
		    select distinct arker.frm_pagto  
		    from arkers arker 
			${where} 	${ orderby} `;
		return  db.manyOrNone(strSql);
	}
}
