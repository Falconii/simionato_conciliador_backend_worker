/* DATA sim_acordos */
const db = require('../infra/database');
const shared = require('../util/shared');

/* GET CAMPOS */
exports.getCampos = function(Sim_Acordo){
return [ 
			Sim_Acordo.id_empresa, 
			Sim_Acordo.id, 
			Sim_Acordo.id_sim, 
			Sim_Acordo.acordo, 
			Sim_Acordo.data_1, 
			Sim_Acordo.data_2, 
			Sim_Acordo.vlr_acordo_pdf, 
			Sim_Acordo.user_insert, 
			Sim_Acordo.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getSim_Acordo = function(id_empresa,id_sim,acordo){
	strSql = ` select   
			   sim_acordo.id_empresa as  id_empresa  
			,  sim_acordo.id as  id  
			,  sim_acordo.id_sim as  id_sim  
			,  sim_acordo.acordo as  acordo,  case 
			      when sim_acordo.data_1 is null then ''
			      else                to_char(sim_acordo.data_1, 'DD/MM/YYYY') 
			   end  as data_1    
			,  case 
			      when sim_acordo.data_2 is null then ''
			      else                to_char(sim_acordo.data_2, 'DD/MM/YYYY') 
			   end  as data_2 
			,  sim_acordo.vlr_acordo_pdf as vlr_acordo_pdf   
			,  sim_acordo.user_insert as  user_insert  
			,  sim_acordo.user_update as  user_update    
 			FROM sim_acordos sim_acordo 	     
			 where sim_acordo.id_empresa = ${id_empresa} and  sim_acordo.id_sim = ${id_sim} and  sim_acordo.acordo = '${acordo}'  `;
	console.log('getSim_Acordo strSql =>', strSql);		 
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getSim_Acordos = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'sim_acordo.id_empresa,sim_acordo.id_sim,sim_acordo.acordo';
	if(params.orderby == '000001') orderby = 'sim_acordo.id_empresa,sim_acordo.id_sim,sim_acordo.acordo';

	if (orderby != "") orderby = " order by " + orderby;

	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `sim_acordo.id_empresa = '${params.id_empresa}' `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `sim_acordo.id = ${params.id} `;
	}
	if(params.id_sim  !== 0 ) {
		if (where != "") where += " and "; 
		where += `sim_acordo.id_sim = ${params.id_sim} `;
	}
	if(params.acordo.trim()  !== '' ) {
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `sim_acordo.acordo = '${params.acordo}' `;
		} else 
		{
			where += `sim_acordo.acordo like '%${params.acordo.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM sim_acordos sim_acordo      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   sim_acordo.id_empresa as  id_empresa  
			,  sim_acordo.id as  id  
			,  sim_acordo.id_sim as  id_sim  
			,  sim_acordo.acordo as  acordo ,  case 
			      when sim_acordo.data_1 is null then ''
			      else                to_char(sim_acordo.data_1, 'DD/MM/YYYY') 
			   end  as data_1    
			,  case 
			      when sim_acordo.data_2 is null then ''
			      else                to_char(sim_acordo.data_2, 'DD/MM/YYYY') 
			   end  as data_2 
			,  sim_acordo.vlr_acordo_pdf as vlr_acordo_pdf   
			,  sim_acordo.user_insert as  user_insert  
			,  sim_acordo.user_update as  user_update     
			FROM sim_acordos sim_acordo      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   sim_acordo.id_empresa as  id_empresa  
			,  sim_acordo.id as  id  
			,  sim_acordo.id_sim as  id_sim  
			,  sim_acordo.acordo as  acordo  
			,  case 
			      when sim_acordo.data_1 is null then ''
			      else                to_char(sim_acordo.data_1, 'DD/MM/YYYY') 
			   end  as data_1    
			,  case 
			      when sim_acordo.data_2 is null then ''
			      else                to_char(sim_acordo.data_2, 'DD/MM/YYYY') 
			   end  as data_2 
			,  sim_acordo.user_insert as  user_insert  
			,  sim_acordo.user_update as  user_update    
			FROM sim_acordos sim_acordo			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertSim_Acordo = function(sim_acordo){

    const data1Value = sim_acordo.data_1
        ? `'${shared.formatDateYYYYMMDD(sim_acordo.data_1)}'`
        : "null";

    const data2Value = sim_acordo.data_2
        ? `'${shared.formatDateYYYYMMDD(sim_acordo.data_2)}'`
        : "null";

    const strSql = `
        insert into sim_acordos (
              id_empresa
            , id_sim
            , acordo
            , data_1
            , data_2
			, vlr_acordo_pdf
            , user_insert
            , user_update
        )
        values (
              ${sim_acordo.id_empresa}
            , ${sim_acordo.id_sim}
            , '${sim_acordo.acordo}'
            , ${data1Value}
            , ${data2Value}
			, ${sim_acordo.vlr_acordo_pdf}
            , ${sim_acordo.user_insert}
            , ${sim_acordo.user_update}
        )
        returning *;
    `;

    console.log('insertSim_Acordo strSql =>', strSql);
    return db.oneOrNone(strSql);
};

/* CRUD - UPDATE */
 exports.updateSim_Acordo = function(sim_acordo) {
	const data1Value = sim_acordo.data_1
    ? `'${shared.formatDateYYYYMMDD(sim_acordo.data_1)}'`
    : "null";

	const data2Value = sim_acordo.data_2
		? `'${shared.formatDateYYYYMMDD(sim_acordo.data_2)}'`
		: "null";

	const strSql = `
    update sim_acordos set  
          id = ${sim_acordo.id}
        , data_1 = ${data1Value}
        , data_2 = ${data2Value}
		, vlr_acordo_pdf = ${sim_acordo.vlr_acordo_pdf}
        , user_insert = ${sim_acordo.user_insert}
        , user_update = ${sim_acordo.user_update}
    where id_empresa  = ${sim_acordo.id_empresa}
      and id_sim = ${sim_acordo.id_sim}
      and acordo = '${sim_acordo.acordo}'
    returning *;
`;

    console.log('updateSim_Acordo strSql =>', strSql);
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteSim_Acordo = function(id_empresa,id_sim,acordo){
	strSql = `delete from sim_acordos 
		 where id_empresa = ${id_empresa} and  id_sim = ${id_sim} and  acordo = '${acordo}'  `;
 	return  db.oneOrNone(strSql);
}


