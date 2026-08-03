/* DATA sim_historicos */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Sim_Historico){
return [ 
			Sim_Historico.id_empresa, 
			Sim_Historico.id, 
			Sim_Historico.codemp, 
			Sim_Historico.tipopro, 
			Sim_Historico.numpro, 
			Sim_Historico.codcli, 
			Sim_Historico.id_complementar, 
			Sim_Historico.mes, 
			Sim_Historico.cod_cli_sim, 
			Sim_Historico.datini, 
			Sim_Historico.datfim, 
			Sim_Historico.descrinvestimento, 
			Sim_Historico.id_passo, 
			Sim_Historico.vltotal, 
			Sim_Historico.vlbaixado, 
			Sim_Historico.vlliberado, 
			Sim_Historico.vlparcela, 
			Sim_Historico.vltotalinvestimento, 
			Sim_Historico.vlsaldoinvestimento, 
			Sim_Historico.id_proposta, 
			Sim_Historico.acao_id, 
			Sim_Historico.alterado, 
			Sim_Historico.emespera, 
			Sim_Historico.contrato, 
			Sim_Historico.idsituacao, 
			Sim_Historico.workspaceid, 
			Sim_Historico.idtiposolicitacao, 
			Sim_Historico.idfluxo, 
			Sim_Historico.contratoexistente, 
			Sim_Historico.id_flag, 
			Sim_Historico.bodyfluxopi, 
			Sim_Historico.cd_origem, 
			Sim_Historico.proposta_origem, 
			Sim_Historico.cidemp, 
			Sim_Historico.nomcli, 
			Sim_Historico.descrpasso, 
			Sim_Historico.acao_descricao, 
			Sim_Historico.status, 
			Sim_Historico.possuipagtonaoliberado, 
			Sim_Historico.possuipagtoliberado, 
			Sim_Historico.modoas, 
			Sim_Historico.msg, 
			Sim_Historico.valorsazonal, 
			Sim_Historico.id_contrato, 
			Sim_Historico.status_conciliador, 
			Sim_Historico.qtd_contratos, 
			Sim_Historico.status_assinatura, 
			Sim_Historico.status_arquivos, 
			Sim_Historico.vlr_acordos_pdf,
            Sim_Historico.qtd_acordos_pdf,
			Sim_Historico.user_insert, 
			Sim_Historico.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getSim_Historico = function(id_empresa,id){
	strSql = ` select   
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
			,  sim.qtd_contratos as  qtd_contratos  
			,  sim.status_assinatura as  status_assinatura  
			,  sim.status_arquivos as  status_arquivos
			,  sim.vlr_acordos_pdf as vlr_acordos_pdf
			,  sim.qtd_acordos_pdf as qtd_acordos_pdf			
			,  sim.user_insert as  user_insert  
			,  sim.user_update as  user_update 
            ,  coalesce(ass.resposta,'')    as ass_resposta
            ,  coalesce(ass.obs,'')            as ass_obs
			,  coalesce(ass.upload_cliente,'')      as ass_upload_cliente
 			FROM sim_historicos sim 	     
			left join assinaturas ass on ass.id_empresa = sim.id_empresa and ass.id_sim = sim.id
			 where sim.id_empresa = ${id_empresa} and  sim.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getSim_Historicos = function(params){
console.log("getSim_Historicos",params);	
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	try
		{
				if(params.orderby == '') orderby = 'sim.id_empresa,sim.id';
				if(params.orderby == '000000') orderby = 'sim.id_empresa,sim.codemp,sim.cod_cli_sim';
				if(params.orderby == '000001') orderby = 'sim.id_empresa,sim.codemp,sim.datini';
				if(params.orderby == '000002') orderby = 'sim.id_empresa,sim.codemp,sim.cod_cli_sim';

				if (orderby != "") orderby = " order by " + orderby;
				if(params.id_empresa  !== 0 ){
					if (where != "") where += " and "; 
					where += `sim.id_empresa = ${params.id_empresa} `;
				}
				if(params.id  !== 0 ){
					if (where != "") where += " and "; 
					where += `sim.id = ${params.id} `;
				}
				if(params.codemp  !== 0){
					if (where != "") where += " and "; 
					where += `sim.codemp = ${params.codemp} `;
				}
				if(params.numpro  !== 0){
					if (where != "") where += " and "; 
					where += `sim.numpro = ${params.numpro} `;
				}
				if(params.cod_cli_sim.trim()  !== ''){
					if (where != "") where += " and ";
					if (params.sharp) { 
						where +=  `sim.cod_cli_sim = '${params.cod_cli_sim}' `;
					} else 
					{
						where += `sim.cod_cli_sim like '%${params.cod_cli_sim.trim()}%' `;
					}
				}
				if(params.datini.trim()  !== ''){
					if (where != "") where += " and ";
					where +=  `sim.datini = '${params.datini}' `;
				}
				if(params.id_contrato  !== 0 ){
					if (where != "") where += " and "; 
					where += `sim.id_contrato = ${params.id_contrato} `;
				}
				if(params.status_arquivos.trim()  !== '' ){
					if (where != "") where += " and ";
					if (params.sharp) { 
						where +=  `sim.status_arquivos = '${params.status_arquivos}' `;
					} else 
					{
						where += `sim.status_arquivos like '%${params.status_arquivos.trim()}%' `;
					}
				}
				if(params.status_assinatura.trim()  !== 'F' ){
					if (where != "") where += " and ";
					if (params.status_assinatura == 'X'){
						where += `ass.id_empresa is null `;
					} else {
						where += `trim(ass.resposta)  = '${params.status_assinatura.trim()}' `;   
					}
				}
				if (params.obs_assinatura !== 'SEM FILTRO') {
					if (where != "") where += " and ";
					where += `trim(ass.obs)  like '%${params.obs_assinatura.trim()}%' `;
				}

				if(params.cond_pagto  !== -1 ){
					if (params.cond_pagto  == 0) {
						if (where != "") where += " and ";
						where +=  `sim.possuipagtoliberado = 0 `;
					} 
				}

				if (params.upload_cliente !== '') {
					if (where != "") where += " and ";
					where += `trim(ass.upload_cliente)  = '${params.upload_cliente.trim()}' `;
				}

				if (where != "") where = " where " + where;
				if (params.pagina != 0) {
					paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
				}
        } catch(err){
	      console.log("Erro No Parametros",err);
		  throw new error(err)
    }
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM sim_historicos sim      
				  left join assinaturas ass on ass.id_empresa = sim.id_empresa and ass.id_sim = sim.id
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
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
			,  to_char(sim.datini, 'DD/MM/YYYY') as datini  
			,  to_char(sim.datfim, 'DD/MM/YYYY') as datfim  
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
			,  sim.qtd_contratos as  qtd_contratos  
			,  sim.status_assinatura as  status_assinatura  
			,  sim.status_arquivos as  status_arquivos
			,  sim.vlr_acordos_pdf as vlr_acordos_pdf
			,  sim.qtd_acordos_pdf as qtd_acordos_pdf  
			,  sim.user_insert as  user_insert  
			,  sim.user_update as  user_update
            ,  coalesce(ass.resposta,'')    as ass_resposta
            ,  coalesce(ass.obs,'')            as ass_obs
			,  coalesce(ass.upload_cliente,'')      as ass_upload_cliente
			FROM sim_historicos sim      
            left join assinaturas ass on ass.id_empresa = sim.id_empresa and ass.id_sim = sim.id
			${where} 			${ orderby} ${ paginacao} `;
			console.log("getSim_Historicos - Contador",strSql);
			return  db.manyOrNone(strSql);
		}	}  else {
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
			,  sim.qtd_contratos as  qtd_contratos  
			,  sim.status_assinatura as  status_assinatura  
			,  sim.status_arquivos as  status_arquivos
			,  sim.vlr_acordos_pdf as vlr_acordos_pdf
			,  sim.qtd_acordos_pdf as qtd_acordos_pdf  
			,  sim.user_insert as  user_insert  
			,  sim.user_update as  user_update    
			FROM sim_historicos sim			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertSim_Historico = function(sim_historico){
	strSql = `insert into sim_historicos (
		     id_empresa 
		 ,   codemp 
		 ,   tipopro 
		 ,   numpro 
		 ,   codcli 
		 ,   id_complementar 
		 ,   mes 
		 ,   cod_cli_sim 
		 ,   datini 
		 ,   datfim 
		 ,   descrinvestimento 
		 ,   id_passo 
		 ,   vltotal 
		 ,   vlbaixado 
		 ,   vlliberado 
		 ,   vlparcela 
		 ,   vltotalinvestimento 
		 ,   vlsaldoinvestimento 
		 ,   id_proposta 
		 ,   acao_id 
		 ,   alterado 
		 ,   emespera 
		 ,   contrato 
		 ,   idsituacao 
		 ,   workspaceid 
		 ,   idtiposolicitacao 
		 ,   idfluxo 
		 ,   contratoexistente 
		 ,   id_flag 
		 ,   bodyfluxopi 
		 ,   cd_origem 
		 ,   proposta_origem 
		 ,   cidemp 
		 ,   nomcli 
		 ,   descrpasso 
		 ,   acao_descricao 
		 ,   status 
		 ,   possuipagtonaoliberado 
		 ,   possuipagtoliberado 
		 ,   modoas 
		 ,   msg 
		 ,   valorsazonal 
		 ,   id_contrato 
		 ,   status_conciliador 
		 ,   qtd_contratos 
		 ,   status_assinatura 
		 ,   status_arquivos 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${sim_historico.id_empresa} 
		 ,   ${sim_historico.codemp} 
		 ,   '${sim_historico.tipopro}' 
		 ,   ${sim_historico.numpro} 
		 ,   '${sim_historico.codcli}' 
		 ,   ${sim_historico.id_complementar} 
		 ,   ${sim_historico.mes} 
		 ,   '${sim_historico.cod_cli_sim}' 
		 ,   '${sim_historico.datini}' 
		 ,   '${sim_historico.datfim}' 
		 ,   '${sim_historico.descrinvestimento}' 
		 ,   ${sim_historico.id_passo} 
		 ,   ${sim_historico.vltotal} 
		 ,   ${sim_historico.vlbaixado} 
		 ,   ${sim_historico.vlliberado} 
		 ,   ${sim_historico.vlparcela} 
		 ,   ${sim_historico.vltotalinvestimento} 
		 ,   ${sim_historico.vlsaldoinvestimento} 
		 ,   ${sim_historico.id_proposta} 
		 ,   ${sim_historico.acao_id} 
		 ,   ${sim_historico.alterado} 
		 ,   ${sim_historico.emespera} 
		 ,   '${sim_historico.contrato}' 
		 ,   ${sim_historico.idsituacao} 
		 ,   ${sim_historico.workspaceid} 
		 ,   ${sim_historico.idtiposolicitacao} 
		 ,   ${sim_historico.idfluxo} 
		 ,   ${sim_historico.contratoexistente} 
		 ,   ${sim_historico.id_flag} 
		 ,   ${sim_historico.bodyfluxopi} 
		 ,   '${sim_historico.cd_origem}' 
		 ,   ${sim_historico.proposta_origem} 
		 ,   '${sim_historico.cidemp}' 
		 ,   '${sim_historico.nomcli}' 
		 ,   '${sim_historico.descrpasso}' 
		 ,   '${sim_historico.acao_descricao}' 
		 ,   ${sim_historico.status} 
		 ,   ${sim_historico.possuipagtonaoliberado} 
		 ,   ${sim_historico.possuipagtoliberado} 
		 ,   '${sim_historico.modoas}' 
		 ,   '${sim_historico.msg}' 
		 ,   ${sim_historico.valorsazonal} 
		 ,   ${sim_historico.id_contrato} 
		 ,   '${sim_historico.status_conciliador}' 
		 ,   ${sim_historico.qtd_contratos} 
		 ,   '${sim_historico.status_assinatura}' 
		 ,   '${sim_historico.status_arquivos}' 
		 ,   ${sim_historico.user_insert} 
		 ,   ${sim_historico.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateSim_Historico = function(sim_historico){
	strSql = `update   sim_historicos set  
		     codemp = ${sim_historico.codemp} 
 		 ,   tipopro = '${sim_historico.tipopro}' 
 		 ,   numpro = ${sim_historico.numpro} 
 		 ,   codcli = '${sim_historico.codcli}' 
 		 ,   id_complementar = ${sim_historico.id_complementar} 
 		 ,   mes = ${sim_historico.mes} 
 		 ,   cod_cli_sim = '${sim_historico.cod_cli_sim}' 
 		 ,   datini = '${sim_historico.datini}' 
 		 ,   datfim = '${sim_historico.datfim}' 
 		 ,   descrinvestimento = '${sim_historico.descrinvestimento}' 
 		 ,   id_passo = ${sim_historico.id_passo} 
 		 ,   vltotal = ${sim_historico.vltotal} 
 		 ,   vlbaixado = ${sim_historico.vlbaixado} 
 		 ,   vlliberado = ${sim_historico.vlliberado} 
 		 ,   vlparcela = ${sim_historico.vlparcela} 
 		 ,   vltotalinvestimento = ${sim_historico.vltotalinvestimento} 
 		 ,   vlsaldoinvestimento = ${sim_historico.vlsaldoinvestimento} 
 		 ,   id_proposta = ${sim_historico.id_proposta} 
 		 ,   acao_id = ${sim_historico.acao_id} 
 		 ,   alterado = ${sim_historico.alterado} 
 		 ,   emespera = ${sim_historico.emespera} 
 		 ,   contrato = '${sim_historico.contrato}' 
 		 ,   idsituacao = ${sim_historico.idsituacao} 
 		 ,   workspaceid = ${sim_historico.workspaceid} 
 		 ,   idtiposolicitacao = ${sim_historico.idtiposolicitacao} 
 		 ,   idfluxo = ${sim_historico.idfluxo} 
 		 ,   contratoexistente = ${sim_historico.contratoexistente} 
 		 ,   id_flag = ${sim_historico.id_flag} 
 		 ,   bodyfluxopi = ${sim_historico.bodyfluxopi} 
 		 ,   cd_origem = '${sim_historico.cd_origem}' 
 		 ,   proposta_origem = ${sim_historico.proposta_origem} 
 		 ,   cidemp = '${sim_historico.cidemp}' 
 		 ,   nomcli = '${sim_historico.nomcli}' 
 		 ,   descrpasso = '${sim_historico.descrpasso}' 
 		 ,   acao_descricao = '${sim_historico.acao_descricao}' 
 		 ,   status = ${sim_historico.status} 
 		 ,   possuipagtonaoliberado = ${sim_historico.possuipagtonaoliberado} 
 		 ,   possuipagtoliberado = ${sim_historico.possuipagtoliberado} 
 		 ,   modoas = '${sim_historico.modoas}' 
 		 ,   msg = '${sim_historico.msg}' 
 		 ,   valorsazonal = ${sim_historico.valorsazonal} 
 		 ,   id_contrato = ${sim_historico.id_contrato} 
 		 ,   status_conciliador = '${sim_historico.status_conciliador}' 
 		 ,   qtd_contratos = ${sim_historico.qtd_contratos} 
 		 ,   status_assinatura = '${sim_historico.status_assinatura}' 
 		 ,   status_arquivos = '${sim_historico.status_arquivos}' 
 		 ,   user_insert = ${sim_historico.user_insert} 
 		 ,   user_update = ${sim_historico.user_update} 
 		 where id_empresa = ${sim_historico.id_empresa} and  id = ${sim_historico.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteSim_Historico = function(id_empresa,id){
	strSql = `delete from sim_historicos 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


