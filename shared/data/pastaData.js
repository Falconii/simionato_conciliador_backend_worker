/* DATA pastas */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Pasta){
return [ 
			Pasta.id_empresa, 
			Pasta.id, 
			Pasta.sigla, 
			Pasta.pasta, 
			Pasta.user_insert, 
			Pasta.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getPasta = function(id_empresa,id,sigla){
	strSql = ` select   
			   pasta.id_empresa as  id_empresa  
			,  pasta.id as  id  
			,  pasta.sigla as  sigla  
			,  pasta.pasta as  pasta  
			,  pasta.user_insert as  user_insert  
			,  pasta.user_update as  user_update    
 			FROM pastas pasta 	     
			 where pasta.id_empresa = ${id_empresa} and  pasta.id = ${id} and  pasta.sigla = '${sigla}'  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getPastas = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'pasta.id_empresa,pasta.id';
	if(params.orderby == '000000') orderby = 'pasta.id_empresa,pasta.id';
	if(params.orderby == '000000') orderby = 'pasta.id_empresa,pasta.sigla';
	if(params.orderby == '000000') orderby = 'pasta.id_empresa,pasta.pasta';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `pasta.id_empresa = ${params.id_empresa} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `pasta.id = ${params.id} `;
	}
	if(params.sigla.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `pasta.sigla = '${params.sigla}' `;
		} else 
		{
			where += `pasta.sigla like '%${params.sigla.trim()}%' `;
		}
	}
	if(params.pasta.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `pasta.pasta = '${params.pasta}' `;
		} else 
		{
			where += `pasta.pasta like '%${params.pasta.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM pastas pasta      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   pasta.id_empresa as  id_empresa  
			,  pasta.id as  id  
			,  pasta.sigla as  sigla  
			,  pasta.pasta as  pasta  
			,  pasta.user_insert as  user_insert  
			,  pasta.user_update as  user_update     
			FROM pastas pasta      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   pasta.id_empresa as  id_empresa  
			,  pasta.id as  id  
			,  pasta.sigla as  sigla  
			,  pasta.pasta as  pasta  
			,  pasta.user_insert as  user_insert  
			,  pasta.user_update as  user_update    
			FROM pastas pasta			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertPasta = function(pasta){
	strSql = `insert into pastas (
		     id_empresa 
		 ,   sigla 
		 ,   pasta 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${pasta.id_empresa} 
		 ,   '${pasta.sigla}' 
		 ,   '${pasta.pasta}' 
		 ,   ${pasta.user_insert} 
		 ,   ${pasta.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updatePasta = function(pasta){
	strSql = `update   pastas set  
		     pasta = '${pasta.pasta}' 
 		 ,   user_insert = ${pasta.user_insert} 
 		 ,   user_update = ${pasta.user_update} 
 		 where id_empresa = ${pasta.id_empresa} and  id = ${pasta.id} and  sigla = '${pasta.sigla}'  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deletePasta = function(id_empresa,id,sigla){
	strSql = `delete from pastas 
		 where id_empresa = ${id_empresa} and  id = ${id} and  sigla = '${sigla}'  `;
 	return  db.oneOrNone(strSql);
}


