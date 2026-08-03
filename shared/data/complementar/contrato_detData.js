/* DATA contratos_det */
const db = require("../../shared/../infra/database");
/* CRUD GET ALL*/
exports.getContratos_Det_Paf = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "") orderby = "cab.id_empresa,cab.nome_arquivo";

    if (orderby != "") orderby = " order by " + orderby;

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `cab.id_empresa = ${params.id_empresa} `;
    }

    if (params.status_arquivos.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += ` (cab.status_arquivos = '${params.status_arquivos}') `;
      } else {
        where += ` (cab.status_arquivos like '%${params.status_arquivos.trim()}%')  `;
      }
    }

    if (params.pasta.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `trim(cab.pasta_arquivo) = '${params.pasta}' `;
      } else {
        where += `trim(cab.pasta_arquivo) like '%${params.pasta.trim()}%' `;
      }
    }

    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
    }

    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				    from  pafs_cab cab  
			      left  join docs_gdrives goo on goo.id_empresa = cab.id_empresa and goo.origem = 'PAF' and goo.id_origem = cab.id  
				  ${where} `;
      return db.one(sqlStr);
    } else {
      strSql = `
			 select   cab.nome_arquivo
                                ,cab.pasta_arquivo
                                ,'' as  competencia
                                ,'' as  filial 
                                ,0  as id
                                ,cab.id as id_cab
                                ,0      as id_paf
                                ,''     as cod_cliente
                                ,''     as cliente
                                ,0      as investimento
                                ,goo.id_file 
      from  pafs_cab cab  
			      left  join docs_gdrives goo on goo.id_empresa = cab.id_empresa and goo.origem = 'PAF' and goo.id_origem = cab.id
			${where} ${orderby} ${paginacao} `;
      console.log(strSql);
      return db.manyOrNone(strSql);
    }
  } else {
    strSql = `select   
			   contrato_det.id_empresa as  id_empresa  
			,  contrato_det.id as  id  
			,  contrato_det.id_cab as  id_cab  
			,  contrato_det.nro_linha as  nro_linha  
			,  contrato_det.id_paf as  id_paf  
			,  contrato_det.id_sim as  id_sim  
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
			,  contrato_det.tipo_codumento as  tipo_codumento  
			,  contrato_det.pagina as  pagina  
			,  contrato_det.modo as  modo  
			,  contrato_det.status as  status  
			,  contrato_det.user_insert as  user_insert  
			,  contrato_det.user_update as  user_update    
			FROM contratos_det contrato_det			     `;
    return db.manyOrNone(strSql);
  }
};

exports.getTabelasAuxiliares = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `con.id_empresa = ${params.id_empresa} `;
    }

    if (params.tabela !== "") {
      if (params.tabela == "acao") {
        orderby = "con.acao";
      }
      if (params.tabela == "tipo_de_pagamento") {
        orderby = "con.tipo_de_pagamento";
      }
      if (params.tabela == "tipo_de_verba") {
        orderby = "con.tipo_de_verba";
      }
    }
    if (orderby != "") orderby = " order by " + orderby;

    if (where != "") where = " where " + where;

    strSql = `
			select distinct con.${params.tabela} as descricao
			from contratos_det con
			${where} ${orderby}  `;
    console.log(strSql);
    return db.manyOrNone(strSql);
  }
};

exports.getResunmo01 = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";
    strSql = "";

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `con.id_empresa = ${params.id_empresa} `;
    }

    if (params.tipo == "SIM") {
      strSql = `select 'SIM' AS Tipo
                    ,'SET/19 a MAR/24' as Periodo
          --          ,det.tipo_de_verba AS TIPO_DE_VERBA
           --         ,det.tipo_de_pagamento AS TIPO_DE_PAGAMENTO
                    ,COUNT(*) AS total 
                    from contratos_det det
                    where det.tipo_de_verba like '%VERBA COMERCIAL%' and tipo_de_pagamento = 'CRÉDITO EM CONTA'
                          and not (det.cod_filial  in ('1001','1002','1003','1004'))
                          and det.competencia >= '2019-09-01'
                          and det.competencia <= '2024-03-30'
        --           GROUP BY 
        --                det.tipo_de_verba,
        --               det.tipo_de_pagamento;`;
    }

    if (params.tipo == "PAF") {
      strSql = `select 'PAF' AS Tipo
                ,'SET/19 a MAR/24' as Periodo
         --      ,det.tipo_de_verba AS TIPO_DE_VERBA
         --       ,det.tipo_de_pagamento AS TIPO_DE_PAGAMENTO
                ,COUNT(*) AS total
            from contratos_det det
            where det.tipo_de_verba like '%VERBA COMERCIAL%' and tipo_de_pagamento = 'CRÉDITO EM CONTA'
                  and (det.cod_filial  in ('1001','1002','1003','1004'))
                  and det.competencia >= '2019-09-01'
                  and det.competencia <= '2024-03-30'
         --   GROUP BY 
         --       det.tipo_de_verba,
         --       det.tipo_de_pagamento;`;
    }

    if (params.tipo == "OUTROS") {
      strSql = `SELECT 
                  'OUTROS' AS Tipo
                  ,'SET/19 a MAR/24' as Periodo
       --           ,det.tipo_de_verba AS TIPO_DE_VERBA
       --           ,det.tipo_de_pagamento AS TIPO_DE_PAGAMENTO
                  ,COUNT(*) AS total
              FROM contratos_det det
              WHERE NOT (
                      det.tipo_de_verba LIKE '%VERBA COMERCIAL%' 
                      AND det.tipo_de_pagamento = 'CRÉDITO EM CONTA'
                    )
                AND det.competencia BETWEEN '2019-09-01' AND '2024-03-30'
       --      GROUP BY 
       --           det.tipo_de_verba,
       --           det.tipo_de_pagamento;`;
    }

    if (params.tipo == "ARKER") {
      strSql = `SELECT 
            'ARKER' AS Tipo
            ,'ABR/24 a MAR/25' as Periodo
       --     ,det.tipo_de_verba AS TIPO_DE_VERBA
       --     ,det.tipo_de_pagamento AS TIPO_DE_PAGAMENTO
            ,COUNT(*) AS total
            FROM contratos_det det
            WHERE 
            --NOT (
     --           det.tipo_de_verba LIKE '%VERBA COMERCIAL%' 
     --           AND det.tipo_de_pagamento = 'CRÉDITO EM CONTA'
     ---         )
         det.competencia >=  '2024-04-01'
         -- GROUP BY 
         --   det.tipo_de_verba,
         --   det.tipo_de_pagamento;
        `;
    }

    console.log(strSql);
    return db.manyOrNone(strSql);
  }
};

exports.getContratos_Det_Paf_Assinatura = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "")
      orderby = "con.id_empresa,con.id_paf,con.id,con.competencia";

    if (orderby != "") orderby = " order by " + orderby;

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `con.id_empresa = ${params.id_empresa} `;
    }

    if (params.id_id_paf !== 0) {
      if (where != "") where += " and ";
      where += `con.id_paf = ${params.id_paf} `;
    }

    if (params.id !== 0) {
      if (where != "") where += " and ";
      where += `con.id = ${params.id} `;
    }
    if (params.ass_resposta !== "") {
      if (where != "") where += " and ";
      where += `ass_resposta = ${params.ass_resposta} `;
    }
    if (where != "") where += " and ";
    where += `con.id_paf <> 0 `;

    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
    }

    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM contratos_det con
						inner join pafs_cab     cab on cab.id_empresa = con.id_empresa and cab.id = con.id_paf
            inner join docs_gdrives goo on goo.id_empresa = con.id_empresa and goo.origem = 'PAF' and id_origem = cab.id
            left  join assinaturas  ass on ass.id_empresa = con.id_empresa and ass.id_contrato = cab.id
				  ${where} `;
      return db.one(sqlStr);
    } else {
      strSql = `
		    	select  distinct  cab.nome_arquivo
				,cab.pasta_arquivo
				,con.competencia
				,con.cod_empresa
				,con.cod_cliente
				,con.cliente
				,con.filial
				,con.id
				,con.id_paf
				,con.cod_cliente
				,con.cliente
				,con.investimento
				,con.tipo_de_verba
				,con.tipo_de_pagamento
				,goo.id as goo_id
                ,coalesce(ass.id_auditor,0) as ass_id_auditor 		
                ,coalesce(ass.resposta,'')   as ass_resposta		
                ,coalesce(ass.obs,'')        as ass_obs 			
                ,coalesce(to_char(ass.processado,'DD/MM/YYYY'),'') as ass_processado 
			from contratos_det con
			      inner join pafs_cab     cab on cab.id_empresa = con.id_empresa and cab.id = con.id_paf
            inner join docs_gdrives goo on goo.id_empresa = con.id_empresa and goo.origem = 'PAF' and id_origem = cab.id
            left  join assinaturas  ass on ass.id_empresa = con.id_empresa and ass.id_contrato = cab.id
			${where}  ${paginacao} `;
      console.log("det x assinaturas", strSql);
      return db.manyOrNone(strSql);
    }
  } else {
    strSql = `select   
			   contrato_det.id_empresa as  id_empresa  
			,  contrato_det.id as  id  
			,  contrato_det.id_cab as  id_cab  
			,  contrato_det.nro_linha as  nro_linha  
			,  contrato_det.id_paf as  id_paf  
			,  contrato_det.id_sim as  id_sim  
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
			,  contrato_det.tipo_codumento as  tipo_codumento  
			,  contrato_det.pagina as  pagina  
			,  contrato_det.modo as  modo  
			,  contrato_det.status as  status  
			,  contrato_det.user_insert as  user_insert  
			,  contrato_det.user_update as  user_update    
			FROM contratos_det contrato_det			     `;
    return db.manyOrNone(strSql);
  }
};

exports.getContratos_Det_Paf_Assinatura = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "")
      orderby = "con.id_empresa,con.id_paf,con.id,con.competencia";

    if (orderby != "") orderby = " order by " + orderby;

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `con.id_empresa = ${params.id_empresa} `;
    }

    if (params.id_id_paf !== 0) {
      if (where != "") where += " and ";
      where += `con.id_paf = ${params.id_paf} `;
    }

    if (params.id !== 0) {
      if (where != "") where += " and ";
      where += `con.id = ${params.id} `;
    }
    if (params.ass_resposta !== "") {
      if (where != "") where += " and ";
      where += `ass_resposta = ${params.ass_resposta} `;
    }
    if (where != "") where += " and ";
    where += `con.id_paf <> 0 `;

    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
    }

    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM contratos_det con
						inner join pafs_cab     cab on cab.id_empresa = con.id_empresa and cab.id = con.id_cab
            inner join docs_gdrives goo on goo.id_empresa = con.id_empresa and goo.origem = 'PAF' and id_origem = cab.id
            left  join assinaturas  ass on ass.id_empresa = con.id_empresa and ass.id_contrato = cab.id
				  ${where} `;
      return db.one(sqlStr);
    } else {
      strSql = `
		    	select  distinct  cab.nome_arquivo
				,cab.pasta_arquivo
				,con.competencia
				,con.cod_empresa
				,con.cod_cliente
				,con.cliente
				,con.filial
				,con.id
				,con.id_paf
				,con.cod_cliente
				,con.cliente
				,con.investimento
				,con.tipo_de_verba
				,con.tipo_de_pagamento
				,goo.id as goo_id
                ,coalesce(ass.id_auditor,0) as ass_id_auditor 		
                ,coalesce(ass.resposta,'')   as ass_resposta		
                ,coalesce(ass.obs,'')        as ass_obs 			
                ,coalesce(to_char(ass.processado,'DD/MM/YYYY'),'') as ass_processado 
			from contratos_det con
			      inner join pafs_cab     cab on cab.id_empresa = con.id_empresa and cab.id = con.id_cab
            inner join docs_gdrives goo on goo.id_empresa = con.id_empresa and goo.origem = 'PAF' and id_origem = cab.id
            left  join assinaturas  ass on ass.id_empresa = con.id_empresa and ass.id_contrato = cab.id
			${where}  ${paginacao} `;
      console.log("det x assinaturas", strSql);
      return db.manyOrNone(strSql);
    }
  } else {
    strSql = `select   
			   contrato_det.id_empresa as  id_empresa  
			,  contrato_det.id as  id  
			,  contrato_det.id_cab as  id_cab  
			,  contrato_det.nro_linha as  nro_linha  
			,  contrato_det.id_paf as  id_paf  
			,  contrato_det.id_sim as  id_sim  
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
			,  contrato_det.tipo_codumento as  tipo_codumento  
			,  contrato_det.pagina as  pagina  
			,  contrato_det.modo as  modo  
			,  contrato_det.status as  status  
			,  contrato_det.user_insert as  user_insert  
			,  contrato_det.user_update as  user_update    
			FROM contratos_det contrato_det			     `;
    return db.manyOrNone(strSql);
  }
};

exports.getContratos_Det_Paf_Assi_Sintetico = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "") orderby = "con.id_empresa,con.id,goo.id_paf";

    if (orderby != "") orderby = " order by " + orderby;

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `goo.id_empresa = ${params.id_empresa} `;
    }

    if (params.id !== 0) {
      if (where != "") where += " and ";
      where += `goo.id = ${params.id} `;
    }

    if (params.id_paf !== 0) {
      if (where != "") where += " and ";
      where += `goo.id_origem = ${params.id_paf} `;
    }

    if (params.tem_assinatura !== "") {
      if (where != "") where += " and ";
      if (params.tem_assinatura == "N") {
        where += `ass.id_google is null`;
      } else {
        where += `ass.id_google is not null`;
      }
    }

    if (params.obs !== "SEM FILTRO") {
      if (where != "") where += " and ";
      where += ` ass.obs = '${params.obs}'`;
    }

    if (where != "") where += " and ";
    where += ` goo.origem = 'PAF'  `;

    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
    }

    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  from  docs_gdrives goo 
            left  join assinaturas  ass on ass.id_empresa = goo.id_empresa and ass.id_google = goo.id 
				  ${where} `;
      return db.one(sqlStr);
    } else {
      strSql = `select 
		      goo.id_empresa
            ,goo.id as goo_id
            ,coalesce(ass.resposta,'N') as ass_resp
            from  docs_gdrives goo 
            left  join assinaturas  ass on ass.id_empresa = goo.id_empresa and ass.id_google = goo.id 
			${where}  ${paginacao} `;
      console.log("det x assinaturas Sint.", strSql);
      return db.manyOrNone(strSql);
    }
  }
};

exports.getContratos_Det_Assi_Sintetico = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "") orderby = "con.id_empresa,con.id,goo.id_paf";

    if (orderby != "") orderby = " order by " + orderby;

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `goo.id_empresa = ${params.id_empresa} `;
    }

    if (params.id !== 0) {
      if (where != "") where += " and ";
      where += `goo.id = ${params.id} `;
    }

    if (params.id_paf !== 0) {
      if (where != "") where += " and ";
      where += `goo.id_origem = ${params.id_paf} `;
    }

    if (where != "") where += " and ";
    where += ` goo.origem = 'PAF' `;

    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
    }

    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM  docs_gdrives goo 
            inner join pafs_cab paf_cab
                      on paf_cab.id_empresa = goo.id_empresa and paf_cab.id = goo.id_origem
            inner join paf_det paf_det 
                      on paf_det.id_empresa = paf_cab.id_empresa and paf_det.id_cab = paf_cab.id
            inner join contratos_det contra_det 
                      on contra_det.id_empresa = paf_cab.id_empresa and  ass.id_contrato = paf_cab.id 
            left  join assinaturas ass on ass.id_empresa = paf_cab.id_empresa and  ass.id_contrato = contra_det.id_cab
             left  join usuarios resp on resp.id_empresa = goo.id_empresa and resp.id = ass.id_auditor 
				  ${where} `;
      return db.one(sqlStr);
    } else {
      strSql = ` SELECT distinct 
                    paf_cab.id_empresa       as contrato_id_empresa 
                   ,paf_cab.id               as contrato_id_cab
                   ,paf_cab.qtd_contratos   as contrato_qtd_contratos
                   ,paf_cab.total_valor     as contrato_total_valor
                   ,paf_det.id              as paf_id
                   ,paf_det.acordo          as paf_acordo
                   ,paf_det.cnpj            as paf_cnpj
                   ,paf_det.data_emissao    as paf_emissao
                   ,paf_det.vencimento      as paf_vencimento
                   ,paf_det.valor_bruto     as paf_valor_bruto
                   ,paf_det.valor_deposito  as paf_valor_deposito
                   ,paf_det.acao            as paf_acao
                   ,goo.id                  as goo_id_goo
                   ,resp.razao              as resp_razao
                   ,ass.*
            FROM  docs_gdrives goo 
            inner join pafs_cab paf_cab
                      on paf_cab.id_empresa = goo.id_empresa and paf_cab.id = goo.id_origem
            inner join paf_det paf_det 
                      on paf_det.id_empresa = paf_cab.id_empresa and paf_det.id_cab = paf_cab.id 
            left  join assinaturas ass on ass.id_empresa = paf_cab.id_empresa and  ass.id_cab  = paf_cab.id
             left  join usuarios resp on resp.id_empresa = goo.id_empresa and resp.id = ass.id_auditor 
			${where}  ${paginacao} `;
      console.log("det x assinaturas Sint.", strSql);
      return db.manyOrNone(strSql);
    }
  }
};
