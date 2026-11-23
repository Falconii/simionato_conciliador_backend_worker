/* Etapa 2 (só D: e internet, pode rodar à noite): envia ao Google Drive os arquivos que estão em
   D:\repositorio_2 (a fila) pela rota /importacaoemail/anexo, que grava docs_gdrives (a trigger leva o anexo
   para status 1). Depois de enviado o arquivo é movido para <pasta>\upload. Em falha o anexo vai para status 2
   e o arquivo continua na fila, sendo tentado de novo na próxima execução. */
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const emailService = require("../shared/service/emailService");
const c = require("./email_anexos_comum");

const program = new Command();

program
    .name("upload_emails_d")
    .description("Envia os anexos copiados em D: para o Google Drive")
    .version("1.0.0")
    .requiredOption("--id_usuario <id>", "ID do usuário para login")
    .requiredOption("--senha <senha>", "Senha do usuário para login")
    .option("--id_inicial <id>", "ID inicial do anexo (inclusivo)", (v) => parseInt(v, 10), 0)
    .option("--id_final <id>", "ID final do anexo (inclusivo, 0 = sem limite)", (v) => parseInt(v, 10), 0)
    .option("--limite <n>", "Máximo de arquivos enviados nesta execução (0 = todos)", (v) => parseInt(v, 10), 0)
    .option("--destino <pasta>", "Pasta onde estão os arquivos copiados", c.PASTA_PADRAO);

program.parse();
const opts = program.opts();

// Arquivos da fila (nível principal da pasta; ignora .tmp e a subpasta upload), dentro da faixa de ids
async function listarFila() {
    const entradas = await fs.promises.readdir(opts.destino, { withFileTypes: true });
    const fila = [];
    for (const e of entradas) {
        if (!e.isFile() || e.name.toLowerCase().endsWith(".tmp")) continue;
        const dados = c.lerNomeDestino(e.name);
        if (!dados) continue;
        if (opts.id_inicial && dados.id < opts.id_inicial) continue;
        if (opts.id_final && dados.id > opts.id_final) continue;
        fila.push({ nome: e.name, ...dados });
    }
    return fila.sort((a, b) => a.id - b.id);
}

// Nunca lança: uma falha ao mover não pode virar "falha de upload" (o arquivo já pode estar no Drive). ENOENT quer dizer
// que o arquivo sumiu da fila: normalmente outra instância com o mesmo intervalo de ids já o moveu
async function moverParaEnviados(nome) {
    try {
        await fs.promises.rename(path.join(opts.destino, nome), path.join(opts.destino, c.SUBPASTA_ENVIADOS, nome));
        return true;
    } catch (error) {
        if (error.code === "ENOENT") {
            console.log("ℹ️ O arquivo já saiu da fila (outra instância com o mesmo intervalo de ids?):", nome);
        } else {
            console.log("⚠️ Não foi possível mover para upload:", nome, "-", error.message);
        }
        return false;
    }
}

async function iniciar() {
    await c.iniciarSessao(opts.id_usuario, opts.senha);

    try {
        await fs.promises.mkdir(path.join(opts.destino, c.SUBPASTA_ENVIADOS), { recursive: true });

        const filaCompleta = await listarFila();
        // --limite: só os primeiros n da fila; os enviados saem da fila (vão para upload), então a próxima execução pega os seguintes
        const fila = opts.limite > 0 ? filaCompleta.slice(0, opts.limite) : filaCompleta;
        console.log("arquivos na fila: ", filaCompleta.length, opts.limite > 0 ? `(processando ${fila.length})` : "");
        console.log("destino: ", opts.destino);
        console.log("início do processamento...");

        let enviados = 0, jaNoDrive = 0, jaRegistrados = 0, pulados = 0, erros = 0;
        let indice = 0;
        // 401 seguido mesmo depois de entrar de novo: a sessão está sendo derrubada por outro login do mesmo usuário
        // (cada login apaga o token anterior). Para em vez de passar pela fila toda só acumulando erro
        let recusasSeguidas = 0;
        const MAX_RECUSAS = 5;
        let interrompido = false;

        for (const arq of fila) {
            indice++;
            console.log(`🔍 ${indice}/${fila.length} (anexo ${arq.id})`);

            let item = null;
            try {
                item = await c.buscarAnexo(arq.id_empresa, arq.id);
                recusasSeguidas = 0;
            } catch (error) {
                console.log("❌ Erro ao consultar o anexo", arq.id, ":", error.response?.data?.message || error.message);
                erros++;
                if (error.response?.status === 401 && ++recusasSeguidas >= MAX_RECUSAS) {
                    console.log(`⛔ ${MAX_RECUSAS} recusas de login seguidas: outro login do mesmo usuário está derrubando a sessão. Use um usuário só para este programa e rode de novo.`);
                    interrompido = true;
                    break;
                }
                if (!error.response) await c.dormir(60000);
                continue;
            }

            if (!item) {
                console.log("⚠️ Anexo não existe no banco, arquivo deixado na fila:", arq.nome);
                pulados++;
                continue;
            }

            // já concluído (caiu entre o envio e a movimentação): só move
            if (item.status_arquivos === c.STATUS.ENVIADO) {
                await moverParaEnviados(arq.nome);
                console.log("ℹ️ Já estava concluído; movido para upload:", arq.nome);
                jaRegistrados++;
                continue;
            }

            if (item.status_arquivos === c.STATUS.IGNORADO || item.status_arquivos === c.STATUS.NAO_ENCONTRADO) {
                console.log(`⚠️ Anexo com status ${item.status_arquivos}, arquivo deixado na fila:`, arq.nome);
                pulados++;
                continue;
            }

            // sumiu da fila desde a listagem: outra instância já cuidou dele
            if (!(await c.existe(path.join(opts.destino, arq.nome)))) {
                console.log("ℹ️ O arquivo já saiu da fila (outra instância com o mesmo intervalo de ids?):", arq.nome);
                pulados++;
                continue;
            }

            try {
                // o FormData é montado dentro de uploadAnexoEmail, então a repetição depois de um 401 é segura
                const resposta = await c.comSessao(() => emailService.uploadAnexoEmail(
                    path.join(opts.destino, arq.nome), item.id, item.nome_anexo_salvo,
                ));
                await moverParaEnviados(arq.nome);

                if (resposta.status === "enviado") {
                    console.log("☁️ Enviado para o Google Drive:", arq.nome);
                    enviados++;
                } else if (resposta.status === "jaRegistrado") {
                    console.log("ℹ️ Já estava no Google Drive e registrado:", arq.nome);
                    jaRegistrados++;
                } else {
                    console.log("ℹ️ O Drive já tinha o arquivo; registro completado:", arq.nome);
                    jaNoDrive++;
                }
            } catch (error) {
                console.log("❌ Erro ao enviar", arq.nome, ":", error.response?.data?.message || error.message);
                erros++;
                if (error.response?.status === 401) {
                    // problema de sessão, não do arquivo: não marca status 2
                    if (++recusasSeguidas >= MAX_RECUSAS) {
                        console.log(`⛔ ${MAX_RECUSAS} recusas de login seguidas: outro login do mesmo usuário está derrubando a sessão. Use um usuário só para este programa e rode de novo.`);
                        interrompido = true;
                        break;
                    }
                    continue;
                }
                // internet/arquivo corrompido: status 2; o arquivo fica na fila para a próxima execução
                if (item.status_arquivos !== c.STATUS.FALHA) {
                    await c.atualizarStatus(item, c.STATUS.FALHA);
                }
                // sem resposta do servidor = queda de internet: espera um pouco antes do próximo
                if (!error.response) {
                    console.log("⏳ Sem resposta do servidor; aguardando 60s...");
                    await c.dormir(60000);
                }
            }
        }

        console.log(`Resumo: ${enviados} enviados, ${jaRegistrados} já registrados, ${jaNoDrive} já estavam no Drive (registro completado), ${pulados} pulados, ${erros} com erro.`);
        console.log(interrompido ? "Processamento INTERROMPIDO (sessão recusada)." : "Fim Do Processamento!");
    } catch (error) {
        console.log("Erro:", error.response?.data?.message || error.message);
    }
}

iniciar();
