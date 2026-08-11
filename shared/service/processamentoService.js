/* SERVICE processamento do work */
const db = require("../../shared/infra/database");
const shared = require("../../shared/util/shared.js");
const { AsyncTask, SimpleIntervalJob, ToadScheduler } = require('toad-scheduler');
const scheduler = new ToadScheduler();
const contrato_detSrv = require('../../shared/service/contrato_detService');
const usuarioSrv = require('../../shared/service/usuarioService');
const { gerarExcelGenerico } = require('../../shared/excel/excelgenarator');
const path = require('path');
const crypto = require('crypto');
const funcoes = require("../email/funcoes.js");



const configParams = {
  "sheetName": "Relatório",
  "freezeHeader": true,
  "autoFilter": true,
  "columns": [
    {
      "header": "id_empresa",
      "key": "id_empresa",
      "width": 12,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id",
      "key": "id",
      "width": 6,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_cab",
      "key": "id_cab",
      "width": 8,
      "align": "right",
      "format": "0"
    },
    {
      "header": "nro_linha",
      "key": "nro_linha",
      "width": 11,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_paf",
      "key": "id_paf",
      "width": 8,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_sim",
      "key": "id_sim",
      "width": 8,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_email",
      "key": "id_email",
      "width": 10,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_arker",
      "key": "id_arker",
      "width": 10,
      "align": "right",
      "format": "0"
    },
    {
      "header": "competencia",
      "key": "competencia",
      "width": 13,
      "align": "left",
      "format": null
    },
    {
      "header": "base",
      "key": "base",
      "width": 9,
      "align": "left",
      "format": null
    },
    {
      "header": "cod_filial",
      "key": "cod_filial",
      "width": 12,
      "align": "right",
      "format": "0"
    },
    {
      "header": "filial",
      "key": "filial",
      "width": 23,
      "align": "left",
      "format": null
    },
    {
      "header": "cp",
      "key": "cp",
      "width": 6,
      "align": "left",
      "format": null
    },
    {
      "header": "cod_empresa",
      "key": "cod_empresa",
      "width": 13,
      "align": "right",
      "format": "0"
    },
    {
      "header": "cod_bandeiras",
      "key": "cod_bandeiras",
      "width": 15,
      "align": "right",
      "format": "0"
    },
    {
      "header": "bandeiras",
      "key": "bandeiras",
      "width": 43,
      "align": "left",
      "format": null
    },
    {
      "header": "tipo_de_pagamento",
      "key": "tipo_de_pagamento",
      "width": 19,
      "align": "left",
      "format": null
    },
    {
      "header": "cod_cliente",
      "key": "cod_cliente",
      "width": 13,
      "align": "left",
      "format": null
    },
    {
      "header": "cliente",
      "key": "cliente",
      "width": 53,
      "align": "left",
      "format": null
    },
    {
      "header": "cnpj_cliente",
      "key": "cnpj_cliente",
      "width": 16,
      "align": "left",
      "format": null
    },
    {
      "header": "investimento",
      "key": "investimento",
      "width": 14,
      "align": "right",
      "format": "#,##0.00;#,##0.00;0"
    },
    {
      "header": "acao",
      "key": "acao",
      "width": 21,
      "align": "left",
      "format": null
    },
    {
      "header": "proposta",
      "key": "proposta",
      "width": 10,
      "align": "left",
      "format": null
    },
    {
      "header": "uf",
      "key": "uf",
      "width": 4,
      "align": "left",
      "format": null
    },
    {
      "header": "tipo_de_verba",
      "key": "tipo_de_verba",
      "width": 17,
      "align": "left",
      "format": null
    },
    {
      "header": "tipo_doc",
      "key": "tipo_doc",
      "width": 10,
      "align": "left",
      "format": null
    },
    {
      "header": "dp_sic",
      "key": "dp_sic",
      "width": 8,
      "align": "right",
      "format": "0"
    },
    {
      "header": "doc_conciliador",
      "key": "doc_conciliador",
      "width": 17,
      "align": "left",
      "format": null
    },
    {
      "header": "pagina",
      "key": "pagina",
      "width": 8,
      "align": "left",
      "format": null
    },
    {
      "header": "modo",
      "key": "modo",
      "width": 6,
      "align": "left",
      "format": null
    },
    {
      "header": "status",
      "key": "status",
      "width": 8,
      "align": "left",
      "format": null
    },
    {
      "header": "status_assinatura",
      "key": "status_assinatura",
      "width": 19,
      "align": "left",
      "format": null
    },
    {
      "header": "status_arquivos",
      "key": "status_arquivos",
      "width": 17,
      "align": "left",
      "format": null
    },
    {
      "header": "user_insert",
      "key": "user_insert",
      "width": 13,
      "align": "right",
      "format": "0"
    },
    {
      "header": "user_update",
      "key": "user_update",
      "width": 13,
      "align": "right",
      "format": "0"
    },
    {
      "header": "paf_qtd_contratos",
      "key": "paf_qtd_contratos",
      "width": 19,
      "align": "right",
      "format": "0"
    },
    {
      "header": "paf_status",
      "key": "paf_status",
      "width": 12,
      "align": "left",
      "format": null
    },
    {
      "header": "paf_total_valor",
      "key": "paf_total_valor",
      "width": 17,
      "align": "right",
      "format": "#,##0.00;#,##0.00;0"
    },
    {
      "header": "sim_qtd_contratos",
      "key": "sim_qtd_contratos",
      "width": 19,
      "align": "right",
      "format": "0"
    },
    {
      "header": "sim_status_conciliador",
      "key": "sim_status_conciliador",
      "width": 24,
      "align": "left",
      "format": null
    },
    {
      "header": "sim_valorsazonal",
      "key": "sim_valorsazonal",
      "width": 18,
      "align": "right",
      "format": "#,##0.00;#,##0.00;0"
    },
    {
      "header": "ass_paf_resposta",
      "key": "ass_paf_resposta",
      "width": 18,
      "align": "left",
      "format": null
    },
    {
      "header": "ass_paf_obs",
      "key": "ass_paf_obs",
      "width": 13,
      "align": "left",
      "format": null
    },
    {
      "header": "ass_sim_resposta",
      "key": "ass_sim_resposta",
      "width": 18,
      "align": "left",
      "format": null
    },
    {
      "header": "ass_sim_obs",
      "key": "ass_sim_obs",
      "width": 13,
      "align": "left",
      "format": null
    }
  ]
}



/* CRUD GET SERVICE */
//02
async function processarTarefas() {
  
  
  const hoje = shared.dataHoraSaoPaulo();

  try {
    await db.tx(async t => {

      const tarefas = await t.any(`
        SELECT *
        FROM tarefas
        WHERE status = '0'
        ORDER BY id ASC
        LIMIT 10
        FOR UPDATE SKIP LOCKED
      `);

      if (tarefas.length === 0) {
       // console.log("Nenhuma tarefa pendente");
        return;
      }

      for (const tarefa of tarefas) {
        try {

          console.log("Processando tarefa:", tarefa.id);

          const resultado = await gerarRelatorioContratos(
            tarefa.parametros,
            tarefa.id_empresa,
            tarefa.id_usuario,
            tarefa.name_file
          );

          await t.none(`
            UPDATE tarefas
            SET status = '${resultado.status}',
                data_conclusao = '${hoje}'
            WHERE id_empresa = $1 AND id = $2
          `, [tarefa.id_empresa, tarefa.id]);

        } catch (err) {
          console.log("Erro ao gerar relatório:", err);

          // IMPORTANTE: lançar erro para abortar a transação
          throw err;
        }
      }
    });

  } catch (err) {
    console.log("Transação abortada, atualizando status da tarefa...");

    // Atualiza status FORA da transação
    await db.none(`
      UPDATE tarefas
      SET status = '3',
          data_conclusao = '${hoje}'
      WHERE id_empresa = $1 AND id = $2
    `, [tarefa.id_empresa, tarefa.id]);

  }
}

//01
exports.startProcessamentoTarefas = function (intervaloSegundos = 5) {

  const caminhoArquivo = path.join(APP_ROOT, "..","shared","planilhas");

  console.log("shared ==> ",caminhoArquivo);

  const task = new AsyncTask(
    'Processamento de Tarefas',
    async () => {
      try {
        //console.log("chamando processarTarefas()...");
        await processarTarefas();   // sua função que usa SELECT FOR UPDATE SKIP LOCKED
      } catch (err) {
        console.log('Erro no processamento:', err);
      }
    },
    (error) => {
      console.log('Erro no job:', error);
    }
  );

  const job = new SimpleIntervalJob(
    { seconds: intervaloSegundos, runImmediately: true },
    task,
    {
      id: 'job_processar_tarefas',
      preventOverrun: true,
    }
  );

  scheduler.addSimpleIntervalJob(job);

  //console.log(`Job de processamento iniciado (intervalo: ${intervaloSegundos}s)`);
};

//03
async function gerarRelatorioContratos(parametros, id_empresa, id_usuario, name_file) {
  try {


    let params = {}
    
    console.log("Gerando relatório de contratos para empresa:",parametros);

    

    try {
          params = JSON.parse(parametros.trim().replace(/^"|"$/g, ""));
          
          console.log("woker params ==> ", params);
          console.log("worker params.competencia ==> ", params.competencia);
    } catch (err) {
        console.error("Erro ao analisar parâmetros JSON:", err);
        return {
            status: 3,
            message: "Erro ao analisar parâmetros JSON"
        };
    }

    const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);

    let lsRegistros = [];

    try 
    {
      paramsAjustado = {
        id_empresa:Number(params.id_empresa),
          id:Number(params.id),
          competencia:params.competencia,
          cod_empresa:Number(params.cod_empresa),
          cod_cliente:params.cod_cliente,
          cliente:params.cliente,
          cnpj_cliente:params.cnpj_cliente,
          doc_conciliador:params.doc_conciliador,
          proposta:params.proposta,
          acao:params.acao,
          tipo_de_verba:params.tipo_de_verba,
          tipo_de_pagamento:params.tipo_de_pagamento,
          status:params.status,
          status_assinatura:params.status_assinatura,
          status_arquivos:params.status_arquivos,
          id_paf:Number(params.id_paf),
          id_sim:Number(params.id_sim),
          id_email:Number( params.id_email),
          id_arker:Number(params.id_arker),
          pagina:Number(params.pagina),
          saida:Number(params.saida),
          tamPagina:Number(params.tamPagina),
          contador: 'N' ,
          orderby: params.orderby,  
          sharp:boolean = params.sharp
      }
      console.log("Params", params);
      console.log("---------------------------------------------");
      console.log("paramsAjustado ==> ", paramsAjustado);
      lsRegistros = await contrato_detSrv.getContratos_Det(paramsAjustado);
    }
    catch (err) {
      console.error("Erro ao buscar registros:", err);
        return {
          status: 2,
          tipo: "json",
          conteudo: lsRegistros
       };
      
    }

    console.log("Registros encontrados:", lsRegistros.length);

    if (lsRegistros.length === 0) {
      return { status: 4, message: "Nenhum registro encontrado" };
    }

    // saída 3 = apenas SQL
    if (params.saida === 3) {
      return {
        status: 2,
        tipo: "sql",
        conteudo: lsRegistros.replace(/[\n\t]/g, '')
      };
    }

    // saída 1 ou 2 = gerar arquivo
    if (params.saida === 1 || params.saida === 2) {

      const caminhoArquivo = await exceltoemailordownload(
        lsRegistros,
        configParams,
        name_file
      );

     return {
        status: 2,
        tipo: "arquivo",
        arquivo: caminhoArquivo,
        nome: name_file
      };
    }

    // saída padrão = JSON
    return {
      status: 2,
      tipo: "json",
      conteudo: lsRegistros
    };

  } catch (err) {
    console.error("Erro ao gerar relatório de contratos:", err);
    return {
      status: 3,
      message: err.message
    };
  }
}

async function gerarRelatorioSIMs(parametros, id_empresa, id_usuario, name_file) {
  try {


    let params = {}
    
    console.log("Gerando relatório de contratos para empresa:",parametros);

    try {
          params = JSON.parse(parametros);
    } catch (err) {
        console.error("Erro ao analisar parâmetros JSON:", err);
        return {
            status: 3,
            message: "Erro ao analisar parâmetros JSON"
        };
    }

    const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);

    let lsRegistros = [];

    try 
    {
      lsRegistros = await contrato_detSrv.getContratos_Det(params);
    }
    catch (err) {
      console.error("Erro ao buscar registros:", err);
        return {
          status: 2,
          tipo: "json",
          conteudo: lsRegistros
       };
      
    }

    console.log("Registros encontrados:", lsRegistros.length);

    if (lsRegistros.length === 0) {
      return { status: 3, message: "Nenhum registro encontrado" };
    }

    // saída 3 = apenas SQL
    if (params.saida === 3) {
      return {
        status: 2,
        tipo: "sql",
        conteudo: lsRegistros.replace(/[\n\t]/g, '')
      };
    }

    // saída 1 ou 2 = gerar arquivo
    if (params.saida === 1 || params.saida === 2) {

      const caminhoArquivo = await exceltoemailordownload(
        lsRegistros,
        configParams,
        name_file
      );

      if (params.saida === 1 ){
         await funcoes.enviarEmailRelatorioEvento(usuario,"CONTRATOS",caminhoArquivo);
      }

      return {
        status: 2,
        tipo: "arquivo",
        arquivo: caminhoArquivo,
        nome: name_file
      };
    }

    // saída padrão = JSON
    return {
      status: 2,
      tipo: "json",
      conteudo: lsRegistros
    };

  } catch (err) {
    console.error("Erro ao gerar relatório de contratos:", err);
    return {
      status: 3,
      message: err.message
    };
  }
}







async function exceltoemailordownload(rows, config, name_file) {
  try {

    console.log("Gerando arquivo Excel:", name_file);

    const caminhoArquivo = path.join(APP_ROOT, "..","shared","planilhas",name_file);

    console.log("shared ==> ",caminhoArquivo);

    console.log("Gerando arquivo Excel:", caminhoArquivo);

    await gerarExcelGenerico(rows, config , caminhoArquivo);

    return caminhoArquivo;

  } catch (err) {
       console.log("Erro exceltoemailordownload:",err);
      throw err;
  }
};
