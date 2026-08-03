/* DATA contratos_det */
const db = require("../../shared/../infra/database");

/* CRUD GET ALL*/
exports.sim_historicos_Arquivos = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";

        try {
                if (params.orderby == "") orderby = "sim.id_empresa,codemp,sim.numpro";
                if (params.orderby == "000000")
                    orderby = "sim.id_empresa,sim.codemp,sim.numpro";
                if (params.orderby == "000001")
                    orderby = "sim.id_empresa,sim.codemp,sim.datini";
                if (params.orderby == "000002")
                    orderby = "sim.id_empresa,sim.codemp,sim.cod_cli_sim";

                if (orderby != "") orderby = " order by " + orderby;
                if (params.id_empresa !== 0) {
                    if (where != "") where += " and ";
                    where += `sim.id_empresa = ${params.id_empresa} `;
                }
                if (params.id !== 0) {
                    if (where != "") where += " and ";
                    where += `sim.id = ${params.id} `;
                }
                if (params.codemp !== 0) {
                    if (where != "") where += " and ";
                    where += `sim.codemp = ${params.codemp} `;
                }
                if (params.numpro !== 0) {
                    if (where != "") where += " and ";
                    where += `sim.numpro >= ${params.numpro} `;
                }
                if (params.cod_cli_sim.trim() !== "") {
                    if (where != "") where += " and ";
                    if (params.sharp) {
                        where += `sim.cod_cli_sim = '${params.cod_cli_sim}' `;
                    } else {
                        where += `sim.cod_cli_sim like '%${params.cod_cli_sim.trim()}%' `;
                    }
                }
                if (params.datini.trim() !== "") {
                    if (where != "") where += " and ";
                    if (params.sharp) {
                        where += `sim.datini = '${params.datini}' `;
                    } else {
                        where += `sim.datini like '%${params.datini.trim()}%' `;
                    }
                }
                if (params.id_contrato !== 0) {
                    if (where != "") where += " and ";
                    where += `sim.id_contrato = ${params.id_contrato} `;
                }

                if (params.status_arquivos.trim() !== "") {
                    if (where != "") where += " and ";
                    where += `sim.status_arquivos = '${params.status_arquivos}' `;
                }

                  if (params.cond_pagto !== -1) {
                    
                    if (where != "") where += " and ";

                    if (params.status_cond_pagto == 0) {
                        where += `sim.possuipagtoliberado = 0 `;
                    } else {
                        where += `sim.possuipagtoliberado <> 0 `;
                    }
                }
            }
        catch(erro){
            
            console.log("Erro Paramentro:",erro);
        }        
    
        if (where != "") where = " where " + where;
        if (params.pagina != 0) {
            paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
        }

        console.log("Vou chamar a api");

        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM sim_historicos sim      
                  --inner join contratos_det det on det.id_empresa = sim.id_empresa and det.id_sim = sim.id 
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = `select   
			   sim.id_empresa as  id_empresa  
			,  sim.id as  id  
			,  sim.codemp as  codemp  
			,  sim.tipopro as  tipopro  
			,  sim.numpro as  numpro  
			,  sim.codcli as  codcli  
			,  sim.id_complementar as  id_complementar  
			,  sim.mes as  mes  
			,  sim.cod_cli_sim as  cod_cli_sim  
			, to_char(sim.datini, 'DD/MM/YYYY') as datini  
			, to_char(sim.datfim, 'DD/MM/YYYY') as datfim  
			,  sim.descrinvestimento as  descrinvestimento  
			,  sim.id_passo as  id_passo  
			,  sim.vltotal as  vltotal  
			,  sim.vlbaixado as  vlbaixado  
			,  sim.vlliberado as  vlliberado  
			,  sim.vlparcela as  vlparcela  
			,  sim.vltotalinvestimento as  vltotalinvestimento  
			,  sim.vlsaldoinvestimento as  vlsaldoinvestimento  
			,  sim.id_proposta as  id_proposta  
			,  sim.acao_id as  acao_id  
			,  sim.alterado as  alterado  
			,  sim.emespera as  emespera  
			,  sim.contrato as  contrato  
			,  sim.idsituacao as  idsituacao  
			,  sim.workspaceid as  workspaceid  
			,  sim.idtiposolicitacao as  idtiposolicitacao  
			,  sim.idfluxo as  idfluxo  
			,  sim.contratoexistente as  contratoexistente  
			,  sim.id_flag as  id_flag  
			,  sim.bodyfluxopi as  bodyfluxopi  
			,  sim.cd_origem as  cd_origem  
			,  sim.proposta_origem as  proposta_origem  
			,  sim.cidemp as  cidemp  
			,  sim.nomcli as  nomcli  
			,  sim.descrpasso as  descrpasso  
			,  sim.acao_descricao as  acao_descricao  
			,  sim.status as  status  
			,  sim.possuipagtonaoliberado as  possuipagtonaoliberado  
			,  sim.possuipagtoliberado as  possuipagtoliberado  
			,  sim.modoas as  modoas  
			,  sim.msg as  msg  
			,  sim.valorsazonal as  valorsazonal  
			,  sim.id_contrato as  id_contrato  
			,  sim.status_conciliador as  status_conciliador  
			,  sim.status_arquivos as  status_arquivos  
			,  sim.user_insert as  user_insert  
			,  sim.user_update as  user_update     
			FROM sim_historicos sim      
			--inner join contratos_det det on det.id_empresa = sim.id_empresa and det.id_sim = sim.id 
			${where} 			${orderby} ${paginacao} `;
            console.log("strSql:", strSql);
            return db.manyOrNone(strSql);
        }
    } else {
        strSql = `select   
			   sim.id_empresa as  id_empresa  
			,  sim.id as  id  
			,  sim.codemp as  codemp  
			,  sim.tipopro as  tipopro  
			,  sim.numpro as  numpro  
			,  sim.codcli as  codcli  
			,  sim.id_complementar as  id_complementar  
			,  sim.mes as  mes  
			,  sim.cod_cli_sim as  cod_cli_sim  
			, to_char(sim.datini, 'DD/MM/YYYY') as datini  
			, to_char(sim.datfim, 'DD/MM/YYYY') as datfim  
			,  sim.descrinvestimento as  descrinvestimento  
			,  sim.id_passo as  id_passo  
			,  sim.vltotal as  vltotal  
			,  sim.vlbaixado as  vlbaixado  
			,  sim.vlliberado as  vlliberado  
			,  sim.vlparcela as  vlparcela  
			,  sim.vltotalinvestimento as  vltotalinvestimento  
			,  sim.vlsaldoinvestimento as  vlsaldoinvestimento  
			,  sim.id_proposta as  id_proposta  
			,  sim.acao_id as  acao_id  
			,  sim.alterado as  alterado  
			,  sim.emespera as  emespera  
			,  sim.contrato as  contrato  
			,  sim.idsituacao as  idsituacao  
			,  sim.workspaceid as  workspaceid  
			,  sim.idtiposolicitacao as  idtiposolicitacao  
			,  sim.idfluxo as  idfluxo  
			,  sim.contratoexistente as  contratoexistente  
			,  sim.id_flag as  id_flag  
			,  sim.bodyfluxopi as  bodyfluxopi  
			,  sim.cd_origem as  cd_origem  
			,  sim.proposta_origem as  proposta_origem  
			,  sim.cidemp as  cidemp  
			,  sim.nomcli as  nomcli  
			,  sim.descrpasso as  descrpasso  
			,  sim.acao_descricao as  acao_descricao  
			,  sim.status as  status  
			,  sim.possuipagtonaoliberado as  possuipagtonaoliberado  
			,  sim.possuipagtoliberado as  possuipagtoliberado  
			,  sim.modoas as  modoas  
			,  sim.msg as  msg  
			,  sim.valorsazonal as  valorsazonal  
			,  sim.id_contrato as  id_contrato  
			,  sim.status_conciliador as  status_conciliador  
			,  sim.status_arquivos as  status_arquivos  
			,  sim.user_insert as  user_insert  
			,  sim.user_update as  user_update    
			FROM sim_historicos sim			     `;
        return db.manyOrNone(strSql);
    }
};

exports.getSim_Historicos_Empresas = function() {
    where = "";
    orderby = "";
    paginacao = "";

    orderby = "order by sim.codemp";

    strSql = `select   distinct 
			  sim.codemp as  codemp       
			FROM sim_historicos sim      
			${orderby}  `;
    console.log("strSql:", strSql);
    return db.manyOrNone(strSql);
};

exports.getSim_Assi_Sintetico = function(params) {
    if (params) {
        where = "";
        orderby = "";
        paginacao = "";

        console.log("getSim_Assi_Sintetico",params)

        if (params.orderby == "") orderby = "sim.id_empresa,sim.codemp,sim.numpro";

        if (orderby != "") orderby = " order by " + orderby;

        if (params.id_empresa !== 0) {
            if (where != "") where += " and ";
            where += `sim.id_empresa = ${params.id_empresa} `;
        }

        if (params.id !== 0) {
            if (where != "") where += " and ";
            where += `sim.id = ${params.id} `;
        }

        if (params.id_sim !== 0) {
            if (where != "") where += " and ";
            where += `sim.id = ${params.id_sim} `;
        }

         if (params.codemp !== 0) {
            if (where != "") where += " and ";
            where += `sim.codemp = ${params.codemp} `;
        }

        if (params.obs !== 'SEM FILTRO') {
            if (where != "") where += " and ";
            where += `trim(ass.obs)  like '%${params.obs.trim()}%' `;
        }

        if (params.status !== 'SEM FILTRO') {
            if (where != "") where += " and ";
            if (params.status == 'X'){
                where += `ass.id_empresa is null `;
            } else {
                where += `trim(ass.resposta)  = '${params.status.trim()}' `;   
            }
        }
        if (params.cond_pagto !== -1) {
            if (params.cond_pagto == 0) {
               if (where != "") where += " and ";
                where += `sim.possuipagtoliberado = 0 `;
            }
        }
        if (where != "") where += " and ";
        where += `sim.status_arquivos = '1' `;

        if (where != "") where = " where " + where;

        if (params.pagina != 0) {
            paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
        }

        if (params.contador == "S") {
            sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				   FROM   sim_historicos sim
                   left  join assinaturas ass on ass.id_empresa = sim.id_empresa and  ass.id_sim  = sim.id
                   left  join usuarios resp on resp.id_empresa =  sim.id_empresa and resp.id = ass.id_auditor
				  ${where} `;
            return db.one(sqlStr);
        } else {
            strSql = ` SELECT distinct 
                    sim.id_empresa              as sim_id_empresa 
                   ,sim.id                      as sim_id
                   ,sim.qtd_contratos           as sim_qtd_contratos
                   ,sim.nomcli                  as sim_nomcli
                   ,sim.valorsazonal            as sim_valor_sazonal
                   ,to_char(sim.datini,'MM/YY') AS sim_data 
                   ,sim.numpro                  as sim_proposta
                   ,sim.codemp                  as sim_codemp
                   ,coalesce(resp.razao,'')     as resp_razao
                   ,ass.*
                   FROM   sim_historicos sim
                   left  join assinaturas ass on ass.id_empresa = sim.id_empresa and  ass.id_sim  = sim.id
                   left  join usuarios resp on resp.id_empresa =  sim.id_empresa and resp.id = ass.id_auditor
			${where} ${orderby}  ${paginacao} `;
            console.log("sim x assinaturas Sint.", strSql);
            return db.manyOrNone(strSql);
        }
    }
};