const arquivo_googleSrv = require('../service/arquivo_googleService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO arquivos_google */

exports.arquivo_google_Inclusao = async function(arquivo_google) { 
	try { 
		const obj = await arquivo_googleSrv.getArquivo_Google(arquivo_google.id_empresa,arquivo_google.id_file);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ARQUIVO_GOOGLE', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.arquivo_google_Alteracao = async function(arquivo_google) { 
	try { 
		const obj = await arquivo_googleSrv.getArquivo_Google(arquivo_google.id_empresa,arquivo_google.id_file);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ARQUIVO_GOOGLE', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.arquivo_google_Exclusao = async function(id_empresa,id_file) { 
	try { 
		const obj = await arquivo_googleSrv.getArquivo_Google(id_empresa,id_file);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ARQUIVO_GOOGLE', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

