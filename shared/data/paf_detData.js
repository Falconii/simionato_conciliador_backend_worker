/* DATA paf_det */
const db = require("../../shared/infra/database");
const shared = require("../../shared/util/shared.js");

/* GET CAMPOS */
exports.getCampos = function(Paf_Det) {
    return [
        Paf_Det.id_empresa,
        Paf_Det.id,
        Paf_Det.id_cab,
        Paf_Det.id_contrato,
        Paf_Det.pagina,
        Paf_Det.solicitante,
        Paf_Det.area,
        Paf_Det.unidade,
        Paf_Det.fornecedor,
        Paf_Det.cnpj,
        Paf_Det.data_emissao,
        Paf_Det.vencimento,
        Paf_Det.homologacao,
        Paf_Det.centro_custo_rateio,
        Paf_Det.valor_bruto,
        Paf_Det.valor_deposito,
        Paf_Det.acordo,
        Paf_Det.acao,
        Paf_Det.numero_documento,
        Paf_Det.banco,
        Paf_Det.agencia,
        Paf_Det.conta_deposito,
        Paf_Det.status,
        Paf_Det.fornecedor_site,
        Paf_Det.user_insert,
        Paf_Det.user_update,
    ];
};
/* CRUD GET */
exports.getPaf_Det = function(id) {
    strSql = ` select   
			   paf_det.id_empresa as  id_empresa  
			,  paf_det.id as  id  
			,  paf_det.id_cab as  id_cab  
			,  paf_det.id_contrato as  id_contrato  
			,  paf_det.pagina as  pagina  
			,  paf_det.solicitante as  solicitante  
			,  paf_det.area as  area  
			,  paf_det.unidade as  unidade  
			,  paf_det.fornecedor as  fornecedor  
			,  paf_det.cnpj as  cnpj  
			, to_char(paf_det.data_emissao, 'DD/MM/YYYY') as data_emissao  
			, to_char(paf_det.vencimento, 'DD/MM/YYYY') as vencimento  
			, to_char(paf_det.homologacao, 'DD/MM/YYYY') as homologacao  
			,  paf_det.centro_custo_rateio as  centro_custo_rateio  
			,  paf_det.valor_bruto as  valor_bruto  
			,  paf_det.valor_deposito as  valor_deposito  
			,  paf_det.acordo as  acordo  
			,  paf_det.acao as  acao  
			,  paf_det.numero_documento as  numero_documento  
			,  paf_det.banco as  banco  
			,  paf_det.agencia as  agencia  
			,  paf_det.conta_deposito as  conta_deposito  
			,  paf_det.status as  status  
			,  paf_det.fornecedor_site as  fornecedor_site  
			,  paf_det.user_insert as  user_insert  
			,  paf_det.user_update as  user_update    
 			FROM paf_det paf_det 	     
			 where paf_det.id = ${id}  `;
    return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getPafs_Det = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";

        if (params.orderby == "")
            orderby = "paf_det.id_empresa,paf_det.id_cab,paf_det.id";
        if (params.orderby == "000001")
            orderby = "paf_det.id_empresa,paf_det.id_cab,paf_det.id";

        if (orderby != "") orderby = " order by " + orderby;
        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `paf_det.id_empresa = ${params.id_empresa} `;
        }
        if (params.id !== 0) {
            if (where != "") where += " and ";
            where += `paf_det.id = ${params.id} `;
        }
        if (params.id_cab !== 0) {
            if (where != "") where += " and ";
            where += `paf_det.id_cab = ${params.id_cab} `;
        }
        if (params.file_name.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `paf_det.file_name = '${params.file_name}' `;
            } else {
                where += `paf_det.file_name like '%${params.file_name.trim()}%' `;
            }
        }
        if (params.status.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `paf_det.status = '${params.status}' `;
            } else {
                where += `paf_det.status like '%${params.status.trim()}%' `;
            }
        }
        if (where != "") where = " where " + where;
        if (params.pagina != 0) {
            paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
        }
        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM paf_det paf_det      
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   paf_det.id_empresa as  id_empresa  
			,  paf_det.id as  id  
			,  paf_det.id_cab as  id_cab  
			,  paf_det.id_contrato as  id_contrato  
			,  paf_det.pagina as  pagina  
			,  paf_det.solicitante as  solicitante  
			,  paf_det.area as  area  
			,  paf_det.unidade as  unidade  
			,  paf_det.fornecedor as  fornecedor  
			,  paf_det.cnpj as  cnpj  
			, to_char(paf_det.data_emissao, 'DD/MM/YYYY') as data_emissao  
			, to_char(paf_det.vencimento, 'DD/MM/YYYY') as vencimento  
			, to_char(paf_det.homologacao, 'DD/MM/YYYY') as homologacao  
			,  paf_det.centro_custo_rateio as  centro_custo_rateio  
			,  paf_det.valor_bruto as  valor_bruto  
			,  paf_det.valor_deposito as  valor_deposito  
			,  paf_det.acordo as  acordo  
			,  paf_det.acao as  acao  
			,  paf_det.numero_documento as  numero_documento  
			,  paf_det.banco as  banco  
			,  paf_det.agencia as  agencia  
			,  paf_det.conta_deposito as  conta_deposito  
			,  paf_det.status as  status  
			,  paf_det.fornecedor_site as  fornecedor_site  
			,  paf_det.user_insert as  user_insert  
			,  paf_det.user_update as  user_update     
			FROM paf_det paf_det      
			${where} 			${orderby} ${paginacao} `;
            console.log("getdetalhe", strSql);
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `select   
			   paf_det.id_empresa as  id_empresa  
			,  paf_det.id as  id  
			,  paf_det.id_cab as  id_cab  
			,  paf_det.id_contrato as  id_contrato  
			,  paf_det.pagina as  pagina  
			,  paf_det.solicitante as  solicitante  
			,  paf_det.area as  area  
			,  paf_det.unidade as  unidade  
			,  paf_det.fornecedor as  fornecedor  
			,  paf_det.cnpj as  cnpj  
			, to_char(paf_det.data_emissao, 'DD/MM/YYYY') as data_emissao  
			, to_char(paf_det.vencimento, 'DD/MM/YYYY') as vencimento  
			, to_char(paf_det.homologacao, 'DD/MM/YYYY') as homologacao  
			,  paf_det.centro_custo_rateio as  centro_custo_rateio  
			,  paf_det.valor_bruto as  valor_bruto  
			,  paf_det.valor_deposito as  valor_deposito  
			,  paf_det.acordo as  acordo  
			,  paf_det.acao as  acao  
			,  paf_det.numero_documento as  numero_documento  
			,  paf_det.banco as  banco  
			,  paf_det.agencia as  agencia  
			,  paf_det.conta_deposito as  conta_deposito  
			,  paf_det.status as  status  
			,  paf_det.fornecedor_site as  fornecedor_site  
			,  paf_det.user_insert as  user_insert  
			,  paf_det.user_update as  user_update    
			FROM paf_det paf_det			     `;
        return db.manyOrNone(strSql);
    }
};
/* CRUD - INSERT */
exports.insertPaf_Det = function(paf_det) {
    strSql = `insert into paf_det (
		     id_empresa 
		 ,   id_cab 
		 ,   id_contrato 
		 ,   pagina 
		 ,   solicitante 
		 ,   area 
		 ,   unidade 
		 ,   fornecedor 
		 ,   cnpj 
		 ,   data_emissao 
		 ,   vencimento 
		 ,   homologacao 
		 ,   centro_custo_rateio 
		 ,   valor_bruto 
		 ,   valor_deposito 
		 ,   acordo 
		 ,   acao 
		 ,   numero_documento 
		 ,   banco 
		 ,   agencia 
		 ,   conta_deposito 
		 ,   status 
		 ,   fornecedor_site 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${paf_det.id_empresa} 
		 ,   ${paf_det.id_cab} 
		 ,   ${paf_det.id_contrato} 
		 ,   ${paf_det.pagina} 
		 ,   '${shared.excluirCaracteres(paf_det.solicitante)}' 
		 ,   '${paf_det.area}' 
		 ,   '${shared.excluirCaracteres(paf_det.unidade)}' 
		 ,   '${shared.excluirCaracteres(paf_det.fornecedor)}' 
		 ,   '${paf_det.cnpj}' 
		 ,   ' ${shared.formatDateYYYYMMDD(paf_det.data_emissao)}',  
		 ,   ' ${shared.formatDateYYYYMMDD(paf_det.vencimento)}',  
		 ,   ' ${shared.formatDateYYYYMMDD(paf_det.homologacao)}', 
		 ,   '${paf_det.centro_custo_rateio}' 
		 ,   ${paf_det.valor_bruto} 
		 ,   ${paf_det.valor_deposito} 
		 ,   '${paf_det.acordo}' 
		 ,   '${paf_det.acao}' 
		 ,   '${paf_det.numero_documento}' 
		 ,   '${paf_det.banco}' 
		 ,   '${paf_det.agencia}' 
		 ,   '${paf_det.conta_deposito}' 
		 ,   '${paf_det.status}' 
		 ,   '${shared.excluirCaracteres(paf_det.fornecedor_site)}' 
		 ,   ${paf_det.user_insert} 
		 ,   ${paf_det.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updatePaf_Det = function(paf_det) {
    strSql = `update   paf_det set  
		     id_empresa = ${paf_det.id_empresa} 
 		 ,   id_cab = ${paf_det.id_cab} 
 		 ,   id_contrato = ${paf_det.id_contrato} 
 		 ,   pagina = ${paf_det.pagina} 
 		 ,   solicitante = '${shared.excluirCaracteres(paf_det.solicitante)}' 
 		 ,   area = '${paf_det.area}' 
 		 ,   unidade = '${shared.excluirCaracteres(paf_det.unidade)}' 
 		 ,   fornecedor = '${shared.excluirCaracteres(paf_det.fornecedor)}' 
 		 ,   cnpj = '${paf_det.cnpj}' 
         ,   data_emissao = '${shared.formatDateYYYYMMDD(paf_det.data_emissao)}'
		 ,   vencimento = '${shared.formatDateYYYYMMDD(paf_det.vencimento)}'
		 ,   homologacao = '${shared.formatDateYYYYMMDD(paf_det.homologacao)}' 
 		 ,   centro_custo_rateio = '${paf_det.centro_custo_rateio}' 
 		 ,   valor_bruto = ${paf_det.valor_bruto} 
 		 ,   valor_deposito = ${paf_det.valor_deposito} 
 		 ,   acordo = '${paf_det.acordo}' 
 		 ,   acao = '${paf_det.acao}' 
 		 ,   numero_documento = '${paf_det.numero_documento}' 
 		 ,   banco = '${paf_det.banco}' 
 		 ,   agencia = '${paf_det.agencia}' 
 		 ,   conta_deposito = '${paf_det.conta_deposito}' 
 		 ,   status = '${paf_det.status}' 
 		 ,   fornecedor_site = '${shared.excluirCaracteres(paf_det.fornecedor_site)}' 
 		 ,   user_insert = ${paf_det.user_insert} 
 		 ,   user_update = ${paf_det.user_update} 
 		 where id = ${paf_det.id}  returning * `;
    console.log("update: ", strSql);
    return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deletePaf_Det = function(id) {
    strSql = `delete from paf_det 
		 where id = ${id}  `;
    return db.oneOrNone(strSql);
};