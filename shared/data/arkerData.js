/* DATA arker */
const db = require('../../shared/infra/database');
const shared = require("../../shared/util/shared.js");

/* GET CAMPOS */
exports.getCampos = function(Arker){
return [ 
			Arker.id, 
			Arker.id_empresa, 
			Arker.empresa, 
			Arker.no_grupo, 
			Arker.no_acao, 
			Arker.no_acordo, 
			Arker.documento_lancamento, 
			Arker.exercicio_documento_lancamento, 
			Arker.valor_original, 
			Arker.valor_liquido, 
			Arker.data_base, 
			Arker.data_lancamento, 
			Arker.data_documento, 
			Arker.ordem_de_pagamento, 
			Arker.centro_de_custo, 
			Arker.bloqueio, 
			Arker.denominacao_bloqueio, 
			Arker.usuario_criador_doc_lcto, 
			Arker.data_criacao_doc_lcto, 
			Arker.hora_criacao_doc_lcto, 
			Arker.cod_fornecedor_execucao, 
			Arker.denominacao_fornecedor_execucao, 
			Arker.cnpj_fornecedor_execucao, 
			Arker.status_arker, 
			Arker.denominacao_status_arker, 
			Arker.doc_transferencia_compensacao, 
			Arker.exercicio_doc_transferencia_compensacao, 
			Arker.usuario_criador_doc_transf_compensacao, 
			Arker.data_criacao_doc_tranf_compensacao, 
			Arker.hora_criacao_doc_transf_comp, 
			Arker.cod_fornecedor_pagador, 
			Arker.denominacao_fornecedor_pagador, 
			Arker.cnpj_fornecedor_pagador, 
			Arker.documento_estorno, 
			Arker.exercicio_doc_estorno, 
			Arker.usuario_criador_doc_estorno, 
			Arker.data_criacao_doc_estorno, 
			Arker.hora_criacao_doc_estorno, 
			Arker.codigo_agrupamento, 
			Arker.tipo_documento_arker, 
			Arker.tipo_processo_arker, 
			Arker.tx_tipo_proc_arker, 
			Arker.frm_pagto, 
			Arker.conta_do_razao, 
			Arker.texto, 
			Arker.tx_tip_doc_ark, 
			Arker.status, 
			Arker.status_rc, 
			Arker.status_arquivos, 
			Arker.status_assinatura, 
			Arker.user_insert, 
			Arker.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getArker = function(id_empresa,id){
	strSql = ` select   
			   arker.id as  id  
			,  arker.id_empresa as  id_empresa  
			,  arker.empresa as  empresa  
			,  arker.no_grupo as  no_grupo  
			,  arker.no_acao as  no_acao  
			,  arker.no_acordo as  no_acordo  
			,  arker.documento_lancamento as  documento_lancamento  
			,  arker.exercicio_documento_lancamento as  exercicio_documento_lancamento  
			,  arker.valor_original as  valor_original  
			,  arker.valor_liquido as  valor_liquido  
			, to_char(arker.data_base, 'DD/MM/YYYY') as data_base  
			, to_char(arker.data_lancamento, 'DD/MM/YYYY') as data_lancamento  
			, to_char(arker.data_documento, 'DD/MM/YYYY') as data_documento  
			,  arker.ordem_de_pagamento as  ordem_de_pagamento  
			,  arker.centro_de_custo as  centro_de_custo  
			,  arker.bloqueio as  bloqueio  
			,  arker.denominacao_bloqueio as  denominacao_bloqueio  
			,  arker.usuario_criador_doc_lcto as  usuario_criador_doc_lcto  
			, to_char(arker.data_criacao_doc_lcto, 'DD/MM/YYYY') as data_criacao_doc_lcto  
			,  arker.hora_criacao_doc_lcto as  hora_criacao_doc_lcto  
			,  arker.cod_fornecedor_execucao as  cod_fornecedor_execucao  
			,  arker.denominacao_fornecedor_execucao as  denominacao_fornecedor_execucao  
			,  arker.cnpj_fornecedor_execucao as  cnpj_fornecedor_execucao  
			,  arker.status_arker as  status_arker  
			,  arker.denominacao_status_arker as  denominacao_status_arker  
			,  arker.doc_transferencia_compensacao as  doc_transferencia_compensacao  
			,  arker.exercicio_doc_transferencia_compensacao as  exercicio_doc_transferencia_compensacao  
			,  arker.usuario_criador_doc_transf_compensacao as  usuario_criador_doc_transf_compensacao  
			, to_char(arker.data_criacao_doc_tranf_compensacao, 'DD/MM/YYYY') as data_criacao_doc_tranf_compensacao  
			,  arker.hora_criacao_doc_transf_comp as  hora_criacao_doc_transf_comp  
			,  arker.cod_fornecedor_pagador as  cod_fornecedor_pagador  
			,  arker.denominacao_fornecedor_pagador as  denominacao_fornecedor_pagador  
			,  arker.cnpj_fornecedor_pagador as  cnpj_fornecedor_pagador  
			,  arker.documento_estorno as  documento_estorno  
			,  arker.exercicio_doc_estorno as  exercicio_doc_estorno  
			,  arker.usuario_criador_doc_estorno as  usuario_criador_doc_estorno  
			, to_char(arker.data_criacao_doc_estorno, 'DD/MM/YYYY') as data_criacao_doc_estorno  
			,  arker.hora_criacao_doc_estorno as  hora_criacao_doc_estorno  
			,  arker.codigo_agrupamento as  codigo_agrupamento  
			,  arker.tipo_documento_arker as  tipo_documento_arker  
			,  arker.tipo_processo_arker as  tipo_processo_arker  
			,  arker.tx_tipo_proc_arker as  tx_tipo_proc_arker  
			,  arker.frm_pagto as  frm_pagto  
			,  arker.conta_do_razao as  conta_do_razao  
			,  arker.texto as  texto  
			,  arker.tx_tip_doc_ark as  tx_tip_doc_ark  
			,  arker.status as  status  
			,  arker.status_rc as  status_rc  
			,  arker.status_arquivos as  status_arquivos  
			,  arker.status_assinatura as  status_assinatura  
			,  arker.user_insert as  user_insert  
			,  arker.user_update as  user_update    
 			FROM arkers arker 	     
			 where arker.id_empresa = ${id_empresa} and  arker.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getArkets = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'arker.id_empresa,arker.id';
	if(params.orderby == '000001') orderby = 'arker.id_empresa,arker.id';
	if(params.orderby == '000002') orderby = 'arker.id_empresa,arker.no_acao';
	if(params.orderby == '000003') orderby = 'arker.id_empresa,arker.no_acordo';
	if(params.orderby == '000004') orderby = 'arker.id_empresa,arker.cod_fornecedor_execucao,arker.no_acao';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `arker.id_empresa = ${params.id_empresa} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `arker.id = ${params.id} `;
	}

	if(params.no_acao.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `UPPERCASE(arker.arker.no_acao) = '${params.no_acao}' `;
		} else 
		{
			where += `UPPERCASE(arker.arker.no_acao) like '%${params.no_acao.trim()}%' `;
		}
	}
	
	if(params.no_acordo.trim()  !== '' ){
		if (where != "") where += " and ";
	    if (params.sharp) { 
			 where +=  `UPPERCASE(arker.arker.no_acordo) = '${params.no_acordo}' `;
		} else 
		{
			where += `UPPERCASE(arker.arker.no_acordo) like '%${params.no_acordo.trim()}%' `;
		}
	}
	if(params.data_lancamento.trim()  !== '' ){
		if (where != "") where += " and ";
	    where +=  `arker.data_lancamento = '${shared.formatDateYYYYMMDD(params.data_lancamento)}' `;
		
	}
	if(params.valor_liquido  !== -1 ){
		if (where != "") where += " and "; 
		where += `arker.valor_liquido = ${params.valor_liquido} `;
	}
	if(params.cod_fornecedor_execucao.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `arker.cod_fornecedor_execucao = '${params.cod_fornecedor_execucao}' `;
		} else 
		{
			where += `arker.cod_fornecedor_execucao like '%${params.cod_fornecedor_execucao.trim()}%' `;
		}
	}
	if(params.denominacao_fornecedor_execucao.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `UPPER(arker.denominacao_fornecedor_execucao) = '${params.denominacao_fornecedor_execucao.trim()}' `;
		} else 
		{
			where += `UPPER(arker.denominacao_fornecedor_execucao) like '%${params.denominacao_fornecedor_execucao.trim()}%' `;
		}
	}
	if(params.cnpj_fornecedor_execucao.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `fn_cnpj_completo(arker.cnpj_fornecedor_execucao) = '${shared.limparCnpj_Cpf(params.cnpj_fornecedor_execucao.trim())}' `;
		} else 
		{
			where += `fn_cnpj_completo(arker.cnpj_fornecedor_execucao) like '%${shared.limparCnpj_Cpf(params.cnpj_fornecedor_execucao.trim())}%' `;
		}
	}
	if(params.denominacao_status_arker.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `arker.denominacao_status_arker = '${params.denominacao_status_arker}' `;
		} else 
		{
			where += `arker.denominacao_status_arker like '%${params.denominacao_status_arker.trim()}%' `;
		}
	}
	if(params.frm_pagto.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `arker.frm_pagto = '${params.frm_pagto}' `;
		} else 
		{
			where += `arker.frm_pagto like '%${params.frm_pagto.trim()}%' `;
		}
	}

	if(params.denominacao_bloqueio.trim()  !== '' ){
		if (where != "") where += " and ";
		where +=  `arker.denominacao_bloqueio = '${params.denominacao_bloqueio}' `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total
				  FROM arkers arker      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   arker.id as  id  
			,  arker.id_empresa as  id_empresa  
			,  arker.empresa as  empresa  
			,  arker.no_grupo as  no_grupo  
			,  arker.no_acao as  no_acao  
			,  arker.no_acordo as  no_acordo  
			,  arker.documento_lancamento as  documento_lancamento  
			,  arker.exercicio_documento_lancamento as  exercicio_documento_lancamento  
			,  arker.valor_original as  valor_original  
			,  arker.valor_liquido as  valor_liquido  
			, to_char(arker.data_base, 'DD/MM/YYYY') as data_base  
			, to_char(arker.data_lancamento, 'DD/MM/YYYY') as data_lancamento  
			, to_char(arker.data_documento, 'DD/MM/YYYY') as data_documento  
			,  arker.ordem_de_pagamento as  ordem_de_pagamento  
			,  arker.centro_de_custo as  centro_de_custo  
			,  arker.bloqueio as  bloqueio  
			,  arker.denominacao_bloqueio as  denominacao_bloqueio  
			,  arker.usuario_criador_doc_lcto as  usuario_criador_doc_lcto  
			, to_char(arker.data_criacao_doc_lcto, 'DD/MM/YYYY') as data_criacao_doc_lcto  
			,  arker.hora_criacao_doc_lcto as  hora_criacao_doc_lcto  
			,  arker.cod_fornecedor_execucao as  cod_fornecedor_execucao  
			,  arker.denominacao_fornecedor_execucao as  denominacao_fornecedor_execucao  
			,  arker.cnpj_fornecedor_execucao as  cnpj_fornecedor_execucao  
			,  arker.status_arker as  status_arker  
			,  arker.denominacao_status_arker as  denominacao_status_arker  
			,  arker.doc_transferencia_compensacao as  doc_transferencia_compensacao  
			,  arker.exercicio_doc_transferencia_compensacao as  exercicio_doc_transferencia_compensacao  
			,  arker.usuario_criador_doc_transf_compensacao as  usuario_criador_doc_transf_compensacao  
			,  to_char(arker.data_criacao_doc_tranf_compensacao, 'DD/MM/YYYY') as data_criacao_doc_tranf_compensacao  
			,  arker.hora_criacao_doc_transf_comp as  hora_criacao_doc_transf_comp  
			,  arker.cod_fornecedor_pagador as  cod_fornecedor_pagador  
			,  arker.denominacao_fornecedor_pagador as  denominacao_fornecedor_pagador  
			,  arker.cnpj_fornecedor_pagador as  cnpj_fornecedor_pagador  
			,  arker.documento_estorno as  documento_estorno  
			,  arker.exercicio_doc_estorno as  exercicio_doc_estorno  
			,  arker.usuario_criador_doc_estorno as  usuario_criador_doc_estorno  
			,  to_char(arker.data_criacao_doc_estorno, 'DD/MM/YYYY') as data_criacao_doc_estorno  
			,  arker.hora_criacao_doc_estorno as  hora_criacao_doc_estorno  
			,  arker.codigo_agrupamento as  codigo_agrupamento  
			,  arker.tipo_documento_arker as  tipo_documento_arker  
			,  arker.tipo_processo_arker as  tipo_processo_arker  
			,  arker.tx_tipo_proc_arker as  tx_tipo_proc_arker  
			,  arker.frm_pagto as  frm_pagto  
			,  arker.conta_do_razao as  conta_do_razao  
			,  arker.texto as  texto  
			,  arker.tx_tip_doc_ark as  tx_tip_doc_ark  
			,  arker.status as  status  
			,  arker.status_rc as  status_rc  
			,  arker.status_arquivos as  status_arquivos  
			,  arker.status_assinatura as  status_assinatura  
			,  arker.user_insert as  user_insert  
			,  arker.user_update as  user_update     
			from arkers arker      
			${where} 			${ orderby} ${ paginacao} `;
			console.log("strsql",strSql);
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   arker.id as  id  
			,  arker.id_empresa as  id_empresa  
			,  arker.empresa as  empresa  
			,  arker.no_grupo as  no_grupo  
			,  arker.no_acao as  no_acao  
			,  arker.no_acordo as  no_acordo  
			,  arker.documento_lancamento as  documento_lancamento  
			,  arker.exercicio_documento_lancamento as  exercicio_documento_lancamento  
			,  arker.valor_original as  valor_original  
			,  arker.valor_liquido as  valor_liquido  
			, to_char(arker.data_base, 'DD/MM/YYYY') as data_base  
			, to_char(arker.data_lancamento, 'DD/MM/YYYY') as data_lancamento  
			, to_char(arker.data_documento, 'DD/MM/YYYY') as data_documento  
			,  arker.ordem_de_pagamento as  ordem_de_pagamento  
			,  arker.centro_de_custo as  centro_de_custo  
			,  arker.bloqueio as  bloqueio  
			,  arker.denominacao_bloqueio as  denominacao_bloqueio  
			,  arker.usuario_criador_doc_lcto as  usuario_criador_doc_lcto  
			, to_char(arker.data_criacao_doc_lcto, 'DD/MM/YYYY') as data_criacao_doc_lcto  
			,  arker.hora_criacao_doc_lcto as  hora_criacao_doc_lcto  
			,  arker.cod_fornecedor_execucao as  cod_fornecedor_execucao  
			,  arker.denominacao_fornecedor_execucao as  denominacao_fornecedor_execucao  
			,  arker.cnpj_fornecedor_execucao as  cnpj_fornecedor_execucao  
			,  arker.status_arker as  status_arker  
			,  arker.denominacao_status_arker as  denominacao_status_arker  
			,  arker.doc_transferencia_compensacao as  doc_transferencia_compensacao  
			,  arker.exercicio_doc_transferencia_compensacao as  exercicio_doc_transferencia_compensacao  
			,  arker.usuario_criador_doc_transf_compensacao as  usuario_criador_doc_transf_compensacao  
			, to_char(arker.data_criacao_doc_tranf_compensacao, 'DD/MM/YYYY') as data_criacao_doc_tranf_compensacao  
			,  arker.hora_criacao_doc_transf_comp as  hora_criacao_doc_transf_comp  
			,  arker.cod_fornecedor_pagador as  cod_fornecedor_pagador  
			,  arker.denominacao_fornecedor_pagador as  denominacao_fornecedor_pagador  
			,  arker.cnpj_fornecedor_pagador as  cnpj_fornecedor_pagador  
			,  arker.documento_estorno as  documento_estorno  
			,  arker.exercicio_doc_estorno as  exercicio_doc_estorno  
			,  arker.usuario_criador_doc_estorno as  usuario_criador_doc_estorno  
			, to_char(arker.data_criacao_doc_estorno, 'DD/MM/YYYY') as data_criacao_doc_estorno  
			,  arker.hora_criacao_doc_estorno as  hora_criacao_doc_estorno  
			,  arker.codigo_agrupamento as  codigo_agrupamento  
			,  arker.tipo_documento_arker as  tipo_documento_arker  
			,  arker.tipo_processo_arker as  tipo_processo_arker  
			,  arker.tx_tipo_proc_arker as  tx_tipo_proc_arker  
			,  arker.frm_pagto as  frm_pagto  
			,  arker.conta_do_razao as  conta_do_razao  
			,  arker.texto as  texto  
			,  arker.tx_tip_doc_ark as  tx_tip_doc_ark  
			,  arker.status as  status  
			,  arker.status_rc as  status_rc  
			,  arker.status_arquivos as  status_arquivos  
			,  arker.status_assinatura as  status_assinatura  
			,  arker.user_insert as  user_insert  
			,  arker.user_update as  user_update    
			from arkers arker			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertArker = function(arker){
	strSql = `insert into arkers (
		     id 
		 ,   id_empresa 
		 ,   empresa 
		 ,   no_grupo 
		 ,   no_acao 
		 ,   no_acordo 
		 ,   documento_lancamento 
		 ,   exercicio_documento_lancamento 
		 ,   valor_original 
		 ,   valor_liquido 
		 ,   data_base 
		 ,   data_lancamento 
		 ,   data_documento 
		 ,   ordem_de_pagamento 
		 ,   centro_de_custo 
		 ,   bloqueio 
		 ,   denominacao_bloqueio 
		 ,   usuario_criador_doc_lcto 
		 ,   data_criacao_doc_lcto 
		 ,   hora_criacao_doc_lcto 
		 ,   cod_fornecedor_execucao 
		 ,   denominacao_fornecedor_execucao 
		 ,   cnpj_fornecedor_execucao 
		 ,   status_arker 
		 ,   denominacao_status_arker 
		 ,   doc_transferencia_compensacao 
		 ,   exercicio_doc_transferencia_compensacao 
		 ,   usuario_criador_doc_transf_compensacao 
		 ,   data_criacao_doc_tranf_compensacao 
		 ,   hora_criacao_doc_transf_comp 
		 ,   cod_fornecedor_pagador 
		 ,   denominacao_fornecedor_pagador 
		 ,   cnpj_fornecedor_pagador 
		 ,   documento_estorno 
		 ,   exercicio_doc_estorno 
		 ,   usuario_criador_doc_estorno 
		 ,   data_criacao_doc_estorno 
		 ,   hora_criacao_doc_estorno 
		 ,   codigo_agrupamento 
		 ,   tipo_documento_arker 
		 ,   tipo_processo_arker 
		 ,   tx_tipo_proc_arker 
		 ,   frm_pagto 
		 ,   conta_do_razao 
		 ,   texto 
		 ,   tx_tip_doc_ark 
		 ,   status 
		 ,   status_rc 
		 ,   status_arquivos 
		 ,   status_assinatura 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${arker.id} 
		 ,   ${arker.id_empresa} 
		 ,   '${arker.empresa}' 
		 ,   '${arker.no_grupo}' 
		 ,   '${arker.no_acao}' 
		 ,   '${arker.no_acordo}' 
		 ,   '${arker.documento_lancamento}' 
		 ,   '${arker.exercicio_documento_lancamento}' 
		 ,   ${arker.valor_original} 
		 ,   ${arker.valor_liquido} 
		 ,   '${arker.data_base}' 
		 ,   '${shared.formatDateYYYYMMDD(arker.data_lancamento)}'  
		 ,   '${arker.data_documento}' 
		 ,   '${arker.ordem_de_pagamento}' 
		 ,   '${arker.centro_de_custo}' 
		 ,   '${arker.bloqueio}' 
		 ,   '${arker.denominacao_bloqueio}' 
		 ,   '${arker.usuario_criador_doc_lcto}' 
		 ,   '${arker.data_criacao_doc_lcto}' 
		 ,   ${arker.hora_criacao_doc_lcto} 
		 ,   '${arker.cod_fornecedor_execucao}' 
		 ,   '${arker.denominacao_fornecedor_execucao}' 
		 ,   '${arker.cnpj_fornecedor_execucao}' 
		 ,   '${arker.status_arker}' 
		 ,   '${arker.denominacao_status_arker}' 
		 ,   '${arker.doc_transferencia_compensacao}' 
		 ,   '${arker.exercicio_doc_transferencia_compensacao}' 
		 ,   '${arker.usuario_criador_doc_transf_compensacao}' 
		 ,   '${arker.data_criacao_doc_tranf_compensacao}' 
		 ,   ${arker.hora_criacao_doc_transf_comp} 
		 ,   '${arker.cod_fornecedor_pagador}' 
		 ,   '${arker.denominacao_fornecedor_pagador}' 
		 ,   '${arker.cnpj_fornecedor_pagador}' 
		 ,   '${arker.documento_estorno}' 
		 ,   '${arker.exercicio_doc_estorno}' 
		 ,   '${arker.usuario_criador_doc_estorno}' 
		 ,   '${arker.data_criacao_doc_estorno}' 
		 ,   ${arker.hora_criacao_doc_estorno} 
		 ,   '${arker.codigo_agrupamento}' 
		 ,   '${arker.tipo_documento_arker}' 
		 ,   '${arker.tipo_processo_arker}' 
		 ,   '${arker.tx_tipo_proc_arker}' 
		 ,   '${arker.frm_pagto}' 
		 ,   '${arker.conta_do_razao}' 
		 ,   '${arker.texto}' 
		 ,   '${arker.tx_tip_doc_ark}' 
		 ,   '${arker.status}' 
		 ,   '${arker.status_rc}' 
		 ,   '${arker.status_arquivos}' 
		 ,   '${arker.status_assinatura}' 
		 ,   ${arker.user_insert} 
		 ,   ${arker.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateArker = function(arker){
	strSql = `update   arkers set  
		     empresa = '${arker.empresa}' 
 		 ,   no_grupo = '${arker.no_grupo}' 
 		 ,   no_acao = '${arker.no_acao}' 
 		 ,   no_acordo = '${arker.no_acordo}' 
 		 ,   documento_lancamento = '${arker.documento_lancamento}' 
 		 ,   exercicio_documento_lancamento = '${arker.exercicio_documento_lancamento}' 
 		 ,   valor_original = ${arker.valor_original} 
 		 ,   valor_liquido = ${arker.valor_liquido} 
 		 ,   data_base = '${arker.data_base}' 
 		 ,   data_lancamento = '${shared.formatDateYYYYMMDD(arker.data_lancamento)}' 
 		 ,   data_documento = '${arker.data_documento}' 
 		 ,   ordem_de_pagamento = '${arker.ordem_de_pagamento}' 
 		 ,   centro_de_custo = '${arker.centro_de_custo}' 
 		 ,   bloqueio = '${arker.bloqueio}' 
 		 ,   denominacao_bloqueio = '${arker.denominacao_bloqueio}' 
 		 ,   usuario_criador_doc_lcto = '${arker.usuario_criador_doc_lcto}' 
 		 ,   data_criacao_doc_lcto = '${arker.data_criacao_doc_lcto}' 
 		 ,   hora_criacao_doc_lcto = ${arker.hora_criacao_doc_lcto} 
 		 ,   cod_fornecedor_execucao = '${arker.cod_fornecedor_execucao}' 
 		 ,   denominacao_fornecedor_execucao = '${arker.denominacao_fornecedor_execucao}' 
 		 ,   cnpj_fornecedor_execucao = '${arker.cnpj_fornecedor_execucao}' 
 		 ,   status_arker = '${arker.status_arker}' 
 		 ,   denominacao_status_arker = '${arker.denominacao_status_arker}' 
 		 ,   doc_transferencia_compensacao = '${arker.doc_transferencia_compensacao}' 
 		 ,   exercicio_doc_transferencia_compensacao = '${arker.exercicio_doc_transferencia_compensacao}' 
 		 ,   usuario_criador_doc_transf_compensacao = '${arker.usuario_criador_doc_transf_compensacao}' 
 		 ,   data_criacao_doc_tranf_compensacao = '${arker.data_criacao_doc_tranf_compensacao}' 
 		 ,   hora_criacao_doc_transf_comp = ${arker.hora_criacao_doc_transf_comp} 
 		 ,   cod_fornecedor_pagador = '${arker.cod_fornecedor_pagador}' 
 		 ,   denominacao_fornecedor_pagador = '${arker.denominacao_fornecedor_pagador}' 
 		 ,   cnpj_fornecedor_pagador = '${arker.cnpj_fornecedor_pagador}' 
 		 ,   documento_estorno = '${arker.documento_estorno}' 
 		 ,   exercicio_doc_estorno = '${arker.exercicio_doc_estorno}' 
 		 ,   usuario_criador_doc_estorno = '${arker.usuario_criador_doc_estorno}' 
 		 ,   data_criacao_doc_estorno = '${arker.data_criacao_doc_estorno}' 
 		 ,   hora_criacao_doc_estorno = ${arker.hora_criacao_doc_estorno} 
 		 ,   codigo_agrupamento = '${arker.codigo_agrupamento}' 
 		 ,   tipo_documento_arker = '${arker.tipo_documento_arker}' 
 		 ,   tipo_processo_arker = '${arker.tipo_processo_arker}' 
 		 ,   tx_tipo_proc_arker = '${arker.tx_tipo_proc_arker}' 
 		 ,   frm_pagto = '${arker.frm_pagto}' 
 		 ,   conta_do_razao = '${arker.conta_do_razao}' 
 		 ,   texto = '${arker.texto}' 
 		 ,   tx_tip_doc_ark = '${arker.tx_tip_doc_ark}' 
 		 ,   status = '${arker.status}' 
 		 ,   status_rc = '${arker.status_rc}' 
 		 ,   status_arquivos = '${arker.status_arquivos}' 
 		 ,   status_assinatura = '${arker.status_assinatura}' 
 		 ,   user_insert = ${arker.user_insert} 
 		 ,   user_update = ${arker.user_update} 
 		 where id_empresa = ${arker.id_empresa} and  id = ${arker.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteArker = function(id_empresa,id){
	strSql = `delete from arkers 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


