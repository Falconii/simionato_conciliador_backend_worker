/* DATA contratos_det */
const db = require("../../shared/infra/database");

/* GET CAMPOS */
exports.getCampos = function(Contrato_Det) {
    return [
        Contrato_Det.id_empresa,
        Contrato_Det.id,
        Contrato_Det.id_cab,
        Contrato_Det.nro_linha,
        Contrato_Det.id_paf,
        Contrato_Det.id_sim,
        Contrato_Det.id_email,
        Contrato_Det.id_arker,
        Contrato_Det.competencia,
        Contrato_Det.base,
        Contrato_Det.cod_filial,
        Contrato_Det.filial,
        Contrato_Det.cp,
        Contrato_Det.cod_empresa,
        Contrato_Det.cod_bandeiras,
        Contrato_Det.bandeiras,
        Contrato_Det.tipo_de_pagamento,
        Contrato_Det.cod_cliente,
        Contrato_Det.cliente,
        Contrato_Det.cnpj_cliente,
        Contrato_Det.investimento,
        Contrato_Det.acao,
        Contrato_Det.proposta,
        Contrato_Det.uf,
        Contrato_Det.tipo_de_verba,
        Contrato_Det.tipo_doc,
        Contrato_Det.dp_sic,
        Contrato_Det.doc_conciliador,
        Contrato_Det.pagina,
        Contrato_Det.modo,
        Contrato_Det.status,
        Contrato_Det.status_assinatura,
        Contrato_Det.status_arquivos,
        Contrato_Det.user_insert,
        Contrato_Det.user_update,
    ];
};
/* CRUD GET */
exports.getContrato_Det = function(id) {
    strSql = ` select   
			   contrato_det.id_empresa as  id_empresa  
			,  contrato_det.id as  id  
			,  contrato_det.id_cab as  id_cab  
			,  contrato_det.nro_linha as  nro_linha  
			,  contrato_det.id_paf as  id_paf  
			,  contrato_det.id_sim as  id_sim  
			,  contrato_det.id_email as  id_email  
			,  contrato_det.id_arker as  id_arker  
			, to_char(contrato_det.competencia, 'DD/MM/YYYY') as competencia  
			,  contrato_det.base as  base  
			,  contrato_det.cod_filial as  cod_filial  
			,  contrato_det.filial as  filial  
			,  contrato_det.cp as  cp  
			,  contrato_det.cod_empresa as  cod_empresa  
			,  contrato_det.cod_bandeiras as  cod_bandeiras  
			,  contrato_det.bandeiras as  bandeiras  
			,  contrato_det.tipo_de_pagamento as  tipo_de_pagamento  
			,  contrato_det.cod_cliente as  cod_cliente  
			,  contrato_det.cliente as  cliente  
			,  contrato_det.cnpj_cliente as  cnpj_cliente  
			,  contrato_det.investimento as  investimento  
			,  contrato_det.acao as  acao  
			,  contrato_det.proposta as  proposta  
			,  contrato_det.uf as  uf  
			,  contrato_det.tipo_de_verba as  tipo_de_verba  
			,  contrato_det.tipo_doc as  tipo_doc  
			,  contrato_det.dp_sic as  dp_sic  
			,  contrato_det.doc_conciliador as  doc_conciliador  
			,  contrato_det.pagina as  pagina  
			,  contrato_det.modo as  modo  
			,  contrato_det.status as  status  
			,  contrato_det.status_assinatura as  status_assinatura  
			,  contrato_det.status_arquivos as  status_arquivos  
			,  contrato_det.user_insert as  user_insert  
			,  contrato_det.user_update as  user_update  
			,  coalesce(paf.qtd_contratos,0) as  paf_qtd_contratos  
			,  coalesce(paf.status,'') as  paf_status  
			,  coalesce(paf.total_valor,0) as  paf_total_valor  
			,  coalesce(sim.qtd_contratos,0) as  sim_qtd_contratos  
			,  coalesce(sim.status_conciliador,'') as  sim_status_conciliador  
			,  coalesce(sim.valorsazonal,0) as  sim_valorsazonal   
            ,  coalesce(ass_paf.resposta,'')    as  ass_paf_resposta
            ,  coalesce(ass_paf.obs,'')         as  ass_paf_obs 
            ,  coalesce(ass_sim.resposta,'')    as  ass_sim_resposta
            ,  coalesce(ass_sim.obs,'')         as  ass_sim_obs 
 			FROM contratos_det contrato_det  
				  left join pafs_cab paf on paf.id_empresa = contrato_det.id_empresa and paf.id = contrato_det.id_cab
                  left join sim_historicos sim on sim.id_empresa    = contrato_det.id_empresa   and sim.id     = contrato_det.id_sim
                  left join assinaturas    ass_paf on ass_paf.id_empresa    = paf.id_empresa            and ass_paf.id_cab = paf.id
                  left join assinaturas    ass_sim on ass_sim.id_empresa    = ass_sim.id_empresa            and ass_sim.id_sim = sim.id
			 where contrato_det.id = ${id}  `;
    return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getContratos_Det = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";

        if (params.orderby == "")
            orderby = "contrato_det.id_empresa,contrato_det.competencia";
        if (params.orderby == "000001")
            orderby = "contrato_det.id_empresa,contrato_det.competencia";
        if (params.orderby == "000002")
            orderby = "contrato_det.id_empresa,contrato_det.cod_cliente";

        if (orderby != "") orderby = " order by " + orderby;
        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `contrato_det.id_empresa = ${params.id_empresa} `;
        }
        if (params.id !== 0) {
            if (where != "") where += " and ";
            where += `contrato_det.id = ${params.id} `;
        }
        if (params.competencia.trim() !== "") {
            if (where != "") where += " and ";
            where += `to_char(contrato_det.competencia, 'MM/YYYY') = '${params.competencia}' `;
        }
        if (params.cod_empresa !== 0) {
            if (where != "") where += " and ";
            where += `contrato_det.cod_empresa = ${params.cod_empresa} `;
        }
        if (params.cod_cliente.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.cod_cliente = '${params.cod_cliente}' `;
            } else {
                where += `contrato_det.cod_cliente like '%${params.cod_cliente.trim()}%' `;
            }
        }
        if (params.cliente.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.cliente = '${params.cliente}' `;
            } else {
                where += `contrato_det.cliente like '%${params.cliente.trim()}%' `;
            }
        }
        if (params.cnpj_cliente.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.cnpj_cliente = '${params.cnpj_cliente}' `;
            } else {
                where += `contrato_det.cnpj_cliente like '%${params.cnpj_cliente.trim()}%' `;
            }
        }
        if (params.doc_conciliador.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.doc_conciliador = '${params.doc_conciliador}' `;
            } else {
                where += `contrato_det.doc_conciliador like '%${params.doc_conciliador.trim()}%' `;
            }
        }
        if (params.proposta.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.proposta = '${params.proposta}' `;
            } else {
                where += `contrato_det.proposta like '%${params.proposta.trim()}%' `;
            }
        }
        if (params.acao.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.acao = '${params.acao}' `;
            } else {
                where += `contrato_det.acao like '%${params.acao.trim()}%' `;
            }
        }
        if (params.tipo_de_verba.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.tipo_de_verba = '${params.tipo_de_verba}' `;
            } else {
                where += `contrato_det.tipo_de_verba like '%${params.tipo_de_verba.trim()}%' `;
            }
        }
        if (params.tipo_de_pagamento.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.tipo_de_pagamento = '${params.tipo_de_pagamento}' `;
            } else {
                where += `contrato_det.tipo_de_pagamento like '%${params.tipo_de_pagamento.trim()}%' `;
            }
        }
        if (params.status.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.status = '${params.status}' `;
            } else {
                where += `contrato_det.status like '%${params.status.trim()}%' `;
            }
        }
        if (params.status_assinatura.trim() !== "") {
            if (where != "") where += " and ";
            if (params.assinatura == "S" || params.assinatura == "N") {
                where += `contrato_det.status_assinatura = '${params.status_assinatura}' `;
            }
            if (params.assinatura == "V") {
                where += `contrato_det.status_assinatura = 'S' || contrato_det.status_assinatura = 'N'  `;
            }
            if (params.assinatura == "X") {
                where += `contrato_det.status_assinatura = ''   `;
            }
        }
        if (params.status_arquivos.trim() !== "") {
            if (where != "") where += " and ";
            if (params.sharp) {
                where += `contrato_det.status_arquivos = '${params.status_arquivos}' `;
            } else {
                where += `contrato_det.status_arquivos like '%${params.status_arquivos.trim()}%' `;
            }
        }
        if (params.id_paf !== 0) {
            if (where != "") where += " and ";
            where += `contrato_det.id_cab = ${params.id_paf} `;
        }
        if (params.id_sim !== 0) {
            if (where != "") where += " and ";
            where += `contrato_det.id_sim = ${params.id_sim} `;
        }
        if (params.id_email !== 0) {
            if (where != "") where += " and ";
            where += `contrato_det.id_email = ${params.id_email} `;
        }
        if (params.id_arker !== 0) {
            if (where != "") where += " and ";
            where += `contrato_det.id_arker = ${params.id_arker} `;
        }
        if (where != "") where = " where " + where;
        if (params.pagina != 0) {
            paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
        }
        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM contratos_det contrato_det   
				  left join pafs_cab paf on paf.id_empresa = contrato_det.id_empresa and paf.id = contrato_det.id_cab
                  left join sim_historicos sim on sim.id_empresa    = contrato_det.id_empresa   and sim.id     = contrato_det.id_sim
                  left join assinaturas    ass_paf on ass_paf.id_empresa    = paf.id_empresa            and ass_paf.id_cab = paf.id
                  left join assinaturas    ass_sim on ass_sim.id_empresa    = ass_sim.id_empresa            and ass_sim.id_sim = sim.id
				  ${where} `;
            console.log("Contador", sqlStr);
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   contrato_det.id_empresa as  id_empresa  
			,  contrato_det.id as  id  
			,  contrato_det.id_cab as  id_cab  
			,  contrato_det.nro_linha as  nro_linha  
			,  contrato_det.id_paf as  id_paf  
			,  contrato_det.id_sim as  id_sim  
			,  contrato_det.id_email as  id_email  
			,  contrato_det.id_arker as  id_arker  
			, to_char(contrato_det.competencia, 'DD/MM/YYYY') as competencia  
			,  contrato_det.base as  base  
			,  contrato_det.cod_filial as  cod_filial  
			,  contrato_det.filial as  filial  
			,  contrato_det.cp as  cp  
			,  contrato_det.cod_empresa as  cod_empresa  
			,  contrato_det.cod_bandeiras as  cod_bandeiras  
			,  contrato_det.bandeiras as  bandeiras  
			,  contrato_det.tipo_de_pagamento as  tipo_de_pagamento  
			,  contrato_det.cod_cliente as  cod_cliente  
			,  contrato_det.cliente as  cliente  
			,  contrato_det.cnpj_cliente as  cnpj_cliente  
			,  contrato_det.investimento as  investimento  
			,  contrato_det.acao as  acao  
			,  contrato_det.proposta as  proposta  
			,  contrato_det.uf as  uf  
			,  contrato_det.tipo_de_verba as  tipo_de_verba  
			,  contrato_det.tipo_doc as  tipo_doc  
			,  contrato_det.dp_sic as  dp_sic  
			,  contrato_det.doc_conciliador as  doc_conciliador  
			,  contrato_det.pagina as  pagina  
			,  contrato_det.modo as  modo  
			,  contrato_det.status as  status  
			,  contrato_det.status_assinatura as  status_assinatura  
			,  contrato_det.status_arquivos as  status_arquivos  
			,  contrato_det.user_insert as  user_insert  
			,  contrato_det.user_update as  user_update  
			,  coalesce(paf.qtd_contratos,0) as  paf_qtd_contratos  
			,  coalesce(paf.status,'') as  paf_status  
			,  coalesce(paf.total_valor,0) as  paf_total_valor  
			,  coalesce(sim.qtd_contratos,0) as  sim_qtd_contratos  
			,  coalesce(sim.status_conciliador,'') as  sim_status_conciliador  
			,  coalesce(sim.valorsazonal,0)  as  sim_valorsazonal    
            ,  coalesce(ass_paf.resposta,'')    as  ass_paf_resposta
            ,  coalesce(ass_paf.obs,'')         as  ass_paf_obs 
            ,  coalesce(ass_sim.resposta,'')    as  ass_sim_resposta
            ,  coalesce(ass_sim.obs,'')         as  ass_sim_obs 
			FROM contratos_det contrato_det   
				  left join pafs_cab paf on paf.id_empresa = contrato_det.id_empresa and paf.id = contrato_det.id_cab
                  left join sim_historicos sim on sim.id_empresa    = contrato_det.id_empresa   and sim.id     = contrato_det.id_sim
                  left join assinaturas    ass_paf on ass_paf.id_empresa    = paf.id_empresa            and ass_paf.id_cab = paf.id
                  left join assinaturas    ass_sim on ass_sim.id_empresa    = ass_sim.id_empresa            and ass_sim.id_sim = sim.id
			${where} 			${orderby} ${paginacao} `;
            if (params.saida && params.saida == 3) 
                {
                  return strSql;
                }
            else {
                    return db.manyOrNone(strSql);
            }
        }
    }
};
/* CRUD - INSERT */
exports.insertContrato_Det = function(contrato_det) {
    strSql = `insert into contratos_det (
		     id_empresa 
		 ,   id_cab 
		 ,   nro_linha 
		 ,   id_paf 
		 ,   id_sim 
		 ,   id_email 
		 ,   id_arker 
		 ,   competencia 
		 ,   base 
		 ,   cod_filial 
		 ,   filial 
		 ,   cp 
		 ,   cod_empresa 
		 ,   cod_bandeiras 
		 ,   bandeiras 
		 ,   tipo_de_pagamento 
		 ,   cod_cliente 
		 ,   cliente 
		 ,   cnpj_cliente 
		 ,   investimento 
		 ,   acao 
		 ,   proposta 
		 ,   uf 
		 ,   tipo_de_verba 
		 ,   tipo_doc 
		 ,   dp_sic 
		 ,   doc_conciliador 
		 ,   pagina 
		 ,   modo 
		 ,   status 
		 ,   status_assinatura 
		 ,   status_arquivos 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${contrato_det.id_empresa} 
		 ,   ${contrato_det.id_cab} 
		 ,   ${contrato_det.nro_linha} 
		 ,   ${contrato_det.id_paf} 
		 ,   ${contrato_det.id_sim} 
		 ,   ${contrato_det.id_email} 
		 ,   ${contrato_det.id_arker} 
		 ,   '${contrato_det.competencia}' 
		 ,   '${contrato_det.base}' 
		 ,   ${contrato_det.cod_filial} 
		 ,   '${contrato_det.filial}' 
		 ,   '${contrato_det.cp}' 
		 ,   ${contrato_det.cod_empresa} 
		 ,   ${contrato_det.cod_bandeiras} 
		 ,   '${contrato_det.bandeiras}' 
		 ,   '${contrato_det.tipo_de_pagamento}' 
		 ,   '${contrato_det.cod_cliente}' 
		 ,   '${contrato_det.cliente}' 
		 ,   '${contrato_det.cnpj_cliente}' 
		 ,   ${contrato_det.investimento} 
		 ,   '${contrato_det.acao}' 
		 ,   '${contrato_det.proposta}' 
		 ,   '${contrato_det.uf}' 
		 ,   '${contrato_det.tipo_de_verba}' 
		 ,   '${contrato_det.tipo_doc}' 
		 ,   ${contrato_det.dp_sic} 
		 ,   '${contrato_det.doc_conciliador}' 
		 ,   '${contrato_det.pagina}' 
		 ,   '${contrato_det.modo}' 
		 ,   '${contrato_det.status}' 
		 ,   '${contrato_det.status_assinatura}' 
		 ,   '${contrato_det.status_arquivos}' 
		 ,   ${contrato_det.user_insert} 
		 ,   ${contrato_det.user_update} 
		 ) 
 returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateContrato_Det = function(contrato_det) {
    strSql = `update   contratos_det set  
		     id_empresa = ${contrato_det.id_empresa} 
 		 ,   id_cab = ${contrato_det.id_cab} 
 		 ,   nro_linha = ${contrato_det.nro_linha} 
 		 ,   id_paf = ${contrato_det.id_paf} 
 		 ,   id_sim = ${contrato_det.id_sim} 
 		 ,   id_email = ${contrato_det.id_email} 
 		 ,   id_arker = ${contrato_det.id_arker} 
 		 ,   competencia = '${contrato_det.competencia}' 
 		 ,   base = '${contrato_det.base}' 
 		 ,   cod_filial = ${contrato_det.cod_filial} 
 		 ,   filial = '${contrato_det.filial}' 
 		 ,   cp = '${contrato_det.cp}' 
 		 ,   cod_empresa = ${contrato_det.cod_empresa} 
 		 ,   cod_bandeiras = ${contrato_det.cod_bandeiras} 
 		 ,   bandeiras = '${contrato_det.bandeiras}' 
 		 ,   tipo_de_pagamento = '${contrato_det.tipo_de_pagamento}' 
 		 ,   cod_cliente = '${contrato_det.cod_cliente}' 
 		 ,   cliente = '${contrato_det.cliente}' 
 		 ,   cnpj_cliente = '${contrato_det.cnpj_cliente}' 
 		 ,   investimento = ${contrato_det.investimento} 
 		 ,   acao = '${contrato_det.acao}' 
 		 ,   proposta = '${contrato_det.proposta}' 
 		 ,   uf = '${contrato_det.uf}' 
 		 ,   tipo_de_verba = '${contrato_det.tipo_de_verba}' 
 		 ,   tipo_doc = '${contrato_det.tipo_doc}' 
 		 ,   dp_sic = ${contrato_det.dp_sic} 
 		 ,   doc_conciliador = '${contrato_det.doc_conciliador}' 
 		 ,   pagina = '${contrato_det.pagina}' 
 		 ,   modo = '${contrato_det.modo}' 
 		 ,   status = '${contrato_det.status}' 
 		 ,   status_assinatura = '${contrato_det.status_assinatura}' 
 		 ,   status_arquivos = '${contrato_det.status_arquivos}' 
 		 ,   user_insert = ${contrato_det.user_insert} 
 		 ,   user_update = ${contrato_det.user_update} 
 		 where id = ${contrato_det.id}  returning * `;
    return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deleteContrato_Det = function(id) {
    strSql = `delete from contratos_det 
		 where id = ${id}  `;
    return db.oneOrNone(strSql);
};