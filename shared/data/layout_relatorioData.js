/* DATA layouts_relatorios */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Layout_Relatorio){
return [ 
			Layout_Relatorio.id_empresa, 
			Layout_Relatorio.id, 
			Layout_Relatorio.layout, 
			Layout_Relatorio.user_insert, 
			Layout_Relatorio.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getLayout_Relatorio = function(id_empresa,layout){
	strSql = ` select   
			   layout.id_empresa as  id_empresa  
			,  layout.id as  id  
			,  layout.layout as  layout  
			,  layout.user_insert as  user_insert  
			,  layout.user_update as  user_update    
 			FROM layouts_relatorios layout 	     
			 where layout.id_empresa = ${id_empresa} and  layout.layout = '${layout}'  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getLayouts_Relatorios = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'layout.id_empresa,layout..id';
	if(params.orderby == '000001') orderby = 'layout.id_empresa,layout.id';
	if(params.orderby == '000002') orderby = 'layout.id_empresa,layout.layout';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `layout.id_empresa = ${params.id_empresa} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `layout.id = ${params.id} `;
	}
	if(params.layout.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `layout.layout = '${params.layout}' `;
		} else 
		{
			where += `layout.layout like '%${params.layout.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM layouts_relatorios layout      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   layout.id_empresa as  id_empresa  
			,  layout.id as  id  
			,  layout.layout as  layout  
			,  layout.user_insert as  user_insert  
			,  layout.user_update as  user_update     
			FROM layouts_relatorios layout      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   layout.id_empresa as  id_empresa  
			,  layout.id as  id  
			,  layout.layout as  layout  
			,  layout.user_insert as  user_insert  
			,  layout.user_update as  user_update    
			FROM layouts_relatorios layout			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertLayout_Relatorio = function(layout_relatorio){
	strSql = `insert into layouts_relatorios (
		     id_empresa 
		 ,   layout 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${layout_relatorio.id_empresa} 
		 ,   '${layout_relatorio.layout}' 
		 ,   ${layout_relatorio.user_insert} 
		 ,   ${layout_relatorio.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateLayout_Relatorio = function(layout_relatorio){
	strSql = `update   layouts_relatorios set  
		     id = ${layout_relatorio.id} 
 		 ,   user_insert = ${layout_relatorio.user_insert} 
 		 ,   user_update = ${layout_relatorio.user_update} 
 		 where id_empresa = ${layout_relatorio.id_empresa} and  layout = '${layout_relatorio.layout}'  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteLayout_Relatorio = function(id_empresa,layout){
	strSql = `delete from layouts_relatorios 
		 where id_empresa = ${id_empresa} and  layout = '${layout}'  `;
 	return  db.oneOrNone(strSql);
}


