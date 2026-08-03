/* SERVICE assinaturas */
const assinaturaData = require("../../shared/../data/complementar/assinaturaData");
const validacao = require("../../shared/../util/validacao");
const parametros = require("../../shared/../util/assinaturaParametros");
const erroDB = require("../../shared/../util/userfunctiondb");
const regras = require("../../shared/../util/assinaturaRegra");
const TABELA = "ASSINATURAS";
/* CRUD GET SERVICE */
exports.getResumoObs = async function (params) {
  return assinaturaData.getResumoObs(params);
};
