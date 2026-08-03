const axios = require("axios");
const path = require("path");
const fs = require("fs");

//"https://conciliadorbakend-production.up.railway.app/api",
// "http://localhost:3000/api/",

// Lê o arquivo local de credenciais
const credenciais = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../dados_locais/credenciais.json")),
);

const api = axios.create({
    baseURL: "http://localhost:3000/api/",
    timeout: 30000,
});

async function login() {
    try {
        console.log("Realizando login...", credenciais);
        const response = await api.post("/login", {
            id_empresa: credenciais.id_empresa,
            codigo: credenciais.codigo,
            password: credenciais.password,
        });

        const token = response.data.accessToken;

        // injeta o token automaticamente no axios
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        console.log("Login realizado com sucesso");
        return token;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
}

module.exports = {
    login,
    api,
};