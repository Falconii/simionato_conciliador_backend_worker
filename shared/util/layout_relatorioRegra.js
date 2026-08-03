const layout_relatorioSrv = require('../service/layout_relatorioService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO layouts_relatorios */

exports.layout_relatorio_Inclusao = async function(layout_relatorio) { 
	try { 
		const obj = await layout_relatorioSrv.getLayout_Relatorio(layout_relatorio.id_empresa,layout_relatorio.layout);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LAYOUT_RELATORIO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.layout_relatorio_Alteracao = async function(layout_relatorio) { 
	try { 
		const obj = await layout_relatorioSrv.getLayout_Relatorio(layout_relatorio.id_empresa,layout_relatorio.layout);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LAYOUT_RELATORIO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.layout_relatorio_Exclusao = async function(id_empresa,layout) { 
	try { 
		const obj = await layout_relatorioSrv.getLayout_Relatorio(id_empresa,layout);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LAYOUT_RELATORIO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

