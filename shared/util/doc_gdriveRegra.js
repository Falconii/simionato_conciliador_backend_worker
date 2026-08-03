const doc_gdriveSrv = require('../service/doc_gdriveService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO docs_gdrives */

exports.doc_gdrive_Inclusao = async function(doc_gdrive) { 
	try { 
		const obj = await doc_gdriveSrv.getDoc_Gdrive(doc_gdrive.id_empresa,doc_gdrive.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DOC_GDRIVE', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.doc_gdrive_Alteracao = async function(doc_gdrive) { 
	try { 
		const obj = await doc_gdriveSrv.getDoc_Gdrive(doc_gdrive.id_empresa,doc_gdrive.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DOC_GDRIVE', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.doc_gdrive_Exclusao = async function(id_empresa,id) { 
	try { 
		const obj = await doc_gdriveSrv.getDoc_Gdrive(id_empresa,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DOC_GDRIVE', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

