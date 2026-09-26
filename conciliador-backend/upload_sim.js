const { Command } = require("commander");
const program = new Command();

const { login } = require("../shared/service/authService.js");
const simUploadSrv = require("../shared/service/sim_uploadService.js");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Caminho da pasta
const baseDir = "D:\\Anexo ASF Fernanda - 2022";

// -----------------------------
// 🔹 Definição dos parâmetros CLI
// -----------------------------
program
    .name("upload_sim")
    .description("Processador de uploads do SIM")
    .version("1.0.0")
    .argument("[dummy]", "Ignorar argumentos posicionais")
    .requiredOption("--proc <numero>", "Procedimento: 0=listar, 1=validar, 2=upload")
    .requiredOption("--tri <trimestre>", "Trimestre, ex: 2020-T3")
    .option("--data <data>", "Data no formato MM/AAAA", "")
    .option("--status <status>", "Status dos arquivos", "0")
    .requiredOption("--id_usuario <id>", "ID do usuário para login")
    .requiredOption("--senha <senha>", "Senha do usuário para login");

program.parse();

let opts = program.opts();

// -----------------------------
// 🔹 Normalização da data
// -----------------------------
if (
    opts.data === '""' ||
    opts.data === "''" ||
    opts.data === "\"\"" ||
    opts.data.trim() === ""
) {
    opts.data = "";
}

// -----------------------------
// 🔹 Pausa para confirmação
// -----------------------------
function confirmarParametros() {
    return new Promise(resolve => {
        console.log("\n📌 **Confirme os parâmetros antes de continuar**");
        console.log("----------------------------------------------");
        console.log("Procedimento :", opts.proc);
        console.log("Trimestre    :", opts.tri);
        console.log("Data         :", opts.data);
        console.log("Status       :", opts.status);
        console.log("ID Usuário   :", opts.id_usuario);
        console.log("Senha        :", "*".repeat(opts.senha.length));
        console.log("----------------------------------------------");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Deseja continuar? (s/N): ", resposta => {
            rl.close();
            resolve(resposta.toLowerCase() === "s");
        });
    });
}

// -----------------------------
// 🔹 Upload de arquivos
// -----------------------------
async function enviarArrayParaGoogleDrive(arquivos, id_sim) {
    let resposta;

    for (const arquivo of arquivos) {
        const caminhoCompleto = path.join(baseDir, arquivo);

        resposta = await simUploadSrv.uploadArquivoSim(
            caminhoCompleto,
            id_sim,
        );
    }

    console.log("✅ Retorno :", resposta);
}

// -----------------------------
// 🔹 Processo principal
// -----------------------------
async function iniciar() {

    const ok = await confirmarParametros();
    if (!ok) {
        console.log("❌ Execução cancelada pelo usuário.");
        return;
    }

    console.log("senha",opts.senha.toString());

    // Login com usuário e senha
    await login(opts.id_usuario, opts.senha.toString());

    return ;

    const arquivos = fs.readdirSync(baseDir);
    let contador = 0;

    try {
        const sims = await simUploadSrv.getSims({
            id_empresa: 1,
            datini: opts.data,
            modoas: "Ação Pontual",
            descrpasso: "Aprovada",
            id: 0,
            status_arquivos: opts.status,
            trimestre: opts.tri,
            tamPagina: 700,
            pagina: 0,
            orderby: "000003"
        });

        if (sims.length === 0) {
            console.log("⚠️ Nenhum Dado No Banco Para Processar");
            return;
        }

        console.log("Total De Registros Do Sim:", sims.length);

        // -----------------------------
        // 🔹 Procedimento 0 — LISTAR
        // -----------------------------
        if (opts.proc == 0) {
            console.log("➡ Procedimento 0: Listagem");

            for (const sim of sims) {
                contador++;
                const prefixo = `${sim.codemp}-${sim.numpro}`;
                const encontrados = arquivos.filter(nome => nome.startsWith(prefixo));

                console.log(`${contador} -> ${sim.codemp}-${sim.numpro} id: ${sim.id}`);

                if (encontrados.length === 0) {
                    console.log("   Nenhum arquivo encontrado");
                }
            }
        }

        // -----------------------------
        // 🔹 Procedimento 1 — VALIDAR
        // -----------------------------
        if (opts.proc == 1) {
            console.log("➡ Procedimento 1: Validação");

            for (const sim of sims) {
                const prefixo = `${sim.codemp}-${sim.numpro}`;
                const encontrados = arquivos.filter(nome => nome.startsWith(prefixo));

                if (encontrados.length > 0) {
                    const docs = await simUploadSrv.getDocGDrive({
                        id_empresa: 1,
                        origem: "SIM",
                        id_origem: sim.id,
                        tamPagina: 700,
                        pagina: 0,
                        orderby: "000003"
                    });

                    if (encontrados.length !== docs.length) {
                        console.log(
                            "comparação:",
                            encontrados.length,
                            docs.length,
                            `${sim.codemp}-${sim.numpro} id: ${sim.id}`
                        );
                    }
                } else {
                    console.log(`${sim.codemp}-${sim.numpro} id: ${sim.id}`);
                    console.log("   Nenhum arquivo encontrado");
                }
            }
        }

        // -----------------------------
        // 🔹 Procedimento 2 — UPLOAD
        // -----------------------------
        if (opts.proc == 2) {
            console.log("➡ Procedimento 2: Upload");

            for (const sim of sims) {
                const prefixo = `${sim.codemp}-${sim.numpro}`;
                const encontrados = arquivos.filter(nome => nome.startsWith(prefixo));

                console.log(`${sim.codemp}-${sim.numpro} id: ${sim.id}`);

                if (encontrados.length > 0) {
                    await enviarArrayParaGoogleDrive(encontrados, sim.id);
                } else {
                    console.log("   Nenhum arquivo encontrado");
                }
            }
        }

        console.log("🏁 Fim Do Processamento!");

    } catch (error) {
        if (error.status === 409) {
            console.log("Nenhum Registro Para Processar!");
        } else {
            console.log("Erro:", error);
            console.log("Erro Do Upload");
        }
    }
}

iniciar();

/*

                for (const sim of sims) {

            const prefixo = `${sim.codemp}-${sim.numpro}`;

            const encontrados = arquivos.filter(nome => nome.startsWith(prefixo));

            // Sempre mostra a empresa e a proposta
            //console.log(`${sim.codemp}-${sim.numpro} id: ${sim.id}`);

            if (encontrados.length > 0) {
                for (const encontrado of encontrados) {
                    //console.log("   " + encontrado);
                }
                const docs = await simUploadSrv.getDocGDrive(
                    {
                        id_empresa: 1,
                        origem:"SIM",
                        id_origem:sim.id,
                        tamPagina:700,
                        pagina:1,
                        orderby:"000003"
                    }
                );
                if (encontrados.length !== docs.length){
                    // Sempre mostra a empresa e a proposta
                    console.log("comparação: ",encontrados.length,docs.length,`${sim.codemp}-${sim.numpro} id: ${sim.id}`);
                } 
                //await enviarArrayParaGoogleDrive(encontrados,sim.id);
            } else {
                console.log("   Nenhum arquivo encontrado");
            }
        }
*/