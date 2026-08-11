/* ROUTE contratos_det */
const db = require("../../../shared/infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../../../shared/middleware/autenticartoken");
const contrato_detSrv = require("../../../shared/service/complementar/contrato_detService");
const tarefaSrv = require("../../../shared/service/tarefaService");
const usuarioSrv = require("../../../shared/service/usuarioService.js")
const response = require("../../../shared/util/respostaPadrao.js");
const fs = require('fs').promises;
const path = require('path');
const funcoes = require("../../../shared/email/funcoes");
const shared = require("../../../shared/util/shared.js");
const {axiosWorker,workerURL} = require('../../../shared/infra/conexao_http');


router.use(autenticarToken);


router.post("/checkfile", async function (req, res) {

  id_empresa = req.id_empresa;
  id_usuario = req.id_usuario;

  console.log("checkfile req.body:", req.body);

  const { fileName, tentativa, maxTentativas } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: "fileName é obrigatório" });
  }

  const tarefa = await tarefaSrv.getTarefa(id_empresa, fileName);

  if (!tarefa) {
      return res.status(404).json({
      status: "failed",
      message: "Tarefa não encontrada"
    });
  }

  if (tarefa.status === '0') {
      return res.status(200).json({
      status: "pending",
      message: "Arquivo ainda não disponível"
    });
  }
  if (tarefa.status === '3') {
       return res.status(200).json({
      status: "failed",
      message: "Erro Na execução da tarefa"
    });
  } 

  if (tarefa.status === '4') {
       return res.status(200).json({
      status: "nodata",
      message: "Consulta Sem Resultados"
    });
  } 


  console.log("Tentativa:", tentativa, "Max Tentativas:", maxTentativas);

  console.log(path.join(__dirname,'..', '..', '..','shared/planilhas', fileName),"Tentativa:",tentativa);

  const caminhoArquivo = path.join(__dirname, '..', '..', '..','shared/planilhas', fileName);

   // Controle de tentativas

  if (Number(tentativa) > Number(maxTentativas)) {
      return res.status(408).json({
      status: "failed",
      message: "Limite de tentativas excedido"
    });
  }

  try {
    
    await fs.access(caminhoArquivo);

    return res.status(200).json({
      status: "ready",
      message: "Arquivo disponível"
    });

  } catch (err) {
    return res.status(200).json({
      status: "pending",
      message: "Arquivo ainda não disponível"
    });
  }
});

  
router.post("/finalizarelatorio/email", async function (req, res) {
  try {
    const dados = {
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      owner: req.body.owner,
      filename: req.body.filename
    };

    const camposObrigatorios = ["id_empresa", "id_usuario", "owner", "filename"];
    const camposAusentes = camposObrigatorios.filter(c => !dados[c]);

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    const usuario = await usuarioSrv.getUsuario(dados.id_empresa, dados.id_usuario);
    if (!usuario) {
      return response.notFound(res, "Usuário", { usuario: dados.id_usuario });
    }

    const caminhoArquivo = path.join(__dirname, '..', '..', '..','shared/planilhas', dados.filename);

    try {
      await fs.access(caminhoArquivo);

      funcoes.preparaEmailRelatorioEvento(usuario, dados.owner, caminhoArquivo)
        .then((data) => {
          return response.success(res, "E-Mail", { mensagem: data.message });
        })
        .catch((error) => {
          return response.error(res, "E-Mail", { erro: error.message });
        })
        .finally(() => {
          fs.unlink(caminhoArquivo, (erro) => {
            if (erro) console.error("Erro ao excluir arquivo:", erro);
          });
        });

    } catch (err) {
      return response.notFound(res, "Arquivo", { arquivo: dados.filename });
    }

  } catch (err) {
    console.log("erro:", err);
    res.status(500).json({ erro: 'BACK-END', tabela: 'Finalização De Relatório', message: err.message });
  }
});


router.post("/finalizarelatorio/download", async function (req, res) {
  try {
    const dados = {
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      filename: req.body.filename
    };

    const camposObrigatorios = ["id_empresa", "id_usuario", "filename"];
    const camposAusentes = camposObrigatorios.filter(c => !dados[c]);

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    const usuario = await usuarioSrv.getUsuario(dados.id_empresa, dados.id_usuario);
    if (!usuario) {
      return response.notFound(res, "Usuário", { usuario: dados.id_usuario });
    }

      const caminhoArquivo = path.join(__dirname, '..', '..', '..','shared/planilhas', dados.filename);
    try {
      await fs.access(caminhoArquivo);

     res.sendFile(caminhoArquivo);

     res.on("finish", () => {
        fs.unlink(caminhoArquivo, (err) => {
          if (err) console.error("Erro ao excluir arquivo:", err);
          else console.log("Arquivo excluído:", caminhoArquivo);
        });
      });

    } catch (err) {
      return response.notFound(res, "Arquivo", { arquivo: dados.filename });
    }

  } catch (err) {
    console.log("erro:", err);
    res.status(500).json({ erro: 'BACK-END', tabela: 'Finalização De Relatório', message: err.message });
  }
});


router.post("/cadastrartarefa", async function (req, res) {
  try {

    const dados = {
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      tarefa: req.body.tarefa,
      params: req.body.params
    };

    console.log("cadastrar tarefar:",dados); 

    const par = JSON.parse(dados.params);

    console.log("params obj :", par);

    dados.params = par; 

    const camposObrigatorios = ["id_empresa", "id_usuario", "tarefa", "params"];
    const camposAusentes = camposObrigatorios.filter(c => !dados[c]);

    if (camposAusentes.length > 0) {
       return response.validationError(res, camposAusentes);
    }

    const usuario = await usuarioSrv.getUsuario(dados.id_empresa, dados.id_usuario);

    console.log("usuario:", usuario);

    if (!usuario) {
      return response.notFound(res, "Usuário", { usuario: dados.id_usuario });
    }


   // const tarefaCadastrada = await tarefaSrv.insertTarefa(tarefa);

 	  const url = new URL("worker/relatoriocontratos", workerURL).toString();

    console.log("Chamando Worker:", url, "com dados:", dados);

   const resp_tar = await axiosWorker.post(url,{id_empresa: dados.id_empresa, id_usuario: dados.id_usuario, tarefa: dados.tarefa, params: dados.params});

   console.log("Resposta do Worker:", resp_tar.data);
    res.status(200).json({
      message: resp_tar.data.message,
      tarefa: resp_tar.data.tarefa
    });



  } catch (err) {
    console.log("erro:", err);
    res.status(500).json({ erro: 'BACK-END', tabela: 'Cadastrar Tarefa', message: err.message });
  }
});


module.exports = router;
