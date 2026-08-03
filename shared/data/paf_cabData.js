/* DATA pafs_cab */
const db = require("../../shared/infra/database");

/* GET CAMPOS */
exports.getCampos = function(Paf_Cab) {
    return [
        Paf_Cab.id_empresa,
        Paf_Cab.id,
        Paf_Cab.nome_arquivo,
        Paf_Cab.pasta_arquivo,
        Paf_Cab.id_folder,
        Paf_Cab.id_file,
        Paf_Cab.file_name,
        Paf_Cab.qtd_paginas_total,
        Paf_Cab.tamanho,
        Paf_Cab.processado,
        Paf_Cab.qtd_contratos,
        Paf_Cab.status,
        Paf_Cab.total_valor,
        Paf_Cab.status_assinatura,
        Paf_Cab.status_arquivos,
        Paf_Cab.user_insert,
        Paf_Cab.user_update,
    ];
};
/* CRUD GET */
exports.getPaf_Cab = function(id) {
    strSql = ` select   
			   pafs_cab.id_empresa as  id_empresa  
			,  pafs_cab.id as  id  
			,  pafs_cab.nome_arquivo as  nome_arquivo  
			,  pafs_cab.pasta_arquivo as  pasta_arquivo  
			,  pafs_cab.id_folder as  id_folder  
			,  pafs_cab.id_file as  id_file  
			,  pafs_cab.file_name as  file_name  
			,  pafs_cab.qtd_paginas_total as  qtd_paginas_total  
			,  pafs_cab.tamanho as  tamanho  
			, to_char(pafs_cab.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			,  pafs_cab.qtd_contratos as  qtd_contratos  
			,  pafs_cab.status as  status  
			,  pafs_cab.total_valor as  total_valor  
			,  pafs_cab.status_assinatura as  status_assinatura  
			,  pafs_cab.status_arquivos as  status_arquivos  
			,  pafs_cab.user_insert as  user_insert  
			,  pafs_cab.user_update as  user_update  
			,  coalesce(ass.obs,'') as  ass_obs  
			,  coalesce(ass.resposta,'') as  ass_resposta    
 			FROM pafs_cab pafs_cab 	  
				 left join assinaturas ass on pafs_cab.id_empresa  = ass.id_empresa   and pafs_cab.id = ass.id_cab    
			 where pafs_cab.id = ${id}  `;
    return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getPafs_Cab = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";

        if (params.orderby == "") orderby = "pafs_cab.id_empresa,pafs_cab.id";
        if (params.orderby == "000001") orderby = "pafs_cab.id_empresa,pafs_cab.id";
        if (params.orderby == "000002")
            orderby = "pafs_cab.id_empresa,pafs_cab.nome_arquivo";

        if (orderby != "") orderby = " order by " + orderby;
        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `pafs_cab.id_empresa = ${params.id_empresa} `;
        }
        if (params.id !== 0) {
            if (where != "") where += " and ";
            where += `pafs_cab.id = ${params.id} `;
        }
        if (params.nome_arquivo.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `upper(trim(pafs_cab.nome_arquivo))  = '${params.nome_arquivoto.UpperCase().trim()}' `;
            } else {
                where += `upper(trim(pafs_cab.nome_arquivo))  like '%${params.nome_arquivo.toUpperCase().trim()}%' `;
            }
        }
        if (params.file_name.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pafs_cab.file_name = '${params.file_name}' `;
            } else {
                where += `pafs_cab.file_name like '%${params.file_name.trim()}%' `;
            }
        }

        if (params.processado.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pafs_cab.processado = '${params.processado}' `;
            } else {
                where += `pafs_cab.processado like '%${params.processado.trim()}%' `;
            }
        }
        if (params.qtd_contratos !== 0) {
            if (where != "") where += " and ";
            where += `pafs_cab.qtd_contratos = ${params.qtd_contratos} `;
        }
        if (params.status.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pafs_cab.status = '${params.status}' `;
            } else {
                where += `pafs_cab.status like '%${params.status.trim()}%' `;
            }
        }
        if (params.total_valor !== 0) {
            if (where != "") where += " and ";
            where += `pafs_cab.total_valor = ${params.total_valor} `;
        }
        if (params.status_assinatura.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pafs_cab.status_assinatura = '${params.status_assinatura}' `;
            } else {
                where += `pafs_cab.status_assinatura like '%${params.status_assinatura.trim()}%' `;
            }
        }
        if (params.status_arquivos.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pafs_cab.status_arquivos = '${params.status_arquivos}' `;
            } else {
                where += `pafs_cab.status_arquivos like '%${params.status_arquivos.trim()}%' `;
            }
        }
        if (params.ass_obs.trim() !== "SEM FILTRO") {
            if (where != "") where += " and ";
            where += `UPPER(TRIM(ass.obs)) = '${params.ass_obs.toUpperCase().trim()}' `;
        }
        if (params.ass_resposta.trim() !== "") {
            if (where != "") where += " and ";
            if (ass_resposta == "X") {
                where += `ass.resposta = '' `;
            } else {
                where += `ass.resposta = '${params.ass_resposta}' `;
            }
        }
        if (where != "") where = " where " + where;
        if (params.pagina != 0) {
            paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
        }
        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM pafs_cab pafs_cab   
				 left join assinaturas ass on pafs_cab.id_empresa  = ass.id_empresa   and pafs_cab.id = ass.id_cab    
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   pafs_cab.id_empresa as  id_empresa  
			,  pafs_cab.id as  id  
			,  pafs_cab.nome_arquivo as  nome_arquivo  
			,  pafs_cab.pasta_arquivo as  pasta_arquivo  
			,  pafs_cab.id_folder as  id_folder  
			,  pafs_cab.id_file as  id_file  
			,  pafs_cab.file_name as  file_name  
			,  pafs_cab.qtd_paginas_total as  qtd_paginas_total  
			,  pafs_cab.tamanho as  tamanho  
			,  to_char(pafs_cab.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			,  pafs_cab.qtd_contratos as  qtd_contratos  
			,  pafs_cab.status as  status  
			,  pafs_cab.total_valor as  total_valor  
			,  pafs_cab.status_assinatura as  status_assinatura  
			,  pafs_cab.status_arquivos as  status_arquivos  
			,  pafs_cab.user_insert as  user_insert  
			,  pafs_cab.user_update as  user_update  
			,  coalesce(ass.obs,'') as  ass_obs  
			,  coalesce(ass.resposta,'') as  ass_resposta     
			FROM pafs_cab pafs_cab   
				 left join assinaturas ass on pafs_cab.id_empresa  = ass.id_empresa   and pafs_cab.id = ass.id_cab    
			${where} 			${orderby} ${paginacao} `;
            console.log("getPafs_Cab", strSql);
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `select   
			   pafs_cab.id_empresa as  id_empresa  
			,  pafs_cab.id as  id  
			,  pafs_cab.nome_arquivo as  nome_arquivo  
			,  pafs_cab.pasta_arquivo as  pasta_arquivo  
			,  pafs_cab.id_folder as  id_folder  
			,  pafs_cab.id_file as  id_file  
			,  pafs_cab.file_name as  file_name  
			,  pafs_cab.qtd_paginas_total as  qtd_paginas_total  
			,  pafs_cab.tamanho as  tamanho  
			, to_char(pafs_cab.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			,  pafs_cab.qtd_contratos as  qtd_contratos  
			,  pafs_cab.status as  status  
			,  pafs_cab.total_valor as  total_valor  
			,  pafs_cab.status_assinatura as  status_assinatura  
			,  pafs_cab.status_arquivos as  status_arquivos  
			,  pafs_cab.user_insert as  user_insert  
			,  pafs_cab.user_update as  user_update  
			,  coalesce(ass.obs,'') as  ass_obs  
			,  coalesce(ass.resposta,'') as  ass_resposta    
			FROM pafs_cab pafs_cab			   
				 left join assinaturas ass on pafs_cab.id_empresa  = ass.id_empresa   and pafs_cab.id_cab = ass.id_cab   `;
        return db.manyOrNone(strSql);
    }
};
/* CRUD - INSERT */
exports.insertPaf_Cab = function(paf_cab) {
    strSql = `insert into pafs_cab (
		     id_empresa 
		 ,   nome_arquivo 
		 ,   pasta_arquivo 
		 ,   id_folder 
		 ,   id_file 
		 ,   file_name 
		 ,   qtd_paginas_total 
		 ,   tamanho 
		 ,   processado 
		 ,   qtd_contratos 
		 ,   status 
		 ,   total_valor 
		 ,   status_assinatura 
		 ,   status_arquivos 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${paf_cab.id_empresa} 
		 ,   '${paf_cab.nome_arquivo}' 
		 ,   '${paf_cab.pasta_arquivo}' 
		 ,   '${paf_cab.id_folder}' 
		 ,   '${paf_cab.id_file}' 
		 ,   '${paf_cab.file_name}' 
		 ,   ${paf_cab.qtd_paginas_total} 
		 ,   ${paf_cab.tamanho} 
		 ,   '${paf_cab.processado.replace("GMT-0300", "").replace("T", " ").replace("Z", "")}' 
		 ,   ${paf_cab.qtd_contratos} 
		 ,   '${paf_cab.status}' 
		 ,   ${paf_cab.total_valor} 
		 ,   '${paf_cab.status_assinatura}' 
		 ,   '${paf_cab.status_arquivos}' 
		 ,   ${paf_cab.user_insert} 
		 ,   ${paf_cab.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updatePaf_Cab = function(paf_cab) {
    strSql = `update   pafs_cab set  
		     id_empresa = ${paf_cab.id_empresa} 
 		 ,   nome_arquivo = '${paf_cab.nome_arquivo}' 
 		 ,   pasta_arquivo = '${paf_cab.pasta_arquivo}' 
 		 ,   id_folder = '${paf_cab.id_folder}' 
 		 ,   id_file = '${paf_cab.id_file}' 
 		 ,   file_name = '${paf_cab.file_name}' 
 		 ,   qtd_paginas_total = ${paf_cab.qtd_paginas_total} 
 		 ,   tamanho = ${paf_cab.tamanho} 
 		 ,   processado = '${paf_cab.processado.replace("GMT-0300", "").replace("T", " ").replace("Z", "")}' 
 		 ,   qtd_contratos = ${paf_cab.qtd_contratos} 
 		 ,   status = '${paf_cab.status}' 
 		 ,   total_valor = ${paf_cab.total_valor} 
 		 ,   status_assinatura = '${paf_cab.status_assinatura}' 
 		 ,   status_arquivos = '${paf_cab.status_arquivos}' 
 		 ,   user_insert = ${paf_cab.user_insert} 
 		 ,   user_update = ${paf_cab.user_update} 
 		 where id = ${paf_cab.id}  returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deletePaf_Cab = function(id) {
    strSql = `delete from pafs_cab 
		 where id = ${id}  `;
    return db.oneOrNone(strSql);
};