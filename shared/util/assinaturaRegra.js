const assinaturaSrv = require("../../shared/service/assinaturaService");
const erroDB = require("../../shared/util/userfunctiondb");
const shared = require("../../shared/util/shared");
/* REGRA DE NEGOCIO assinaturas */

exports.assinatura_Inclusao = async function(assinatura) {
    console.log("regra assinatura", assinatura);
    let obj = null;
    try {
        if (assinatura.id_cab !== 0) {
            obj = await assinaturaSrv.getAssinatura(
                assinatura.id_empresa,
                assinatura.id_cab,
            );
        } else {
            obj = await assinaturaSrv.getAssinaturaSim(
                assinatura.id_empresa,
                assinatura.id_sim,
            );
        }
        if (obj != null) {
            throw new erroDB.UserException("Regra de negócio", [{
                tabela: "ASSINATURA",
                message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!`,
            }, ]);
        }
    } catch (err) {
        throw err;
    }

    return;
};

exports.assinatura_Alteracao = async function(assinatura) {
    try {
        let obj = null;

        if (assinatura.id_cab !== 0) {
            obj = await assinaturaSrv.getAssinatura(
                assinatura.id_empresa,
                assinatura.id_cab,
            );
        } else {
            obj = await assinaturaSrv.getAssinaturaSim(
                assinatura.id_empresa,
                assinatura.id_sim,
            );
        }
        if (obj == null) {
            throw new erroDB.UserException("Regra de negócio", [{
                tabela: "ASSINATURA",
                message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!`,
            }, ]);
        }
    } catch (err) {
        throw err;
    }

    return;
};

exports.assinatura_Exclusao = async function(id_empresa, id_cab) {
    try {
        const obj = await assinaturaSrv.getAssinatura(
            assinatura.id_empresa,
            assinatura.id_cab,
        );

        if (obj == null) {
            throw new erroDB.UserException("Regra de negócio", [{
                tabela: "ASSINATURA",
                message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!`,
            }, ]);
        }
    } catch (err) {
        throw err;
    }

    return;
};

exports.assinatura_ExclusaoSim = async function(id_empresa, id_sim) {
    try {
        const obj = await assinaturaSrv.getAssinaturaSim(
            assinatura.id_empresa,
            assinatura.id_sim,
        );
        if (obj == null) {
            throw new erroDB.UserException("Regra de negócio", [{
                tabela: "ASSINATURA",
                message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!`,
            }, ]);
        }
    } catch (err) {
        throw err;
    }

    return;
};