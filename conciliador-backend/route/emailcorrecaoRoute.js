/* ROUTE pafs_cab */
const db = require('../../shared/infra/database.js');
const express = require('express');
const router = express.Router(); 
const response = require("../../shared/util/respostaPadrao.js");
const { autenticarToken} = require('../../shared/middleware/autenticartoken.js');
const usuarioSrv = require('../../shared/service/usuarioService.js');
const cabCorrecao = require('../../shared/service/cabCorrecaoService.js');
const detCorrecao = require('../../shared/service/detCorrecaoService.js');
const funcoes = require('../../shared/email/funcoes.js')
router.use(autenticarToken); 

/* ROTA INSERT paf_cab */
router.post("/aceiteCabCorrecao",async function(req, res) {
/*
    {
        "id_solicitante":0, 
        "id_cab_correcao:0,
    }
*/

        try {
            // Validação
            const dados = {
                id_empresa: req.id_empresa,
                id_usuario: req.id_usuario,
                id_solicitante: req.body.id_solicitante,
                id_cab_correcao: req.body.id_cab_correcao
            };


            const camposObrigatorios = [
                "id_empresa",
                "id_usuario",
                "id_solicitante",
                "id_cab_correcao",
            ];

            const camposAusentes = camposObrigatorios.filter(
                (campo) => !dados[campo],
            );

            if (camposAusentes.length > 0) {
                return response.validationError(res, camposAusentes);
            }

            const id_empresa      = req.id_empresa;
            const id_usuario      = req.id_usuario;
            const id_solicitante  = req.body.id_solicitante;
            const id_cab_correcao = req.body.id_cab_correcao;

            /* validar usuario */
            const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);

            if (!usuario) {
                return response.notFound(res, "USUARIO", { id_usuario });
            }

            /* validar cab-correcao */
            const cab = await cabCorrecao.getCabCorrecao(id_empresa, id_cab_correcao);

            if (!cab) {
                return response.notFound(res, "CAB_CORRECAO", { id_cab_correcao });
            }

            /* buscar as mensagens no det-correcao, da mais antiga para a mais nova */
            const detalhes = await detCorrecao.getDetCorrecoes({
                id_empresa: id_empresa,
                id_cab: id_cab_correcao,
                orderby: "000002",
            });

            /* espera o envio para devolver ao front se o e-mail saiu ou não.
               o usuário não é devolvido para não expor o hash da senha */
            const envio = await funcoes.enviarEmailAceiteCorrecao(usuario, cab, detalhes);

            return response.success(res, envio.message, {
                cabCorrecao: cab,
                detalhes: detalhes,
            });

        } catch (err) {
            if (err.name == "MyExceptionDB") {
                res.status(409).json(err);
            } else {
                res.status(500).json({
                    erro: "BAK-END",
                    tabela: "Importacao",
                    message: err.message,
                });
            }
        } 
    },
);
module.exports = router;
