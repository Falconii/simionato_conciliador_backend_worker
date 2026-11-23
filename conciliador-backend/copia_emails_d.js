/* Etapa 1 (precisa do Y:): copia os anexos de e-mail (status 0) para D:\repositorio_2, com o nome único
   <empresa>_<id>_<nome>. Não duplica: se o arquivo já está na pasta ou em <pasta>\upload (já enviado), pula sem
   nem tocar no Y:. Marca 3 (não é PDF/imagem) e 4 (não existe no Y:). Pode ser interrompido com Ctrl+C. */
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const c = require("./email_anexos_comum");

const program = new Command();

program
    .name("copia_emails_d")
    .description("Copia os anexos de e-mails do Y: para a pasta de repositório")
    .version("1.0.0")
    .requiredOption("--id_usuario <id>", "ID do usuário para login")
    .requiredOption("--senha <senha>", "Senha do usuário para login")
    .option("--id_inicial <id>", "ID inicial do anexo (inclusivo)", (v) => parseInt(v, 10), 0)
    .option("--id_final <id>", "ID final do anexo (inclusivo)", (v) => parseInt(v, 10), 0)
    .option("--destino <pasta>", "Pasta de destino dos arquivos", c.PASTA_PADRAO);

program.parse();
const opts = program.opts();

const RAIZ_Y = path.join(c.DRIVE_LOCAL, c.PASTA_RAIZ);

// Copia para um .tmp e renomeia, para não deixar arquivo pela metade
async function copiarArquivo(origem, destino) {
    const tmp = destino + ".tmp";
    await fs.promises.copyFile(origem, tmp);
    await fs.promises.rename(tmp, destino);
}

async function iniciar() {
    await c.iniciarSessao(opts.id_usuario, opts.senha);

    try {
        const pastaEnviados = path.join(opts.destino, c.SUBPASTA_ENVIADOS);
        await fs.promises.mkdir(pastaEnviados, { recursive: true });

        if (!(await c.existe(RAIZ_Y))) {
            console.log(`❌ ${RAIZ_Y} inacessível (o Y: está conectado?). Nada foi feito.`);
            return;
        }

        const emails = await c.buscarAnexos({
            id: 0, id_inicial: opts.id_inicial, id_final: opts.id_final, acordo: "", status_arquivos: c.STATUS.PENDENTE,
        });

        console.log("anexos pendentes (status 0): ", emails.length);
        console.log("destino: ", opts.destino);
        console.log("início do processamento...");

        let copiados = 0, jaCopiados = 0, ignorados = 0, naoEncontrados = 0, erros = 0, semDados = 0;
        let indice = 0;
        let interrompido = false;

        for (const item of emails) {
            indice++;
            if (indice % 1000 === 0) console.log(`… ${indice}/${emails.length}`);

            if (!item.pasta_acordo || !item.nome_anexo_salvo) {
                console.log("⚠️ Registro sem pasta_acordo/nome_anexo_salvo:", item.id);
                semDados++;
                continue;
            }

            if (!c.extensaoPermitida(item.nome_anexo_salvo)) {
                await c.atualizarStatus(item, c.STATUS.IGNORADO);
                ignorados++;
                continue;
            }

            const nomeDestino = c.montarNomeDestino(item);
            const destino = path.join(opts.destino, nomeDestino);

            // já copiado (fila) ou já enviado (upload): não mexe, nem acessa o Y:
            if ((await c.existe(destino)) || (await c.existe(path.join(pastaEnviados, nomeDestino)))) {
                jaCopiados++;
                continue;
            }

            const origem = c.montarCaminhoOrigem(item);

            try {
                if (!(await c.existe(origem))) {
                    // só vale como "não encontrado" se o Y: está de pé; senão é queda de rede
                    if (!(await c.existe(RAIZ_Y))) {
                        console.log(`❌ ${RAIZ_Y} ficou inacessível. Encerrando sem marcar mais anexos.`);
                        interrompido = true;
                        break;
                    }
                    console.log("❌ Arquivo NÃO encontrado (status 4):", origem);
                    await c.atualizarStatus(item, c.STATUS.NAO_ENCONTRADO);
                    naoEncontrados++;
                    continue;
                }

                await copiarArquivo(origem, destino);
                console.log("✅ Copiado:", nomeDestino);
                copiados++;
            } catch (error) {
                console.log("❌ Erro ao copiar", item.nome_anexo_salvo, ":", error.message);
                erros++;
                if (!(await c.existe(RAIZ_Y))) {
                    console.log(`❌ ${RAIZ_Y} ficou inacessível. Encerrando.`);
                    interrompido = true;
                    break;
                }
            }
        }

        console.log(`Resumo: ${copiados} copiados, ${jaCopiados} já copiados/enviados, ${ignorados} ignorados (3), ${naoEncontrados} não encontrados (4), ${semDados} sem dados, ${erros} com erro.`);
        console.log(interrompido ? "Processamento INTERROMPIDO (Y: indisponível)." : "Fim Do Processamento!");
    } catch (error) {
        console.log("Erro:", error.response?.data?.message || error.message);
    }
}

iniciar();
