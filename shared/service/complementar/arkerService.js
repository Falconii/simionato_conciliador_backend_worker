/* SERVICE arker */
const arkerData = require('../../shared/../data/complementar/arkerData');
const TABELA = 'ARKER';

exports.getResumoStatusArker = async function(params){
	return arkerData.getResumoStatusArker(params);
};

exports.getResumoFrmPagto = async function(params){
	return arkerData.getResumoFrmPagto(params);
};