// Rotinas comuns de copia_emails_d.js e upload_emails_d.js
const fs = require("fs");
const path = require("path");
const { login } = require("../shared/service/authService");
const emailService = require("../shared/service/emailService");

const ID_EMPRESA = 1;

// No banco o caminho vem como E:\SISTEMAS\O Conciliador - GP\SUP\ANEXOS EMAILS - ACORDOS\...
// Nesta máquina só vale o drive Y:, cujo conteúdo começa em ANEXOS EMAILS - ACORDOS
const PASTA_RAIZ = "ANEXOS EMAILS - ACORDOS";
const DRIVE_LOCAL = "Y:\\";

const PASTA_PADRAO = "D:\\repositorio_2";
const SUBPASTA_ENVIADOS = "upload";

// status_arquivos de psts_anexos
const STATUS = {
    PENDENTE: "0",        // ainda não copiado/enviado
    ENVIADO: "1",         // no Drive (quem grava é a trigger de docs_gdrives)
    FALHA: "2",           // falha na cópia/envio
    IGNORADO: "3",        // não é PDF/imagem
    NAO_ENCONTRADO: "4",  // arquivo não existe no Y:
};

const EXTENSOES_PERMITIDAS = [".pdf", ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tif", ".tiff", ".webp"];

function extensaoPermitida(nomeArquivo) {
    return EXTENSOES_PERMITIDAS.includes(path.extname(nomeArquivo).toLowerCase());
}

// <empresa 2>_<id_anexo 6>_<nome>
function montarNomeDestino(item) {
    const nome = item.nome_anexo_salvo.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_");
    return `${ID_EMPRESA.toString().padStart(2, "0")}_${item.id.toString().padStart(6, "0")}_${nome}`;
}

// Inverso de montarNomeDestino: devolve { id_empresa, id } ou null se o nome não segue o padrão
function lerNomeDestino(nomeArquivo) {
    const m = /^(\d{2})_(\d{6})_/.exec(nomeArquivo);
    return m ? { id_empresa: Number(m[1]), id: Number(m[2]) } : null;
}

function montarCaminhoOrigem(item) {
    // descarta tudo antes de "ANEXOS EMAILS - ACORDOS" (ignora maiúsculas/minúsculas)
    const posicao = item.pasta_acordo.toUpperCase().indexOf(PASTA_RAIZ);
    const pasta = posicao >= 0
        ? DRIVE_LOCAL + item.pasta_acordo.substring(posicao)
        : item.pasta_acordo;
    return path.join(pasta, item.nome_anexo_salvo);
}

async function existe(caminho) {
    try {
        await fs.promises.access(caminho);
        return true;
    } catch {
        return false;
    }
}

function dormir(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Cada login apaga o token anterior do mesmo usuário (a tabela tokens guarda um por usuário). Por isso não há
// renovação periódica: ela derrubaria qualquer outra sessão do usuário (outra janela do script, o v2, o navegador).
// O token vale 7 dias; se um 401 aparecer (outro login do mesmo usuário o derrubou), comSessao entra de novo e repete.
let credenciais = null;

async function iniciarSessao(id_usuario, senha) {
    credenciais = { id_usuario, senha: senha.toString() };
    await login(credenciais.id_usuario, credenciais.senha);
}

// Executa a chamada; em 401 entra de novo e repete uma vez. A chamada precisa ser repetível (montar o FormData lá dentro)
async function comSessao(chamada) {
    try {
        return await chamada();
    } catch (error) {
        if (error.response?.status !== 401 || !credenciais) throw error;
        console.log("🔄 Sessão recusada (401): outro login do mesmo usuário derrubou o token. Entrando de novo...");
        await login(credenciais.id_usuario, credenciais.senha);
        return await chamada();
    }
}

// Lê todas as páginas. 409 da API = consulta sem resultado
async function buscarAnexos(filtro, tamPagina = 3000) {
    const todos = [];
    let ultimoPrimeiroId = null;
    for (let pagina = 1; ; pagina++) {
        let lote;
        try {
            lote = await comSessao(() => emailService.getPsts_Anexos({
                id_empresa: ID_EMPRESA, id: 0, id_inicial: 0, id_final: 0, acordo: "", ...filtro, pagina, tamPagina,
            }));
        } catch (error) {
            if (error.response?.status === 409) break;
            throw error;
        }
        if (!lote || lote.length === 0) break;
        // proteção: se a API ignorar a paginação e repetir a mesma página, para
        if (lote[0].id === ultimoPrimeiroId) break;
        ultimoPrimeiroId = lote[0].id;
        todos.push(...lote);
        if (lote.length < tamPagina) break;
    }
    return todos;
}

async function buscarAnexo(id_empresa, id) {
    const lista = await buscarAnexos({ id_empresa, id, status_arquivos: "" }, 1);
    return lista.length > 0 ? lista[0] : null;
}

async function atualizarStatus(item, status) {
    item.status_arquivos = status;
    try {
        await comSessao(() => emailService.updatePsts_Anexos(item));
    } catch (error) {
        console.log("❌ Erro ao atualizar status do anexo", item.id, ":", error.response?.data?.message || error.message);
    }
}

module.exports = {
    ID_EMPRESA, PASTA_RAIZ, DRIVE_LOCAL, PASTA_PADRAO, SUBPASTA_ENVIADOS, STATUS,
    extensaoPermitida, montarNomeDestino, lerNomeDestino, montarCaminhoOrigem,
    existe, dormir, iniciarSessao, comSessao, buscarAnexos, buscarAnexo, atualizarStatus,
};
