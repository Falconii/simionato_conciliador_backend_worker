const shared = require("../../shared/util/shared");

function adicionaZero(numero) {
  if (numero <= 9) return "0" + numero;
  else return "" + numero;
}

exports.field_text = function (texto, tamanho) {
  let retorno = "";
  try {
    if (texto == null) {
      return "";
    }
    if (tamanho > 0) {
      if (texto.length > tamanho) {
        retorno = texto.substring(0, tamanho);
      } else {
        retorno = texto;
      }
    }

    retorno = shared.excluirCaracteres(retorno);

    return retorno;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.field_number = function (numero) {
  numero = shared.trocavirgulaporponto(numero);

  const nro = Number(numero);

  if (isNaN(nro)) {
    return 0;
  } else {
    return nro;
  }
};

exports.field_data = function (data) {
  const [month, day, year] = data.split("/");
  return [year, month, day].join("-");
};

exports.data_ref = function (data) {
  const [month, day, year] = data.split("/");
  return [month, year].join("/");
};

exports.codigo_sim = function (texto) {
  const match = texto.match(/-\s*(\d+)\s*-/);
  return match ? match[1] : "";
};

exports.field_bool = function (texto) {
  if (texto.toUpperCase() === "FALSO") {
    return 0;
  } else {
    return 1;
  }
};
