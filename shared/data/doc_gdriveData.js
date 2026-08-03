/* DATA docs_gdrives */
const db = require("../../shared/infra/database");

const shared = require("../../shared/util/shared.js");

/* GET CAMPOS */
exports.getCampos = function(Doc_Gdrive) {
    return [
        Doc_Gdrive.id_empresa,
        Doc_Gdrive.id,
        Doc_Gdrive.id_folder,
        Doc_Gdrive.id_file,
        Doc_Gdrive.file_name,
        Doc_Gdrive.id_origem,
        Doc_Gdrive.origem,
        Doc_Gdrive.file_name_original,
        Doc_Gdrive.status_upload,
        Doc_Gdrive.user_insert,
        Doc_Gdrive.user_update,
    ];
};
/* CRUD GET */
exports.getDoc_Gdrive = function(id_empresa, id) {
    strSql = ` select   
			   doc.id_empresa as  id_empresa  
			,  doc.id as  id  
			,  doc.id_folder as  id_folder  
			,  doc.id_file as  id_file  
			,  doc.file_name as  file_name  
			,  doc.id_origem as  id_origem  
			,  doc.origem as  origem  
			,  doc.file_name_original as  file_name_original  
			,  doc.status_upload as  status_upload  
			,  doc.user_insert as  user_insert  
			,  doc.user_update as  user_update    
 			FROM docs_gdrives doc 	     
			 where doc.id_empresa = ${id_empresa} and  doc.id = ${id}  `;
    return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getDocs_Gdrives = function(params) {
    if (params) {
        console.log("params docs", params);
        where = "";
        orderby = "";
        paginacao = "";

        if (params.orderby == "") orderby = "doc.id_empresa,doc.id";
        if (params.orderby == "000000") orderby = "doc.id_empresa,doc.id";
        if (params.orderby == "000000") orderby = "doc.id_empresa,doc.id_folder";
        if (params.orderby == "000000") orderby = "doc.id_empresa,doc.id_file";
        if (params.orderby == "000000") orderby = "doc.id_empresa,doc.file_name";

        if (orderby != "") orderby = " order by " + orderby;
        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `doc.id_empresa = ${params.id_empresa} `;
        }
        if (params.id !== 0) {
            if (where != "") where += " and ";
            where += `doc.id = ${params.id} `;
        }
        if (params.id_folder.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `doc.id_folder = '${params.id_folder}' `;
            } else {
                where += `doc.id_folder like '%${params.id_folder.trim()}%' `;
            }
        }
        if (params.id_file.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `doc.id_file = '${params.id_file}' `;
            } else {
                where += `doc.id_file like '%${params.id_file.trim()}%' `;
            }
        }
        if (params.file_name.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `doc.file_name = '${shared.excluirCaracteres(params.file_name)}' `;
            } else {
                where += `doc.file_name like '%${shared.excluirCaracteres(params.file_name).trim()}%' `;
            }
        }
        if (params.origem.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `doc.origem = '${params.origem}' `;
            } else {
                where += `doc.origem like '%${params.origem.trim()}%' `;
            }
        }
        if (params.file_name_original.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `doc.file_name_original = '${shared.excluirCaracteres(params.file_name_original)}' `;
            } else {
                where += `doc.file_name_original like '%${shared.excluirCaracteres(params.file_name_original).trim()}%' `;
            }
        }
        if (params.status_upload.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `doc.status_upload = '${params.status_upload}' `;
            } else {
                where += `doc.status_upload like '%${params.status_upload.trim()}%' `;
            }
        }
        if (params.id_origem !== 0) {
            if (where != "") where += " and ";
            where += `doc.id_origem = ${params.id_origem} `;
        }
        if (where != "") where = " where " + where;
        if (params.pagina != 0) {
            paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
        }
        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM docs_gdrives doc      
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   doc.id_empresa as  id_empresa  
			,  doc.id as  id  
			,  doc.id_folder as  id_folder  
			,  doc.id_file as  id_file  
			,  doc.file_name as  file_name  
			,  doc.id_origem as  id_origem  
			,  doc.origem as  origem  
			,  doc.file_name_original as  file_name_original  
			,  doc.status_upload as  status_upload  
			,  doc.user_insert as  user_insert  
			,  doc.user_update as  user_update     
			FROM docs_gdrives doc      
			${where} 			${orderby} ${paginacao} `;
            console.log("consulta DOC", strSql);
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `select   
			   doc.id_empresa as  id_empresa  
			,  doc.id as  id  
			,  doc.id_folder as  id_folder  
			,  doc.id_file as  id_file  
			,  doc.file_name as  file_name  
			,  doc.id_origem as  id_origem  
			,  doc.origem as  origem  
			,  doc.file_name_original as  file_name_original  
			,  doc.status_upload as  status_upload  
			,  doc.user_insert as  user_insert  
			,  doc.user_update as  user_update    
			FROM docs_gdrives doc			     `;
        return db.manyOrNone(strSql);
    }
};
/* CRUD - INSERT */
exports.insertDoc_Gdrive = function(doc_gdrive) {
    strSql = `insert into docs_gdrives (
		     id_empresa 
		 ,   id_folder 
		 ,   id_file 
		 ,   file_name 
		 ,   id_origem 
		 ,   origem 
		 ,   file_name_original 
		 ,   status_upload 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${doc_gdrive.id_empresa} 
		 ,   '${doc_gdrive.id_folder}' 
		 ,   '${doc_gdrive.id_file}' 
		 ,   '${shared.excluirCaracteres(doc_gdrive.file_name)}'
		 ,   ${doc_gdrive.id_origem} 
		 ,   '${doc_gdrive.origem}' 
		 ,   '${shared.excluirCaracteres(doc_gdrive.file_name_original)}' 
		 ,   '${doc_gdrive.status_upload}' 
		 ,   ${doc_gdrive.user_insert} 
		 ,   ${doc_gdrive.user_update} 
		 ) 
 returning * `;
    console.log("SQL Insert Doc_Gdrive:", strSql);
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateDoc_Gdrive = function(doc_gdrive) {
    strSql = `update   docs_gdrives set  
		     id_folder = '${doc_gdrive.id_folder}' 
 		 ,   id_file = '${doc_gdrive.id_file}' 
 		 ,   file_name = '${shared.excluirCaracteres(doc_gdrive.file_name)}'
 		 ,   id_origem = ${doc_gdrive.id_origem} 
 		 ,   origem = '${doc_gdrive.origem}' 
 		  ,  file_name_original = '${shared.excluirCaracteres(doc_gdrive.file_name_original)}' 
 		 ,   status_upload = '${doc_gdrive.status_upload}' 
 		 ,   user_insert = ${doc_gdrive.user_insert} 
 		 ,   user_update = ${doc_gdrive.user_update} 
 		 where id_empresa = ${doc_gdrive.id_empresa} and  id = ${doc_gdrive.id}  returning * `;
    console.log("update doc", strSql);
    return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deleteDoc_Gdrive = function(id_empresa, id) {
    strSql = `delete from docs_gdrives 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
    return db.oneOrNone(strSql);
};