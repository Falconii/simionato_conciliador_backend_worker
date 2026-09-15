const { api } = require("./authService");
const pst_anexoService = require("./authService");

const FormData = require("form-data");
const fs = require("fs");

// body padrão que você mostrou no Postman
function parametrosGetArkers(filtro = {}) {
    return {
		"id_empresa":1, 
		"id":0, 
		"no_acao":"", 
		"no_acordo":"", 
		"data_lancamento":"", 
		"valor_liquido":-1, 
		"cod_fornecedor_execucao":"", 
		"denominacao_fornecedor_execucao":"", 
		"cnpj_fornecedor_execucao":"", 
		"denominacao_status_arker":"", 
		"frm_pagto":"", 
		"denominacao_bloqueio":"",
		"pagina":1, 
		"tamPagina":50, 
		"contador":"N", 
		"orderby":"", 
		"sharp":false ,
        ...filtro
	};
}

const getArkers = async function(filtro = {}) {
    try {
        const body = parametrosGetArkers(filtro);

        const response = await api.post("/arker/arkers", body);
        // como o api já tem o Authorization configurado pelo login,
        // não precisa repetir o header aqui

        return response.data;
    } catch (error) {
        throw error;
    }
};

async function uploadArquivoArker(caminhoArquivo, id_arker, subpasta) {
    try {
        const form = new FormData();

        console.log("caminhoArquivo",caminhoArquivo);

        form.append("file", fs.createReadStream(caminhoArquivo));
        form.append("id_arker", id_arker);
        form.append("subpasta", subpasta);

        const response = await api.post("/importacaoarker/load_file_arker", form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao enviar arquivo:", error);
        //throw error;
    }
}

module.exports = {
    getArkers,
    uploadArquivoArker
};