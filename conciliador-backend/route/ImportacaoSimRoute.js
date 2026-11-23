/* ROUTE participantes */
const db = require("../../shared/infra/database.js");
const importacaoSimSrv = require("../../shared/service/importacaosim.service.js");
const sim_funcoes = require("../../shared/util/sim_funcoes.js");
const uploadPlanilha = require("../../shared/uploadConfig/uploadPlanilha.js");
const uploadArquivoSim = require("../../shared/uploadConfig/uploadArquivoSim.js");
const dbController = require("../../shared/controllers/doccontroller");
const doc_gdriveSrv = require("../../shared/service/doc_gdriveService.js");
const simHistoSrv = require("../../shared/service/sim_historicoService.js");
const acaoCorrecaoSrv = require("../../shared/service/acaoCorrecaoService.js");
const funcoes = require("../../shared/email/funcoes.js");
const express = require("express");
const router = express.Router();
const shared = require("../../shared/util/shared.js");
const response = require("../../shared/util/respostaPadrao");
const fs = require("fs");
const path = require("path");
const { autenticarToken } = require("../../shared/middleware/autenticartoken.js");

router.use(autenticarToken);

router.post(
  "/load_sim",
  uploadPlanilha.single("file"),
  async function (req, res) {
    try {
      // Validação
      const dados = {
        id_empresa: req.id_empresa,
        id_usuario: req.id_usuario,
      };

      const camposObrigatorios = ["id_empresa", "id_usuario"];

      const camposAusentes = camposObrigatorios.filter(
        (campo) => !dados[campo],
      );

      if (camposAusentes.length > 0) {
        return response.validationError(res, camposAusentes);
      }

      const retorno = await importacaoSimSrv.inclusao(req, res);

      res.status(200).json(retorno);
    } catch (err) {
      console.log(err);

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

router.post(
  "/load_file_sim",
  uploadArquivoSim.array("files", 60),
  async function (req, res) {
    const files = req.files;
    try {
      // Validação
      const dados = {
        id_empresa: req.id_empresa,
        id_usuario: req.id_usuario,
        id_histo: req.body.id_histo,
        files: req.files,
      };

      //console.log(req);

      const camposObrigatorios = [
        "id_empresa",
        "id_usuario",
        "files",
        "id_histo",
      ];

      const camposAusentes = camposObrigatorios.filter(
        (campo) => !dados[campo],
      );

      if (camposAusentes.length > 0) {
        return response.validationError(res, camposAusentes);
      }

      const id_empresa = req.id_empresa;
      const id_usuario = req.id_usuario;
      const id_histo = req.body.id_histo;

      /* id_acao (opcional): ação de Upload De Arquivos pendente da correção deste SIM. Só o executor da ação
         pode fazer o upload; ao final do envio a ação é concluída */
      const id_acao = Number(req.body.id_acao) || 0;
      if (id_acao > 0) {
        const acao = await acaoCorrecaoSrv.getAcaoCorrecao(id_empresa, id_acao);
        if (
          !acao ||
          acao.flag_acao !== "1" ||
          acao.status !== "1" ||
          acao.cab_origem !== "SIM" ||
          Number(acao.cab_id_origem) !== Number(id_histo)
        ) {
          return res.status(409).json({
            message: "Ação De Upload Não Está Pendente Para Este SIM.",
          });
        }
        if (Number(acao.id_exec) !== Number(id_usuario)) {
          return res.status(403).json({
            message: `Somente O Executor Da Ação (${acao.exec_nome}) Pode Fazer O Upload.`,
          });
        }
      }
      let acaoExecutada = false;
      let acoesPendentes = -1; // ações que restam na correção depois da execução (-1 = sem ação informada)
      let statusCab = ""; // situação da correção depois da execução
      let idCabVerificacao = 0; // correção que passou para Aguardando Verificação: o solicitante é avisado por e-mail

      let g_doc = "";

      for (const file of files) {
        try {
          const originalName = shared.fixFileNameEncoding(file.originalname);

          const par = {
            id_empresa: id_empresa,
            id: 0,
            id_folder: "",
            id_file: "",
            file_name: "",
            origem: "SIM",
            file_name_original: shared.caractersbarra(originalName),
            status_upload: "",
            id_origem: 0,
            pagina: 0,
            tamPagina: 50,
            contador: "N",
            orderby: "",
            sharp: false,
          };

          g_doc = await doc_gdriveSrv.getDocs_Gdrives(par);

          console.log("g_doc da pesquisa", g_doc, g_doc.length);

          if (g_doc.length > 0) {
            if (g_doc[0].status_upload !== "0" && g_doc[0].status_upload !== "2") {
              res.status(200).json({
                message: `Arquivo Já Existe Na Base De Dados. ${par.file_name_original}`,
              });
              return;
            } else {
              g_doc = g_doc[0];
              g_doc.status_upload = "0";
            }
          } else {
            const g_docModel = {
              id_empresa: id_empresa,
              id: 0,
              id_folder: "",
              id_file: "",
              file_name: `${id_empresa.toString().padStart(2, "0")}_${id_histo
                .toString()
                .padStart(6, "0")}_${originalName}`,
              id_origem: id_histo,
              origem: "SIM",
              file_name_original: originalName,
              status_upload: "0",
              user_insert: id_usuario,
              user_update: 0,
            };

            g_doc = await doc_gdriveSrv.insertDoc_Gdrive(g_docModel);

            console.log("g_doc", g_doc);
          }

          const resposta = await dbController.processaUploadDocumentos(
            file,
            2,
            "SIM_DOC",
            `${id_empresa.toString().padStart(2, "0")}_${id_histo
              .toString()
              .padStart(6, "0")}_${originalName}`,
          );
          if (resposta.message !== null){
             messageGoogle = resposta.message;
          }
          if (resposta.data !== null) {
            g_doc.id_folder = resposta.data.id_folder;
            g_doc.id_file = resposta.data.id;
            g_doc.status_upload = "1";
            g_doc = await doc_gdriveSrv.updateDoc_Gdrive(g_doc);
            if (id_acao > 0 && !acaoExecutada) {
              const concluida = await acaoCorrecaoSrv.executarAcaoCorrecao(
                id_empresa, id_acao, g_doc.id, id_usuario,
              );
              acaoExecutada = !!concluida;
              if (concluida) {
                acoesPendentes = concluida.acoes_pendentes;
                statusCab = concluida.status_cab;
                if (concluida.aguardando_verificacao) idCabVerificacao = concluida.id_cab_correcoes;
              }
            }
          }

          console.log("Retorno do Google", resposta);
        } catch (err) {
          messageGoogle = "Deu Erro Na Gravação do Google"; 
          console.log("Deu Erro Na Gravação do Google", err);
          g_doc.status_upload = "2";
          g_doc = await doc_gdriveSrv.updateDoc_Gdrive(g_doc);
        }
      }
      res.status(200).json({ message: "Fim Do Processamento!", messageGoogle:messageGoogle, acao_executada: acaoExecutada, acoes_pendentes: acoesPendentes, status_cab: statusCab });

      // sem prender a resposta: erro no envio só vai para o log
      if (idCabVerificacao > 0) {
        funcoes.PreparaEmailVerificacaoCorrecao(id_empresa, idCabVerificacao)
          .then((envio) => console.log("E-mail verificação da correção:", envio.message))
          .catch((err) => console.error("Erro no e-mail de verificação da correção:", err));
      }
    } catch (err) {
      console.log(err);
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res.status(500).json({
          erro: "BAK-END",
          tabela: "Importacao",
          message: err.message,
        });
      }
    } finally {
      if (Array.isArray(files)) {
        for (const file of files) {
          if (!file.path) {
            console.warn("Arquivo sem path, nada para remover:", file);
            continue;
          }

          try {
            await fs.promises.unlink(file.path);
            console.log("Arquivo removido:", file.path);
          } catch (err) {
            console.error("Erro ao remover:", file.path, err);
          }
        }
      }
    }
  },
);

router.post("/sim_historicos_Arquivos", async function (req, res) {
  console.log("rota sim_historicos_Arquivos");
  /*
  {
    "id_empresa":0, 
    "id":0, 
    "codemp":0, 
    "numpro":0, 
    "cod_cli_sim":"", 
    "datini":"", 
    "id_contrato":0, 
    "status_arquivos":""
    "pagina":0, 
    "tamPagina":50, 
    "contador":"N", 
    "orderby":"", 
    "sharp":false 
  }
*/
  try {
    const params = req.body;
    const lsRegistros = await importacaoSimSrv.sim_historicos_Arquivos(params);
    if (lsRegistros.length == 0) {
      res
        .status(409)
        .json({ message: "Sim_Historico Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "Sim_Historico",
        message: err.message,
      });
    }
  }
});
module.exports = router;
