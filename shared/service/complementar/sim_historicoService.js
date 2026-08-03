/* SERVICE contratos_det */
const sim_historicosData = require("../../shared/../data/complementar/sim_historicoData");
const validacao = require("../../shared/../util/validacao");
const parametros = require("../../shared/../util/contrato_detParametros");
const erroDB = require("../../shared/../util/userfunctiondb");
const regras = require("../../shared/../util/contrato_detRegra");
const TABELA = "SIM_HISTORICOS";

/* CRUD GET ALL SERVICE */
exports.getSim_Historicos_Empresas = async function () {
  return sim_historicosData.getSim_Historicos_Empresas();
};

exports.getSim_Assi_Sintetico = async function (params) {
  return sim_historicosData.getSim_Assi_Sintetico(params);
};
