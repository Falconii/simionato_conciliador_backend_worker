/* ROUTE assinaturas */
const db = require("../../shared/infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../../shared/middleware/autenticartoken");
const assinaturaSrv = require("../../shared/service/assinaturaService");
router.use(autenticarToken);
/* ROTA GETONE assinatura */
router.get("/:id_empresa/:id_cab", async function(req, res) {
    try {
        const lsLista = await assinaturaSrv.getAssinatura(
            req.params.id_empresa,
            req.params.id_cab,
        );
        if (lsLista == null) {
            res.status(409).json({ message: "Assinatura Não Encontrada." });
        } else {
            res.status(200).json(lsLista);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "assinatura", message: err.message });
        }
    }
});

router.get("assinaturasim/:id_empresa/:id_sim", async function(req, res) {
    try {
        const lsLista = await assinaturaSrv.getAssinatura(
            req.params.id_empresa,
            req.params.id_sim,
        );
        if (lsLista == null) {
            res.status(409).json({ message: "Assinatura Não Encontrada." });
        } else {
            res.status(200).json(lsLista);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "assinatura", message: err.message });
        }
    }
});
/* ROTA GETALL assinatura */
router.get("/", async function(req, res) {
    try {
        const lsLista = await assinaturaSrv.getAssinaturas();
        if (lsLista.length == 0) {
            res
                .status(409)
                .json({ message: "Nehuma Informação Para Esta Consulta." });
        } else {
            res.status(200).json(lsLista);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "assinatura", message: err.message });
        }
    }
});
/* ROTA INSERT assinatura */
router.post("/", async function(req, res) {
    try {
        const assinatura = req.body;
        const registro = await assinaturaSrv.insertAssinatura(assinatura);
        if (registro == null) {
            res.status(409).json({ message: "Assinatura Cadastrado!" });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "Assinatura", message: err.message });
        }
    }
});
/* ROTA UPDATE assinatura */
router.put("/", async function(req, res) {
    try {
        const assinatura = req.body;
        const registro = await assinaturaSrv.updateAssinatura(assinatura);
        if (registro == null) {
            res.status(409).json({ message: "Assinatura Alterado Com Sucesso!" });
        } else {
            res.status(200).json(registro);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "Assinatura", message: err.message });
        }
    }
});
/* ROTA DELETE assinatura */
router.delete("assinaturasim/:id_empresa/:id_cab", async function(req, res) {
    try {
        await assinaturaSrv.deleteAssinaturaSim(
            req.params.id_empresa,
            req.params.id_sim,
        );
        res.status(200).json({ message: "Assinatura Excluído Com Sucesso!" });
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "Assinatura", message: err.message });
        }
    }
});
/* ROTA CONSULTA POST assinaturas */
router.post("/assinaturas", async function(req, res) {
    /*
	{
		"id_empresa":0, 
		"id_cab":0, 
		"id_sim":0, 
		"id_email":0, 
		"id_auditor":0, 
		"id_google":0 
	}
*/
    try {
        const params = req.body;
        console.log("Parametros Consulta Assinatura:", params);
        const lsRegistros = await assinaturaSrv.getAssinaturas(params);
        if (lsRegistros.length == 0) {
            res
                .status(409)
                .json({ message: "Assinatura Nenhum Registro Encontrado!" });
        } else {
            res.status(200).json(lsRegistros);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "Assinatura", message: err.message });
        }
    }
});

module.exports = router;