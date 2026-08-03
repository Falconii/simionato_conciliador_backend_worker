const { shared } = require("../../shared/util/shared.js");
const sim_historicoSrv = require("../../shared/service/sim_historicoService.js");
const sim_historicoData = require("../../shared/data/complementar/sim_historicoData.js");
const {
  field_data,
  field_number,
  field_text,
  field_bool,
  data_ref,
  codigo_sim,
} = require("../../shared/util/sim_funcoes.js");
const parse = require("../../shared/util/ParseCSV.js");
const fs = require("fs");
const readline = require("readline");
let id_empresa = 0;
let id_usuario = 0;

exports.inclusao = async (req, res) => {
  id_empresa = req.id_empresa;
  id_usuario = req.id_usuario;

  let dtRef = "";
  let total = 0;
  let nro_linha = 0;
  let campos = "";

  const file = req.file;

  var dadosPlanilha = readline.createInterface({
    input: fs.createReadStream(file.path),
  });
  try {
    for await (let linha of dadosPlanilha) {
      if (nro_linha == 0) {
        nro_linha++;
        continue;
      }

      nro_linha++;

      try {
        campos = parse.ParseCVS("", linha, ";");
      } catch (err) {
        continue;
      }

      if (campos.length != 40) {
        console.log(
          `Quantidade De Colunas Deferente Do Padrão (40)! Linha:Linha: ${nro_linha} Campos: ${campos.length}}`,
        );
        continue;
      }

      const registro = {
        id_empresa: id_empresa,
        id: 0,
        codemp: campos[0],
        tipopro: campos[1],
        numpro: campos[2],
        codcli: campos[3],
        id_complementar: campos[4],
        mes: campos[5],
        cod_cli_sim: codigo_sim(campos[8]),
        datini: field_data(campos[6]),
        datfim: field_data(campos[7]),
        descrinvestimento: campos[8],
        id_passo: field_number(campos[9]),
        vltotal: field_number(campos[10]),
        vlbaixado: field_number(campos[11]),
        vlliberado: field_number(campos[12]),
        vlparcela: field_number(campos[13]),
        vltotalinvestimento: field_number(campos[14]),
        vlsaldoinvestimento: field_number(campos[15]),
        id_proposta: field_number(campos[16]),
        acao_id: field_number(campos[17]),
        alterado: campos[18],
        emespera: field_number(campos[19]),
        contrato: campos[20],
        idsituacao: field_number(campos[21]),
        workspaceid: field_number(campos[22]),
        idtiposolicitacao: field_number(campos[23]),
        idfluxo: field_number(campos[24]),
        contratoexistente: field_bool(campos[25]),
        id_flag: field_number(campos[26]),
        bodyfluxopi: field_number(campos[27]),
        cd_origem: campos[28],
        proposta_origem: field_number(campos[29]),
        cidemp: campos[30],
        nomcli: campos[31],
        descrpasso: campos[32],
        acao_descricao: campos[33],
        status: campos[34],
        possuipagtonaoliberado: campos[35],
        possuipagtoliberado: campos[36],
        modoas: campos[37],
        msg: campos[38],
        valorsazonal: field_number(campos[39]),
        id_contrato: 0,
        status_conciliador: "0",
        status_arquivos: "0",
        user_insert: id_usuario,
        user_update: 0,
      };

      if (nro_linha % 100 === 0) {
        console.log(`processando linha: ${nro_linha} `);
        console.log(registro);
      }

      try {
        await sim_historicoSrv.insertSim_Historico(registro);
      } catch (err) {
        throw err;
      }
      dtRef = data_ref(campos[6]);
      total = +total + registro.valorsazonal;
    }

    fs.unlinkSync(file.path);

    const nome_arquivo = Buffer.from(file.originalname, "latin1").toString(
      "utf8",
    );

    return { arquivo: nome_arquivo, dtRef: dtRef, total: total };
  } catch (err) {
    throw err;
  }
};

exports.sim_historicos_Arquivos = async function (params) {
  return sim_historicoData.sim_historicos_Arquivos(params);
};
