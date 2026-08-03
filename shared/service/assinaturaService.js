/* SERVICE assinaturas */
const assinaturaData = require("../../shared/data/assinaturaData");
const validacao = require("../../shared/util/validacao");
const parametros = require("../../shared/util/assinaturaParametros");
const erroDB = require("../../shared/util/userfunctiondb");
const regras = require("../../shared/util/assinaturaRegra");
const TABELA = "ASSINATURAS";
/* CRUD GET SERVICE */
exports.getAssinatura = async function(id_empresa, id_cab) {
    return assinaturaData.getAssinatura(id_empresa, id_cab);
};

exports.getAssinaturaSim = async function(id_empresa, id_sim) {
    return assinaturaData.getAssinaturaSim(id_empresa, id_sim);
};
/* CRUD GET ALL SERVICE */
exports.getAssinaturas = async function(params) {
    return assinaturaData.getAssinaturas(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertAssinatura = async function(assinatura) {
    try {
        await regras.assinatura_Inclusao(assinatura);
        validacao.Validacao(TABELA, assinatura, parametros.assinaturas());
        return assinaturaData.insertAssinatura(assinatura);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - UPDATE - SERVICE */
exports.updateAssinatura = async function(assinatura) {
    try {
        await regras.assinatura_Alteracao(assinatura);
        validacao.Validacao(TABELA, assinatura, parametros.assinaturas());
        return assinaturaData.updateAssinatura(assinatura);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};
//* CRUD - UPDATE - SERVICE */
exports.updateAssinaturaSim = async function(assinatura) {
    try {
        await regras.assinatura_Alteracao(assinatura);
        validacao.Validacao(TABELA, assinatura, parametros.assinaturas());
        return assinaturaData.updateAssinaturaSim(assinatura);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};

//* CRUD - DELETE - SERVICE */
exports.deleteAssinatura = async function(id_empresa, id_cab) {
    try {
        await regras.assinatura_Exclusao(id_empresa, id_cab);
        return assinaturaData.deleteAssinatura(id_empresa, id_cab);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};

exports.deleteAssinaturaSim = async function(id_empresa, id_sim) {
    try {
        await regras.assinatura_ExclusaoSim(id_empresa, sim);
        return assinaturaData.deleteAssinaturaSim(id_empresa, id_sim);
    } catch (err) {
        throw new erroDB.UserException(err.erro, err);
    }
};