/* SERVICE contratos_det */
const contrato_detData = require("../../shared/../data/complementar/contrato_detData");
const validacao = require("../../shared/../util/validacao");
const parametros = require("../../shared/../util/contrato_detParametros");
const erroDB = require("../../shared/../util/userfunctiondb");
const regras = require("../../shared/../util/contrato_detRegra");
const TABELA = "CONTRATOS_DET";

/* CRUD GET ALL SERVICE */
exports.getContratos_Det_Paf = async function (params) {
  return contrato_detData.getContratos_Det_Paf(params);
};

exports.getTabelasAuxiliares = async function (params) {
  return contrato_detData.getTabelasAuxiliares(params);
};

exports.getResumo01 = async function (params) {
  return contrato_detData.getResunmo01(params);
};

exports.getContratos_Det_Paf_Assinatura = async function (params) {
  return contrato_detData.getContratos_Det_Paf_Assinatura(params);
};

exports.getContratos_Det_Paf_Assi_Sintetico = async function (params) {
  return contrato_detData.getContratos_Det_Paf_Assi_Sintetico(params);
};

exports.getContratos_Det_Assi_Sintetico = async function (params) {
  return contrato_detData.getContratos_Det_Assi_Sintetico(params);
};
