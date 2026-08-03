/* DATA contratos_cab */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Contrato_Cab){
return [ 
			Contrato_Cab.id_empresa, 
			Contrato_Cab.id, 
			Contrato_Cab.nome_arquivo, 
			Contrato_Cab.pasta_arquivo, 
			Contrato_Cab.aba, 
			Contrato_Cab.qtd_linhas_total, 
			Contrato_Cab.tamanho, 
			Contrato_Cab.total_valor, 
			Contrato_Cab.status, 
			Contrato_Cab.processado, 
			Contrato_Cab.user_insert, 
			Contrato_Cab.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getContrato_Cab = function(id_empresa,nome_arquivo,pasta_arquivo,aba){
	strSql = ` select   
			   contrato_cab.id_empresa as  id_empresa  
			,  contrato_cab.id as  id  
			,  contrato_cab.nome_arquivo as  nome_arquivo  
			,  contrato_cab.pasta_arquivo as  pasta_arquivo  
			,  contrato_cab.aba as  aba  
			,  contrato_cab.qtd_linhas_total as  qtd_linhas_total  
			,  contrato_cab.tamanho as  tamanho  
			,  contrato_cab.total_valor as  total_valor  
			,  contrato_cab.status as  status  
			, to_char(contrato_cab.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			,  contrato_cab.user_insert as  user_insert  
			,  contrato_cab.user_update as  user_update    
 			FROM contratos_cab contrato_cab 	     
			 where contrato_cab.id_empresa = ${id_empresa} and  contrato_cab.nome_arquivo = '${nome_arquivo}' and  contrato_cab.pasta_arquivo = '${pasta_arquivo}' and  contrato_cab.aba = '${aba}'  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getContratos_Cab = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'contrato_cab.id_empresa,contrato_cab.nome_arquivo';
	if(params.orderby == '000001') orderby = 'contrato_cab.id_empresa,contrato_cab.nome_arquivo';
	if(params.orderby == '000002') orderby = 'contrato_cab.id_empresa,contrato_cab.pasta_arquivo';
	if(params.orderby == '000003') orderby = 'contrato_cab.id_empresa,contrato_cab.aba';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `contrato_cab.id_empresa = ${params.id_empresa} `;
	}
	if(params.nome_arquivo .trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `contrato_cab.nome_arquivo  = '${params.nome_arquivo }' `;
		} else 
		{
			where += `contrato_cab.nome_arquivo  like '%${params.nome_arquivo .trim()}%' `;
		}
	}
	if(params.pasta_arquivo.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `contrato_cab.pasta_arquivo = '${params.pasta_arquivo}' `;
		} else 
		{
			where += `contrato_cab.pasta_arquivo like '%${params.pasta_arquivo.trim()}%' `;
		}
	}
	if(params.aba.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `contrato_cab.aba = '${params.aba}' `;
		} else 
		{
			where += `contrato_cab.aba like '%${params.aba.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM contratos_cab contrato_cab      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   contrato_cab.id_empresa as  id_empresa  
			,  contrato_cab.id as  id  
			,  contrato_cab.nome_arquivo as  nome_arquivo  
			,  contrato_cab.pasta_arquivo as  pasta_arquivo  
			,  contrato_cab.aba as  aba  
			,  contrato_cab.qtd_linhas_total as  qtd_linhas_total  
			,  contrato_cab.tamanho as  tamanho  
			,  contrato_cab.total_valor as  total_valor  
			,  contrato_cab.status as  status  
			, to_char(contrato_cab.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			,  contrato_cab.user_insert as  user_insert  
			,  contrato_cab.user_update as  user_update     
			FROM contratos_cab contrato_cab      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   contrato_cab.id_empresa as  id_empresa  
			,  contrato_cab.id as  id  
			,  contrato_cab.nome_arquivo as  nome_arquivo  
			,  contrato_cab.pasta_arquivo as  pasta_arquivo  
			,  contrato_cab.aba as  aba  
			,  contrato_cab.qtd_linhas_total as  qtd_linhas_total  
			,  contrato_cab.tamanho as  tamanho  
			,  contrato_cab.total_valor as  total_valor  
			,  contrato_cab.status as  status  
			, to_char(contrato_cab.processado, 'YYYY-MM-DD HH24:MI GMT-0300') as processado  
			,  contrato_cab.user_insert as  user_insert  
			,  contrato_cab.user_update as  user_update    
			FROM contratos_cab contrato_cab			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertContrato_Cab = function(contrato_cab){
	strSql = `insert into contratos_cab (
		     id_empresa 
		 ,   nome_arquivo 
		 ,   pasta_arquivo 
		 ,   aba 
		 ,   qtd_linhas_total 
		 ,   tamanho 
		 ,   total_valor 
		 ,   status 
		 ,   processado 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${contrato_cab.id_empresa} 
		 ,   '${contrato_cab.nome_arquivo}' 
		 ,   '${contrato_cab.pasta_arquivo}' 
		 ,   '${contrato_cab.aba}' 
		 ,   ${contrato_cab.qtd_linhas_total} 
		 ,   ${contrato_cab.tamanho} 
		 ,   ${contrato_cab.total_valor} 
		 ,   '${contrato_cab.status}' 
		 ,   '${contrato_cab.processado.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   ${contrato_cab.user_insert} 
		 ,   ${contrato_cab.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateContrato_Cab = function(contrato_cab){
	strSql = `update   contratos_cab set  
		     id = ${contrato_cab.id} 
 		 ,   qtd_linhas_total = ${contrato_cab.qtd_linhas_total} 
 		 ,   tamanho = ${contrato_cab.tamanho} 
 		 ,   total_valor = ${contrato_cab.total_valor} 
 		 ,   status = '${contrato_cab.status}' 
 		 ,   processado = '${contrato_cab.processado.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   user_insert = ${contrato_cab.user_insert} 
 		 ,   user_update = ${contrato_cab.user_update} 
 		 where id_empresa = ${contrato_cab.id_empresa} and  nome_arquivo = '${contrato_cab.nome_arquivo}' and  pasta_arquivo = '${contrato_cab.pasta_arquivo}' and  aba = '${contrato_cab.aba}'  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteContrato_Cab = function(id_empresa,nome_arquivo,pasta_arquivo,aba){
	strSql = `delete from contratos_cab 
		 where id_empresa = ${id_empresa} and  nome_arquivo = '${nome_arquivo}' and  pasta_arquivo = '${pasta_arquivo}' and  aba = '${aba}'  `;
 	return  db.oneOrNone(strSql);
}


