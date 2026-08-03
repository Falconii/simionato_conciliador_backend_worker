/* DATA psts_emails */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Pst_Email){
return [ 
			Pst_Email.id_empresa, 
			Pst_Email.id, 
			Pst_Email.id_pafs_det, 
			Pst_Email.acordo, 
			Pst_Email.nome_arquivo_pst, 
			Pst_Email.caminho_arquivo_pst, 
			Pst_Email.assunto_email, 
			Pst_Email.remetente_email, 
			Pst_Email.data_email, 
			Pst_Email.quantidade_anexos, 
			Pst_Email.data_criacao, 
			Pst_Email.data_atualizacao, 
			Pst_Email.status_arquivos, 
			Pst_Email.status_assinatura, 
			Pst_Email.user_insert, 
			Pst_Email.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getPst_Email = function(id_empresa,id){
	strSql = ` select   
			   pst_email.id_empresa as  id_empresa  
			,  pst_email.id as  id  
			,  pst_email.id_pafs_det as  id_pafs_det  
			,  pst_email.acordo as  acordo  
			,  pst_email.nome_arquivo_pst as  nome_arquivo_pst  
			,  pst_email.caminho_arquivo_pst as  caminho_arquivo_pst  
			,  pst_email.assunto_email as  assunto_email  
			,  pst_email.remetente_email as  remetente_email  
			,  pst_email.data_email as  data_email  
			,  pst_email.quantidade_anexos as  quantidade_anexos  
			, to_char(pst_email.data_criacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_criacao  
			, to_char(pst_email.data_atualizacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_atualizacao  
			,  pst_email.status_arquivos as  status_arquivos  
			,  pst_email.status_assinatura as  status_assinatura  
			,  pst_email.user_insert as  user_insert  
			,  pst_email.user_update as  user_update    
 			FROM psts_emails pst_email 	     
			 where pst_email.id_empresa = ${id_empresa} and  pst_email.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getPsts_Emails = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'pst_email.id_empresa,pst_email.id';
	if(params.orderby == '000001') orderby = 'pst_email.id_empresa,pst_email.id';
	if(params.orderby == '000003') orderby = 'pst_email.id_empresa,pst_email.id_pafs_det';
	if(params.orderby == '000002') orderby = 'pst_email.id_empresa,pst_email.acordo';
	if(params.orderby == '000004') orderby = 'pst_email.id_empresa,pst_email.assunto_email';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `pst_email.id_empresa = ${params.id_empresa} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `pst_email.id = ${params.id} `;
	}
	if(params.id_pafs_det  !== 0 ){
		if (where != "") where += " and "; 
		where += `pst_email.id_pafs_det = ${params.id_pafs_det} `;
	}
	if(params.acordo.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `pst_email.acordo = '${params.acordo}' `;
		} else 
		{
			where += `pst_email.acordo like '%${params.acordo.trim()}%' `;
		}
	}
	if(params.assunto_email.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `pst_email.assunto_email = '${params.assunto_email}' `;
		} else 
		{
			where += `pst_email.assunto_email like '%${params.assunto_email.trim()}%' `;
		}
	}
	if(params.status_arquivos.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `pst_email.status_arquivos = '${params.status_arquivos}' `;
		} else 
		{
			where += `pst_email.status_arquivos like '%${params.status_arquivos.trim()}%' `;
		}
	}
	if(params.status_assinatura.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `pst_email.status_assinatura = '${params.status_assinatura}' `;
		} else 
		{
			where += `pst_email.status_assinatura like '%${params.status_assinatura.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM psts_emails pst_email      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   pst_email.id_empresa as  id_empresa  
			,  pst_email.id as  id  
			,  pst_email.id_pafs_det as  id_pafs_det  
			,  pst_email.acordo as  acordo  
			,  pst_email.nome_arquivo_pst as  nome_arquivo_pst  
			,  pst_email.caminho_arquivo_pst as  caminho_arquivo_pst  
			,  pst_email.assunto_email as  assunto_email  
			,  pst_email.remetente_email as  remetente_email  
			,  pst_email.data_email as  data_email  
			,  pst_email.quantidade_anexos as  quantidade_anexos  
			, to_char(pst_email.data_criacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_criacao  
			, to_char(pst_email.data_atualizacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_atualizacao  
			,  pst_email.status_arquivos as  status_arquivos  
			,  pst_email.status_assinatura as  status_assinatura  
			,  pst_email.user_insert as  user_insert  
			,  pst_email.user_update as  user_update     
			FROM psts_emails pst_email      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   pst_email.id_empresa as  id_empresa  
			,  pst_email.id as  id  
			,  pst_email.id_pafs_det as  id_pafs_det  
			,  pst_email.acordo as  acordo  
			,  pst_email.nome_arquivo_pst as  nome_arquivo_pst  
			,  pst_email.caminho_arquivo_pst as  caminho_arquivo_pst  
			,  pst_email.assunto_email as  assunto_email  
			,  pst_email.remetente_email as  remetente_email  
			,  pst_email.data_email as  data_email  
			,  pst_email.quantidade_anexos as  quantidade_anexos  
			, to_char(pst_email.data_criacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_criacao  
			, to_char(pst_email.data_atualizacao, 'YYYY-MM-DD HH24:MI GMT-0300') as data_atualizacao  
			,  pst_email.status_arquivos as  status_arquivos  
			,  pst_email.status_assinatura as  status_assinatura  
			,  pst_email.user_insert as  user_insert  
			,  pst_email.user_update as  user_update    
			FROM psts_emails pst_email			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertPst_Email = function(pst_email){
	strSql = `insert into psts_emails (
		     id_empresa 
		 ,   id 
		 ,   id_pafs_det 
		 ,   acordo 
		 ,   nome_arquivo_pst 
		 ,   caminho_arquivo_pst 
		 ,   assunto_email 
		 ,   remetente_email 
		 ,   data_email 
		 ,   quantidade_anexos 
		 ,   data_criacao 
		 ,   data_atualizacao 
		 ,   status_arquivos 
		 ,   status_assinatura 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${pst_email.id_empresa} 
		 ,   ${pst_email.id} 
		 ,   ${pst_email.id_pafs_det} 
		 ,   '${pst_email.acordo}' 
		 ,   '${pst_email.nome_arquivo_pst}' 
		 ,   '${pst_email.caminho_arquivo_pst}' 
		 ,   '${pst_email.assunto_email}' 
		 ,   '${pst_email.remetente_email}' 
		 ,   '${pst_email.data_email}' 
		 ,   ${pst_email.quantidade_anexos} 
		 ,   '${pst_email.data_criacao.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   '${pst_email.data_atualizacao.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   '${pst_email.status_arquivos}' 
		 ,   '${pst_email.status_assinatura}' 
		 ,   ${pst_email.user_insert} 
		 ,   ${pst_email.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updatePst_Email = function(pst_email){
	strSql = `update   psts_emails set  
		     id_pafs_det = ${pst_email.id_pafs_det} 
 		 ,   acordo = '${pst_email.acordo}' 
 		 ,   nome_arquivo_pst = '${pst_email.nome_arquivo_pst}' 
 		 ,   caminho_arquivo_pst = '${pst_email.caminho_arquivo_pst}' 
 		 ,   assunto_email = '${pst_email.assunto_email}' 
 		 ,   remetente_email = '${pst_email.remetente_email}' 
 		 ,   data_email = '${pst_email.data_email}' 
 		 ,   quantidade_anexos = ${pst_email.quantidade_anexos} 
 		 ,   data_criacao = '${pst_email.data_criacao.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   data_atualizacao = '${pst_email.data_atualizacao.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   status_arquivos = '${pst_email.status_arquivos}' 
 		 ,   status_assinatura = '${pst_email.status_assinatura}' 
 		 ,   user_insert = ${pst_email.user_insert} 
 		 ,   user_update = ${pst_email.user_update} 
 		 where id_empresa = ${pst_email.id_empresa} and  id = ${pst_email.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deletePst_Email = function(id_empresa,id){
	strSql = `delete from psts_emails 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


