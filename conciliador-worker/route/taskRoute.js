/* ROUTE credenciais */
const express = require("express");
const router = express.Router();
const erroDB = require("../../shared/util/userfunctiondb");
const task = require("../task/send-email");
const usuarioSrv=require("../../shared/service/usuarioService.js");
const tarefaSrv = require("../../shared/service/tarefaService");
const fs = require("fs");
const response = require("../../shared/util/respostaPadrao");
const shared = require("../../shared/util/shared.js");
const crypto = require("crypto");


/* Enviar Email */
router.post("/enviar_email", async function (req, res) {
  try {
    console.log("Recebido pedido para enviar email.");

    res.status(200).json({
      message: "Worker Send Email Task Iniciado com Sucesso!",
    });

    // roda a task sem bloquear a resposta
    task.sendEmailTask().catch((err) => {
      console.error("Erro na task:", err);
    });
  } catch (err) {
    res.status(500).json({ erro: "BAK-END", message: err.message });
  }
});

router.post("/relatoriocontratos", async function (req, res) {
 /*  {
    "id_empresa" : 1,
    "id_usuario" : 16,
    "tarefa" : "RELATORIO_CONTRATOS",
    "params"     : params
  } */
  try {
    const dados = {
        id_empresa: req.body.id_empresa,
        id_usuario: req.body.id_usuario,
        tarefa: req.body.tarefa,
        params: req.body.params
      };

    console.log("worker - relatoriocontratos:", dados);     
      
    const camposObrigatorios = ["id_empresa", "id_usuario", "tarefa", "params"];
    const camposAusentes = camposObrigatorios.filter(c => !dados[c]);

    if (camposAusentes.length > 0) {
        return response.validationError(res, camposAusentes);
    }

   try {
    const usuario = await usuarioSrv.getUsuario(dados.id_empresa, dados.id_usuario);
    if (!usuario) {
      return response.notFound(res, "Usuário", { usuario: dados.id_usuario });
    }
    
  } catch (err) {
    console.log("Erro ao buscar usuário:", err);
  }
  

    const hoje = shared.dataHoraSaoPaulo();

    const uuid = crypto.randomUUID();

    const name_file = `${dados.tarefa}_${uuid}.xlsx`;

    let tarefa = {
          "id_empresa": dados.id_empresa,
          "id": 0,
          "id_usuario": dados.id_usuario,
          "id_file": "",
          "folder_id": "",
          "name_file": name_file,
          "sigla": dados.tarefa,
          "data_solicitacao": hoje,
          "data_conclusao": "",
          "parametros": JSON.stringify(dados.params),
          "status": "0",
          "user_insert": dados.id_usuario,
          "user_update": 0
    };

    console.log("Indo cadastrar tarefa", tarefa)
    
    const tarefaCadastrada = await tarefaSrv.getTarefa(dados.id_empresa, tarefa.name_file);

    if (tarefaCadastrada) {
      return  res.status(200).json({
      message: "Tarefa Já Esta Cadastrada!",
      tarefa: tarefaCadastrada
    });
    } else {
      tarefa = await tarefaSrv.insertTarefa(tarefa);
    }

    console.log("Tarefa cadastrada:", tarefa);
    
    res.status(200).json({
      message: "Tarefa Cadastrada com Sucesso!",
      tarefa: tarefa
    });

    // roda a task sem bloquear a resposta
    /* task.sendEmailTask().catch((err) => {
      console.error("Erro na task:", err);
    }); */
  } catch (err) {
    res.status(500).json({ erro: "BAK-END", message: err.message });
  }
});

module.exports = router;
