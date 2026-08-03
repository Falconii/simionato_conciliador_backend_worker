/* SERVICE layouts_relatorios */
const layout_relatorioData = require('../data/layout_relatorioData');
const validacao = require('../util/validacao');
const parametros = require('../util/layout_relatorioParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/layout_relatorioRegra');
const TABELA = 'LAYOUTS_RELATORIOS';
/* CRUD GET SERVICE */
exports.getLayout_Relatorio = async function(id_empresa,layout){
	return layout_relatorioData.getLayout_Relatorio(id_empresa,layout);
};
/* CRUD GET ALL SERVICE */
exports.getLayouts_Relatorios = async function(params){
	return layout_relatorioData.getLayouts_Relatorios(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertLayout_Relatorio = async function(layout_relatorio){
try 
{
	await regras.layout_relatorio_Inclusao(layout_relatorio);
	validacao.Validacao(TABELA,layout_relatorio, parametros.layouts_relatorios());
	return layout_relatorioData.insertLayout_Relatorio(layout_relatorio);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateLayout_Relatorio = async function(layout_relatorio){try 
{
	await regras.layout_relatorio_Alteracao(layout_relatorio);
	validacao.Validacao(TABELA,layout_relatorio, parametros.layouts_relatorios());
	return layout_relatorioData.updateLayout_Relatorio(layout_relatorio);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteLayout_Relatorio = async function(id_empresa,layout){try 
{
	await  regras.layout_relatorio_Exclusao(id_empresa,layout);
	return layout_relatorioData.deleteLayout_Relatorio(id_empresa,layout);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
