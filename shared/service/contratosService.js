const { api } = require("./authService");

// body padrão que você mostrou no Postman
function montarBodyContratos(filtro = {}) {
  return {
    id_empresa: 0,
    id: 0,
    competencia: "",
    cod_empresa: 0,
    cod_cliente: "",
    cliente: "",
    cnpj_cliente: "",
    doc_conciliador: "",
    proposta: "",
    acao: "",
    tipo_de_verba: "",
    tipo_de_pagamento: "",
    status: "",
    status_assinatura: "",
    status_arquivos: "",
    id_paf: 0,
    id_sim: 0,
    id_email: 0,
    id_arker: 0,
    pagina: 1,
    tamPagina: 50,
    contador: "N",
    orderby: "",
    sharp: false,
    ...filtro, // permite sobrescrever campos se quiser
  };
}

async function listarContratos(filtro = {}) {
  try {
    const body = montarBodyContratos(filtro);

    const response = await api.post("/contrato_det/contratos_det", body);
    // como o api já tem o Authorization configurado pelo login,
    // não precisa repetir o header aqui

    return response.data;
  } catch (error) {
    console.error("Erro ao listar contratos:", error);
    throw error;
  }
}

module.exports = {
  listarContratos,
};
