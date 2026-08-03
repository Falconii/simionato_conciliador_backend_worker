/* DATA arquivos_google */
const db = require('../../shared/infra/database');
const shared = require("../../shared/util/shared.js");

/* GET CAMPOS */
exports.getCampos = function(Arquivo_Google){
return [ 
			Arquivo_Google.id_empresa, 
			Arquivo_Google.pasta, 
			Arquivo_Google.id_file, 
			Arquivo_Google.folder_id, 
			Arquivo_Google.name_file, 
			Arquivo_Google.size, 
			Arquivo_Google.data, 
			Arquivo_Google.user_insert, 
			Arquivo_Google.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getArquivo_Google = function(id_empresa,id_file){
	strSql = ` select   
			   arquivo_google.id_empresa as  id_empresa  
			,  arquivo_google.pasta as  pasta  
			,  arquivo_google.id_file as  id_file  
			,  arquivo_google.folder_id as  folder_id  
			,  arquivo_google.name_file as  name_file  
			,  arquivo_google.size as  size  
			,  arquivo_google.data as  data  
			,  arquivo_google.user_insert as  user_insert  
			,  arquivo_google.user_update as  user_update    
 			FROM arquivos_google arquivo_google 	     
			 where arquivo_google.id_empresa = ${id_empresa} and  arquivo_google.id_file = '${id_file}'  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getArquivos_Google = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'arquivo_google.id_empresa,arquivo_google.name_file';
	if(params.orderby == '000001') orderby = 'arquivo_google.id_empresa,arquivo_google.name_file';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `arquivo_google.id_empresa = ${params.id_empresa} `;
	}
	if(params.pasta.trim()  !== 0 ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `arquivo_google.pasta = '${params.pasta}' `;
		} else 
		{
			where += `arquivo_google.pasta like '%${params.pasta.trim()}%' `;
		}
	}
	if(params.id_file.trim()  !== 0 ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `arquivo_google.id_file = '${params.id_file}' `;
		} else 
		{
			where += `arquivo_google.id_file like '%${params.id_file.trim()}%' `;
		}
	}
	if(params.folder_id.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `arquivo_google.folder_id = '${params.folder_id}' `;
		} else 
		{
			where += `arquivo_google.folder_id like '%${params.folder_id.trim()}%' `;
		}
	}
	if(params.name_file.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `arquivo_google.name_file = '${params.name_file}' `;
		} else 
		{
			where += `arquivo_google.name_file like '%${params.name_file.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM arquivos_google arquivo_google      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   arquivo_google.id_empresa as  id_empresa  
			,  arquivo_google.pasta as  pasta  
			,  arquivo_google.id_file as  id_file  
			,  arquivo_google.folder_id as  folder_id  
			,  arquivo_google.name_file as  name_file  
			,  arquivo_google.size as  size  
			,  arquivo_google.data as  data  
			,  arquivo_google.user_insert as  user_insert  
			,  arquivo_google.user_update as  user_update     
			FROM arquivos_google arquivo_google      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   arquivo_google.id_empresa as  id_empresa  
			,  arquivo_google.pasta as  pasta  
			,  arquivo_google.id_file as  id_file  
			,  arquivo_google.folder_id as  folder_id  
			,  arquivo_google.name_file as  name_file  
			,  arquivo_google.size as  size  
			,  arquivo_google.data as  data  
			,  arquivo_google.user_insert as  user_insert  
			,  arquivo_google.user_update as  user_update    
			FROM arquivos_google arquivo_google			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertArquivo_Google = function(arquivo_google){
	strSql = `insert into arquivos_google (
		     id_empresa 
		 ,   pasta 
		 ,   id_file 
		 ,   folder_id 
		 ,   name_file 
		 ,   size 
		 ,   data 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${arquivo_google.id_empresa} 
		 ,   '${arquivo_google.pasta}' 
		 ,   '${arquivo_google.id_file}' 
		 ,   '${arquivo_google.folder_id}' 
		 ,   '${shared.excluirCaracteres(arquivo_google.name_file)}'
		 ,   '${arquivo_google.size}' 
		 ,   '${arquivo_google.data}' 
		 ,   ${arquivo_google.user_insert} 
		 ,   ${arquivo_google.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateArquivo_Google = function(arquivo_google){
	strSql = `update   arquivos_google set  
		     pasta = '${arquivo_google.pasta}' 
 		 ,   folder_id = '${arquivo_google.folder_id}' 
 		 ,   name_file = '${arquivo_google.name_file}' 
 		 ,   size = '${arquivo_google.size}' 
 		 ,   data = '${arquivo_google.data}' 
 		 ,   user_insert = ${arquivo_google.user_insert} 
 		 ,   user_update = ${arquivo_google.user_update} 
 		 where id_empresa = ${arquivo_google.id_empresa} and  id_file = '${arquivo_google.id_file}'  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteArquivo_Google = function(id_empresa,id_file){
	strSql = `delete from arquivos_google 
		 where id_empresa = ${id_empresa} and  id_file = '${id_file}'  `;
 	return  db.oneOrNone(strSql);
}


