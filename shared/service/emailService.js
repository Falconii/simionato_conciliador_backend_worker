const { api } = require("./authService");
const pst_anexoService = require("./authService");

const FormData = require("form-data");
const fs = require("fs");

// body padrão que você mostrou no Postman
function parametrosPstAnexos(filtro = {}) {
    return {
        id_empresa: 1,
        id: 0,
        id_email_pst: 0,
        id_pafs_det: 0,
        acordo: "",
        nome_arquivo_pst: "",
        assunto_email: "",
        status_arquivos: "",
        status_assinatura: "",
        pagina: 1,
        tamPagina: 50,
        contador: "N",
        orderby: "",
        sharp: false,
        ...filtro, // permite sobrescrever campos se quiser
    };
}

const getPsts_Anexos = async function(filtro = {}) {
    try {
        const body = parametrosPstAnexos(filtro);

        const response = await api.post("/pst_anexo/psts_anexos", body);
        // como o api já tem o Authorization configurado pelo login,
        // não precisa repetir o header aqui

        return response.data;
    } catch (error) {
        throw error;
    }
};

async function uploadArquivoEmail(caminhoArquivo, id_pst_anexo) {
    try {
        const form = new FormData();

        form.append("file", fs.createReadStream(caminhoArquivo));
        form.append("id_pst_anexo", id_pst_anexo);

        const response = await api.post("/importacaopaf/load_file_email", form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao enviar arquivo:", error);
        throw error;
    }
}

module.exports = {
    getPsts_Anexos,
    uploadArquivoEmail,
};