/* DATA assinaturas */
const db = require("../../shared/infra/database");

const shared = require("../../shared/util/shared.js");

/* GET CAMPOS */
exports.getCampos = function(Assinatura) {
    return [
        Assinatura.id_empresa,
        Assinatura.id_cab,
        Assinatura.id_sim,
        Assinatura.id_email,
        Assinatura.id_auditor,
        Assinatura.id_google,
        Assinatura.resposta,
        Assinatura.obs,
        Assinatura.processado,
		Assinatura.upload_cliente,
        Assinatura.user_insert,
        Assinatura.user_update,
    ];
};
/* CRUD GET */
exports.getAssinatura = function(id_empresa, id_cab) {
    strSql = ` select   
			   assi.id_empresa as  id_empresa  
			,  assi.id_cab as  id_cab  
			,  assi.id_sim as  id_sim  
			,  assi.id_email as  id_email  
			,  assi.id_auditor as  id_auditor  
			,  assi.id_google as  id_google  
			,  assi.resposta as  resposta  
			,  assi.obs as  obs  
			,  assi.old_obs  as old_obs
			, to_char(assi.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			, assi.upload_cliente as upload_cliente
			,  assi.user_insert as  user_insert  
			,  assi.user_update as  user_update    
 			FROM assinaturas assi 	     
			 where assi.id_empresa = ${id_empresa} and  assi.id_cab = ${id_cab}  `;
    return db.oneOrNone(strSql);
};

exports.getAssinaturaSim = function(id_empresa, id_sim) {
    strSql = ` select   
			   assi.id_empresa as  id_empresa  
			,  assi.id_cab as  id_cab  
			,  assi.id_sim as  id_sim  
			,  assi.id_email as  id_email  
			,  assi.id_auditor as  id_auditor  
			,  assi.id_google as  id_google  
			,  assi.resposta as  resposta  
			,  assi.obs as  obs  
			,  assi.old_obs  as old_obs
			,  to_char(assi.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			,  assi.upload_cliente as upload_cliente
			,  assi.user_insert as  user_insert  
			,  assi.user_update as  user_update    
 			FROM assinaturas assi 	     
			 where assi.id_empresa = ${id_empresa} and  assi.id_sim = ${id_sim}  `;
    console.log("getAssinaturaSim", strSql);
    return db.oneOrNone(strSql);
};

/* CRUD GET ALL*/
exports.getAssinaturas = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";

        if (params.orderby == "") orderby = "assi.id_empresa,assi.id_cab";
        if (params.orderby == "000001") orderby = "assi.id_empresa,assi.id_paf";
        if (params.orderby == "000002")
            orderby = "assi.id_empresa,assi.id_auditor,assi.id_google";
        if (params.orderby == "000003")
            orderby = "assi.id_empresa,assi.id_auditor,assi.id_cab";

        if (orderby != "") orderby = " order by " + orderby;
        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `assi.id_empresa = ${params.id_empresa} `;
        }
        if (params.id_cab !== 0) {
            if (where != "") where += " and ";
            where += `assi.id_cab = ${params.id_cab} `;
        }
        if (params.id_sim !== 0) {
            if (where != "") where += " and ";
            where += `assi.id_sim = ${params.id_sim} `;
        }
        if (params.id_email !== 0) {
            if (where != "") where += " and ";
            where += `assi.id_email = ${params.id_email} `;
        }
        if (params.id_auditor !== 0) {
            if (where != "") where += " and ";
            where += `assi.id_auditor = ${params.id_auditor} `;
        }
        if (params.id_google !== 0) {
            if (where != "") where += " and ";
            where += `assi.id_google = ${params.id_google} `;
        }
        if (where != "") where = " where " + where;
        if (params.pagina != 0) {
            paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
        }
        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM assinaturas assi      
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   assi.id_empresa as  id_empresa  
			,  assi.id_cab as  id_cab  
			,  assi.id_sim as  id_sim  
			,  assi.id_email as  id_email  
			,  assi.id_auditor as  id_auditor  
			,  assi.id_google as  id_google  
			,  assi.resposta as  resposta  
			,  assi.obs as  obs  
			,  assi.old_obs  as old_obs
			,  to_char(assi.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			,  assi.upload_cliente as upload_cliente
			,  assi.user_insert as  user_insert  
			,  assi.user_update as  user_update     
			FROM assinaturas assi      
			${where} 			${orderby} ${paginacao} `;
            console.log("consulta", strSql);
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `select   
			   assi.id_empresa as  id_empresa  
			,  assi.id_cab as  id_cab  
			,  assi.id_sim as  id_sim  
			,  assi.id_email as  id_email  
			,  assi.id_auditor as  id_auditor  
			,  assi.id_google as  id_google  
			,  assi.resposta as  resposta  
			,  assi.obs as  obs  
			,  assi.old_obs  as old_obs
			,  to_char(assi.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			,  assi.upload_cliente as upload_cliente
			,  assi.user_insert as  user_insert  
			,  assi.user_update as  user_update    
			FROM assinaturas assi			     `;
        return db.manyOrNone(strSql);
    }
};
/* CRUD - INSERT */
exports.insertAssinatura = function(assinatura) {
    strSql = `insert into assinaturas (
		     id_empresa 
		 ,   id_cab 
		 ,   id_sim 
		 ,   id_email 
		 ,   id_auditor 
		 ,   id_google 
		 ,   resposta 
		 ,   obs 
		 ,  assi.old_obs  as old_obs
		 ,   processado 
		 ,   upload_cliente
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${assinatura.id_empresa} 
		 ,   ${assinatura.id_cab} 
		 ,   ${assinatura.id_sim} 
		 ,   ${assinatura.id_email} 
		 ,   ${assinatura.id_auditor} 
		 ,   ${assinatura.id_google} 
		 ,   '${assinatura.resposta}' 
		 ,   '${assinatura.obs}' 
		 ,   '${assinatura.old_obs}' 
		 ,   '${shared.formatDateYYYYMMDD(assinatura.processado)}'
		 ,   '${assinatura.upload_cliente}'
		 ,   ${assinatura.user_insert} 
		 ,   ${assinatura.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateAssinatura = function(assinatura) {
    strSql = `update   assinaturas set  
		     id_sim = ${assinatura.id_sim} 
 		 ,   id_email = ${assinatura.id_email} 
 		 ,   id_auditor = ${assinatura.id_auditor} 
 		 ,   id_google = ${assinatura.id_google} 
 		 ,   resposta = '${assinatura.resposta}' 
 		 ,   obs = '${assinatura.obs}' 
		 ,   old_obs = '${assinatura.old_obs}' 
 		 ,   processado = '${shared.formatDateYYYYMMDD(assinatura.processado)}'
		 ,   upload_cliente = '${assinatura.upload_cliente}' 
 		 ,   user_insert = ${assinatura.user_insert} 
 		 ,   user_update = ${assinatura.user_update} 
 		 where id_empresa = ${assinatura.id_empresa} and  id_cab = ${assinatura.id_cab}  returning * `;
    return db.oneOrNone(strSql);
};

exports.updateAssinaturaSim = function(assinatura) {
	console.warn(assinatura);
    strSql = `update   assinaturas set  
		     id_sim = ${assinatura.id_sim} 
 		 ,   id_email = ${assinatura.id_email} 
 		 ,   id_auditor = ${assinatura.id_auditor} 
 		 ,   id_google = ${assinatura.id_google} 
 		 ,   resposta = '${assinatura.resposta}' 
 		 ,   obs = '${assinatura.obs}' 
		 ,   old_obs = '${assinatura.old_obs}' 
 		 ,   processado = '${shared.formatDateYYYYMMDD(assinatura.processado)}'
		 ,   upload_cliente = '${assinatura.upload_cliente}' 
 		 ,   user_insert = ${assinatura.user_insert} 
 		 ,   user_update = ${assinatura.user_update} 
 		 where id_empresa = ${assinatura.id_empresa} and  id_sim = ${assinatura.id_sim}  returning * `;
		 console.warn("updateAssinaturaSim",strSql);
    return db.oneOrNone(strSql);
};

/* CRUD - DELETE */
exports.deleteAssinatura = function(id_empresa, id_cab) {
    strSql = `delete from assinaturas 
		 where id_empresa = ${id_empresa} and  id_cab = ${id_cab}  `;
    return db.oneOrNone(strSql);
};

exports.deleteAssinaturaSim = function(id_empresa, id_sim) {
    strSql = `delete from assinaturas 
		 where id_empresa = ${id_empresa} and  id_sim = ${id_sim}  `;
    return db.oneOrNone(strSql);
};