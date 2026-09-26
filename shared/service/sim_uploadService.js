const { api } = require("./authService");

const FormData = require("form-data");
const fs = require("fs");

// body padrão que você mostrou no Postman
function parametrosGetSim(filtro = {}) {
    return {
        "id_empresa":1,
        "id": 0 ,
        "codemp": 0 ,
        "numpro": 0 ,
        "cod_cli_sim": '' ,
        "datini" :  '' ,
        "id_contrato" :  0 ,
        "acordo" :  '',
        "status_arquivos" :  '' ,
        "status_assinatura" :  'F' ,
        "obs_assinatura" :  'SEM FILTRO',
        "cond_pagto" :   -1,
        "modoas" :  '',
        "descrpasso" :  '',
        "upload_cliente" :  '',
        "pagina" :  0 ,
        "tamPagina" :  50 ,
        "contador" :  'N' ,
        "orderby" :  '' ,
        "sharp" : false ,
        ...filtro
	};
}



function parametrosGetDocGSim(filtro = {}) {
    return {
		"id_empresa":1, 
		"id":0, 
		"id_folder":"", 
		"id_file":"", 
		"file_name":"", 
		"origem":"", 
		"file_name_original":"", 
		"status_upload":"", 
		"id_origem":0, 
		"pagina":0, 
		"tamPagina":50, 
		"contador":"N", 
		"orderby":"", 
		"sharp":false ,
        ...filtro
	}
}

	

async function uploadArquivoSim(caminhosArquivos, id_sim) {
    try {
        const form = new FormData();

        // Garante que sempre seja tratado como array
        const listaArquivos = Array.isArray(caminhosArquivos)
            ? caminhosArquivos
            : [caminhosArquivos];

        console.log("Arquivos para upload:", listaArquivos);

        // Adiciona cada arquivo ao FormData
        for (const caminho of listaArquivos) {
            if (!fs.existsSync(caminho)) {
                console.warn(`Arquivo não encontrado: ${caminho}`);
                continue;
            }

            form.append("files", fs.createReadStream(caminho));
        }

        // Campo obrigatório da API
        form.append("id_histo", id_sim);

        const response = await api.post("/importacaosim/load_file_sim", form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        return response.data;

    } catch (error) {
        console.error("Erro ao enviar arquivo(s):", error.message);
        throw error;
    }
}


const getSims = async function(filtro = {}) {
    try {

        const body = parametrosGetSim(filtro);
        
        const response = await api.post("/sim_historico/sim_historicos", body);
        // como o api já tem o Authorization configurado pelo login,
        // não precisa repetir o header aqui
        console.log(response.status);
        return response.data;
    } catch (error) {
        throw error;
    }
};


const getDocGDrive = async function(filtro = {}) {
    try {

        const body = parametrosGetDocGSim(filtro);

        const response = await api.post("/doc_gdrive/docs_gdrives", body);
        // como o api já tem o Authorization configurado pelo login,
        // não precisa repetir o header aqui
        return response.data;
    } catch (error) {
        throw error;
    }
};



module.exports = {
    getSims,
    uploadArquivoSim,
    getDocGDrive
};