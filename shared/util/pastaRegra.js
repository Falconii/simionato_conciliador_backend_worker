const pastaSrv = require('../service/pastaService');
const erroDB = require('../util/userfunctiondb');
/* REGRA DE NEGOCIO pastas */

exports.pasta_Inclusao = async function(pasta) { 
	try { 
		const obj = await pastaSrv.getPasta(pasta.id_empresa,pasta.id,pasta.sigla);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PASTA', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.pasta_Alteracao = async function(pasta) { 
	try { 
		const obj = await pastaSrv.getPasta(pasta.id_empresa,pasta.id,pasta.sigla);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PASTA', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.pasta_Exclusao = async function(id_empresa,id,sigla) { 
	try { 
		const obj = await pastaSrv.getPasta(id_empresa,id,sigla);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PASTA', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

