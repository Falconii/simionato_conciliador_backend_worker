/* DATA psts_anexos */
const db = require("../../shared/infra/database");

/* GET CAMPOS */
exports.getCampos = function(Pst_Anexo) {
    return [
        Pst_Anexo.id_empresa,
        Pst_Anexo.id,
        Pst_Anexo.id_email_pst,
        Pst_Anexo.id_pafs_det,
        Pst_Anexo.acordo,
        Pst_Anexo.nome_arquivo_pst,
        Pst_Anexo.caminho_arquivo_pst,
        Pst_Anexo.assunto_email,
        Pst_Anexo.remetente_email,
        Pst_Anexo.data_email,
        Pst_Anexo.indice_anexo,
        Pst_Anexo.nome_original_anexo,
        Pst_Anexo.nome_anexo_salvo,
        Pst_Anexo.caminho_anexo,
        Pst_Anexo.pasta_acordo,
        Pst_Anexo.tamanho_anexo_bytes,
        Pst_Anexo.data_criacao,
        Pst_Anexo.data_atualizacao,
        Pst_Anexo.status_arquivos,
        Pst_Anexo.status_assinatura,
        Pst_Anexo.user_insert,
        Pst_Anexo.user_update,
    ];
};
/* CRUD GET */
exports.getPst_Anexo = function(id_empresa, id) {
    strSql = ` select   
			   pst_anexo.id_empresa as  id_empresa  
			,  pst_anexo.id as  id  
			,  pst_anexo.id_email_pst as  id_email_pst  
			,  pst_anexo.id_pafs_det as  id_pafs_det  
			,  pst_anexo.acordo as  acordo  
			,  pst_anexo.nome_arquivo_pst as  nome_arquivo_pst  
			,  pst_anexo.caminho_arquivo_pst as  caminho_arquivo_pst  
			,  pst_anexo.assunto_email as  assunto_email  
			,  pst_anexo.remetente_email as  remetente_email  
			,  pst_anexo.data_email as  data_email  
			,  pst_anexo.indice_anexo as  indice_anexo  
			,  pst_anexo.nome_original_anexo as  nome_original_anexo  
			,  pst_anexo.nome_anexo_salvo as  nome_anexo_salvo  
			,  pst_anexo.caminho_anexo as  caminho_anexo  
			,  pst_anexo.pasta_acordo as  pasta_acordo  
			,  pst_anexo.tamanho_anexo_bytes as  tamanho_anexo_bytes  
			, to_char(pst_anexo.data_criacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_criacao  
			, to_char(pst_anexo.data_atualizacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_atualizacao  
			,  pst_anexo.status_arquivos as  status_arquivos  
			,  pst_anexo.status_assinatura as  status_assinatura  
			,  pst_anexo.user_insert as  user_insert  
			,  pst_anexo.user_update as  user_update  
			,  coalesce(paf_det.id_cab,0) as  paf_det_id_cab  
			,  coalesce(to_char(paf_det.data_emissao, 'DD/MM/YYYY'),'') as paf_det_data_emissao  
			,  coalesce(paf_det.valor_bruto,0) as  paf_det_valor_bruto  
			,  coalesce(paf_det.acordo,'') as  paf_det_acordo    
 			FROM psts_anexos pst_anexo 	  
				 left join paf_det paf_det on paf_det.id_empresa = pst_anexo.id_empresa and paf_det.id = pst_anexo.id_pafs_det   
			 where pst_anexo.id_empresa = ${id_empresa} and  pst_anexo.id = ${id}  `;
    return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getPsts_Anexos = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";

        if (params.orderby == "") orderby = "pst_anexo.id_empresa,pst_anexo.id";
        if (params.orderby == "000001")
            orderby = "pst_anexo.id_empresa,pst_anexo.id";
        if (params.orderby == "000002")
            orderby = "pst_anexo.id_empresa,pst_anexo.acordo";
        if (params.orderby == "000003")
            orderby = "pst_anexo.id_empresa,pst_anexo.nome_arquivo_pst";
        if (params.orderby == "000004")
            orderby = "pst_anexo.id_empresa,pst_anexo.assunto_email";

        if (orderby != "") orderby = " order by " + orderby;
        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `pst_anexo.id_empresa = ${params.id_empresa} `;
        }
        if (params.id !== 0) {
            if (where != "") where += " and ";
            where += `pst_anexo.id = ${params.id} `;
        }
        if (params.id_email_pst !== 0) {
            if (where != "") where += " and ";
            where += `pst_anexo.id_email_pst = ${params.id_email_pst} `;
        }
        if (params.id_pafs_det !== 0) {
            if (where != "") where += " and ";
            where += `pst_anexo.id_pafs_det = ${params.id_pafs_det} `;
        }
        if (params.acordo.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pst_anexo.acordo = '${params.acordo}' `;
            } else {
                where += `pst_anexo.acordo like '%${params.acordo.trim()}%' `;
            }
        }
        if (params.nome_arquivo_pst.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pst_anexo.nome_arquivo_pst = '${params.nome_arquivo_pst}' `;
            } else {
                where += `pst_anexo.nome_arquivo_pst like '%${params.nome_arquivo_pst.trim()}%' `;
            }
        }
        if (params.assunto_email.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pst_anexo.assunto_email = '${params.assunto_email}' `;
            } else {
                where += `pst_anexo.assunto_email like '%${params.assunto_email.trim()}%' `;
            }
        }
        if (params.status_arquivos.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pst_anexo.status_arquivos = '${params.status_arquivos}' `;
            } else {
                where += `pst_anexo.status_arquivos like '%${params.status_arquivos.trim()}%' `;
            }
        }
        if (params.status_assinatura.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `pst_anexo.status_assinatura = '${params.status_assinatura}' `;
            } else {
                where += `pst_anexo.status_assinatura like '%${params.status_assinatura.trim()}%' `;
            }
        }
        if (where != "") where = " where " + where;
        if (params.pagina != 0) {
            paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
        }
        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM psts_anexos pst_anexo   
				 left join paf_det paf_det on paf_det.id_empresa = pst_anexo.id_empresa and paf_det.id = pst_anexo.id_pafs_det   
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   pst_anexo.id_empresa as  id_empresa  
			,  pst_anexo.id as  id  
			,  pst_anexo.id_email_pst as  id_email_pst  
			,  pst_anexo.id_pafs_det as  id_pafs_det  
			,  pst_anexo.acordo as  acordo  
			,  pst_anexo.nome_arquivo_pst as  nome_arquivo_pst  
			,  pst_anexo.caminho_arquivo_pst as  caminho_arquivo_pst  
			,  pst_anexo.assunto_email as  assunto_email  
			,  pst_anexo.remetente_email as  remetente_email  
			,  pst_anexo.data_email as  data_email  
			,  pst_anexo.indice_anexo as  indice_anexo  
			,  pst_anexo.nome_original_anexo as  nome_original_anexo  
			,  pst_anexo.nome_anexo_salvo as  nome_anexo_salvo  
			,  pst_anexo.caminho_anexo as  caminho_anexo  
			,  pst_anexo.pasta_acordo as  pasta_acordo  
			,  pst_anexo.tamanho_anexo_bytes as  tamanho_anexo_bytes  
			, to_char(pst_anexo.data_criacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_criacao  
			, to_char(pst_anexo.data_atualizacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_atualizacao  
			,  pst_anexo.status_arquivos as  status_arquivos  
			,  pst_anexo.status_assinatura as  status_assinatura  
			,  pst_anexo.user_insert as  user_insert  
			,  pst_anexo.user_update as  user_update  
			,  coalesce(paf_det.id_cab,0) as  paf_det_id_cab  
			, coalesce(to_char(paf_det.data_emissao, 'DD/MM/YYYY'),'') as paf_det_data_emissao  
			,  coalesce(paf_det.valor_bruto,0) as  paf_det_valor_bruto  
			,  coalesce(paf_det.acordo,'') as  paf_det_acordo     
			FROM psts_anexos pst_anexo   
				 left join paf_det paf_det on paf_det.id_empresa = pst_anexo.id_empresa and paf_det.id = pst_anexo.id_pafs_det   
			${where} 			${orderby} ${paginacao} `;
            console.log("SQL Gerada:", strSql);
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `select   
			   pst_anexo.id_empresa as  id_empresa  
			,  pst_anexo.id as  id  
			,  pst_anexo.id_email_pst as  id_email_pst  
			,  pst_anexo.id_pafs_det as  id_pafs_det  
			,  pst_anexo.acordo as  acordo  
			,  pst_anexo.nome_arquivo_pst as  nome_arquivo_pst  
			,  pst_anexo.caminho_arquivo_pst as  caminho_arquivo_pst  
			,  pst_anexo.assunto_email as  assunto_email  
			,  pst_anexo.remetente_email as  remetente_email  
			,  pst_anexo.data_email as  data_email  
			,  pst_anexo.indice_anexo as  indice_anexo  
			,  pst_anexo.nome_original_anexo as  nome_original_anexo  
			,  pst_anexo.nome_anexo_salvo as  nome_anexo_salvo  
			,  pst_anexo.caminho_anexo as  caminho_anexo  
			,  pst_anexo.pasta_acordo as  pasta_acordo  
			,  pst_anexo.tamanho_anexo_bytes as  tamanho_anexo_bytes  
			,  to_char(pst_anexo.data_criacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_criacao  
			,  to_char(pst_anexo.data_atualizacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_atualizacao  
			,  pst_anexo.status_arquivos as  status_arquivos  
			,  pst_anexo.status_assinatura as  status_assinatura  
			,  pst_anexo.user_insert as  user_insert  
			,  pst_anexo.user_update as  user_update  
			,  coalesce(paf_det.id_cab,0) as  paf_det_id_cab  
			, coalesce(to_char(paf_det.data_emissao, 'DD/MM/YYYY'),'') as paf_det_data_emissao  
			,  coalesce(paf_det.valor_bruto,0) as  paf_det_valor_bruto  
			,  coalesce(paf_det.acordo,'') as  paf_det_acordo    
			FROM psts_anexos pst_anexo			   
				 left join paf_det paf_det on paf_det.id_empresa = pst_anexo.id_empresa and paf_det.id = pst_anexo.id_pafs_det  `;
        return db.manyOrNone(strSql);
    }
};
/* CRUD - INSERT */
exports.insertPst_Anexo = function(pst_anexo) {
    strSql = `insert into psts_anexos (
		     id_empresa 
		 ,   id 
		 ,   id_email_pst 
		 ,   id_pafs_det 
		 ,   acordo 
		 ,   nome_arquivo_pst 
		 ,   caminho_arquivo_pst 
		 ,   assunto_email 
		 ,   remetente_email 
		 ,   data_email 
		 ,   indice_anexo 
		 ,   nome_original_anexo 
		 ,   nome_anexo_salvo 
		 ,   caminho_anexo 
		 ,   pasta_acordo 
		 ,   tamanho_anexo_bytes 
		 ,   data_criacao 
		 ,   data_atualizacao 
		 ,   status_arquivos 
		 ,   status_assinatura 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${pst_anexo.id_empresa} 
		 ,   ${pst_anexo.id} 
		 ,   ${pst_anexo.id_email_pst} 
		 ,   ${pst_anexo.id_pafs_det} 
		 ,   '${pst_anexo.acordo}' 
		 ,   '${pst_anexo.nome_arquivo_pst}' 
		 ,   '${pst_anexo.caminho_arquivo_pst}' 
		 ,   '${pst_anexo.assunto_email}' 
		 ,   '${pst_anexo.remetente_email}' 
		 ,   '${pst_anexo.data_email}' 
		 ,   ${pst_anexo.indice_anexo} 
		 ,   '${pst_anexo.nome_original_anexo}' 
		 ,   '${pst_anexo.nome_anexo_salvo}' 
		 ,   '${pst_anexo.caminho_anexo}' 
		 ,   '${pst_anexo.pasta_acordo}' 
		 ,   ${pst_anexo.tamanho_anexo_bytes} 
		 ,   '${pst_anexo.data_criacao.replace("GMT-0300", "").replace("T", " ").replace("Z", "")}' 
		 ,   '${pst_anexo.data_atualizacao.replace("GMT-0300", "").replace("T", " ").replace("Z", "")}' 
		 ,   '${pst_anexo.status_arquivos}' 
		 ,   '${pst_anexo.status_assinatura}' 
		 ,   ${pst_anexo.user_insert} 
		 ,   ${pst_anexo.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updatePst_Anexo = function(pst_anexo) {
    strSql = `update   psts_anexos set  
		     id_email_pst = ${pst_anexo.id_email_pst} 
 		 ,   id_pafs_det = ${pst_anexo.id_pafs_det} 
 		 ,   acordo = '${pst_anexo.acordo}' 
 		 ,   nome_arquivo_pst = '${pst_anexo.nome_arquivo_pst}' 
 		 ,   caminho_arquivo_pst = '${pst_anexo.caminho_arquivo_pst}' 
 		 ,   assunto_email = '${pst_anexo.assunto_email}' 
 		 ,   remetente_email = '${pst_anexo.remetente_email}' 
 		 ,   data_email = '${pst_anexo.data_email}' 
 		 ,   indice_anexo = ${pst_anexo.indice_anexo} 
 		 ,   nome_original_anexo = '${pst_anexo.nome_original_anexo}' 
 		 ,   nome_anexo_salvo = '${pst_anexo.nome_anexo_salvo}' 
 		 ,   caminho_anexo = '${pst_anexo.caminho_anexo}' 
 		 ,   pasta_acordo = '${pst_anexo.pasta_acordo}' 
 		 ,   tamanho_anexo_bytes = ${pst_anexo.tamanho_anexo_bytes} 
 		 ,   data_criacao = '${pst_anexo.data_criacao.replace("GMT-0300", "").replace("T", " ").replace("Z", "")}' 
 		 ,   data_atualizacao = '${pst_anexo.data_atualizacao.replace("GMT-0300", "").replace("T", " ").replace("Z", "")}' 
 		 ,   status_arquivos = '${pst_anexo.status_arquivos}' 
 		 ,   status_assinatura = '${pst_anexo.status_assinatura}' 
 		 ,   user_insert = ${pst_anexo.user_insert} 
 		 ,   user_update = ${pst_anexo.user_update} 
 		 where id_empresa = ${pst_anexo.id_empresa} and  id = ${pst_anexo.id}  returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deletePst_Anexo = function(id_empresa, id) {
    strSql = `delete from psts_anexos 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
    return db.oneOrNone(strSql);
};