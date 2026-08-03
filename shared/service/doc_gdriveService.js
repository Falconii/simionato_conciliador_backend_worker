/* SERVICE docs_gdrives */
const doc_gdriveData = require('../data/doc_gdriveData');
const validacao = require('../util/validacao');
const parametros = require('../util/doc_gdriveParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/doc_gdriveRegra');
const TABELA = 'DOCS_GDRIVES';
/* CRUD GET SERVICE */
exports.getDoc_Gdrive = async function(id_empresa,id){
	return doc_gdriveData.getDoc_Gdrive(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getDocs_Gdrives = async function(params){
	return doc_gdriveData.getDocs_Gdrives(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertDoc_Gdrive = async function(doc_gdrive){
try 
{
	await regras.doc_gdrive_Inclusao(doc_gdrive);
	validacao.Validacao(TABELA,doc_gdrive, parametros.docs_gdrives());
	return doc_gdriveData.insertDoc_Gdrive(doc_gdrive);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateDoc_Gdrive = async function(doc_gdrive){try 
{
	await regras.doc_gdrive_Alteracao(doc_gdrive);
	validacao.Validacao(TABELA,doc_gdrive, parametros.docs_gdrives());
	return doc_gdriveData.updateDoc_Gdrive(doc_gdrive);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteDoc_Gdrive = async function(id_empresa,id){try 
{
	await  regras.doc_gdrive_Exclusao(id_empresa,id);
	return doc_gdriveData.deleteDoc_Gdrive(id_empresa,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
