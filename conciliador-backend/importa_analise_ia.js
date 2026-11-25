/* Importa a planilha de conferência de acordos (análise por IA) para os SIMs ainda NÃO vistoriados.
   Por SIM (id no nome do arquivo, ex.: 01_026206_...; confere codemp/numpro):
     - sim_acordos      : um registro por acordo (nº SEM prefixo "cod-"), pulando o que já existe
     - assinaturas      : resposta 'S' (acordo assinado pelos dois, sem observação) ou 'N' com obs = coluna X (obs) da planilha
     - cab_correcoes    : só quando a assinatura é 'N' (status 0 - Não Enviado, solicitante = usuário da carga)
     - det_correcoes    : primeira mensagem com TODAS as observações da planilha, para orientar o auditor
   Sem nenhum acordo identificado pela IA: assinatura 'N', obs "SEM ACORDO", GP e cliente = 'N'.

   Por padrão só SIMULA (não grava nada). Para gravar: --aplicar.
   Banco: --banco local (padrão, shared/conexoes_local.json) ou --banco nuvem (exige --aplicar-nuvem para gravar).

   Uso (na pasta conciliador-backend):
     node importa_analise_ia.js --arquivo "C:\...\Cópia de PT - Conferencia de Acordos Comerciais - Consolidado.xlsx"
     node importa_analise_ia.js --arquivo "..." --detalhar          (mostra o plano e a mensagem de cada SIM)
     node importa_analise_ia.js --arquivo "..." --aplicar            (grava, numa transação; erro num SIM desfaz só aquele SIM) */
const fs = require("fs");
const path = require("path");
const { Command } = require("commander");

const program = new Command();
program
    .name("importa_analise_ia")
    .requiredOption("--arquivo <caminho>", "planilha .xlsx")
    .option("--empresa <id>", "empresa", (v) => parseInt(v, 10), 1)
    .option("--usuario <id>", "usuário responsável pelas assinaturas e correções", (v) => parseInt(v, 10), 43)
    .option("--banco <banco>", "local ou nuvem", "local")
    .option("--aplicar", "grava de verdade (sem isso só simula)")
    .option("--aplicar-nuvem", "confirma a gravação no banco da nuvem (Railway)")
    .option("--detalhar", "mostra o plano e a mensagem de cada SIM");
program.parse();
const opts = program.opts();

// o banco precisa ser escolhido ANTES de carregar o módulo de conexão
if (!process.env.DATABASE_URL) {
    if (opts.banco === "local") {
        process.env.DATABASE_URL = JSON.parse(fs.readFileSync(path.join(__dirname, "../shared/conexoes_local.json"), "utf8")).database_url;
    } else if (opts.banco !== "nuvem") {
        console.log("--banco deve ser local ou nuvem");
        process.exit(1);
    }
}
const ExcelJS = require("exceljs");
const db = require("../shared/infra/database");

const semAcento = (s) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const dataIso = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d ? String(d).slice(0, 10) : null);
const dataBr = (iso) => (iso ? iso.split("-").reverse().join("/") : "-");
const dinheiro = (n) => Number(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sim_nao = (v) => semAcento(v) === "sim";

// número do acordo SEM prefixo: tira espaços e o "cod-" (ex.: 3008-202304092102 -> 202304092102)
function normalizaAcordo(a) {
    if (a === null || a === undefined) return "";
    const s = String(a).replace(/\s+/g, "");
    const m = /^\d+-(\d+)$/.exec(s);
    return m ? m[1] : s;
}

function valorCelula(c) {
    let v = c.value;
    if (v && typeof v === "object" && !(v instanceof Date)) {
        if ("result" in v) v = v.result;
        else if (Array.isArray(v.richText)) v = v.richText.map((r) => r.text).join("");
        else if ("text" in v) v = v.text;
    }
    return v === undefined ? null : v;
}

async function lerPlanilha(arquivo) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(arquivo);
    const ws = wb.worksheets[0];
    let cab = null;
    ws.eachRow((row, n) => {
        if (!cab && semAcento(valorCelula(row.getCell(2))) === "item") cab = n;
    });
    if (!cab) throw new Error("Cabeçalho (coluna B = Item) não encontrado na planilha.");
    const col = {};
    ws.getRow(cab).eachCell((c, i) => (col[semAcento(valorCelula(c))] = i));
    const pega = (row, nome) => valorCelula(row.getCell(col[nome]));
    const exigidas = ["nome do arquivo", "pag.", "cod_emp", "proposta", "tipo apurado na analise", "acordo", "data_1 - simulador", "data_2 - acordo", "vlr_acordo_pdf",
        "assinatura gp nesta pagina", "assinatura cliente nesta pagina", "status_assinatura (acordo)", "obs", "classificacao ia"];
    const faltam = exigidas.filter((n) => !col[n]);
    if (faltam.length) throw new Error("Colunas não encontradas: " + faltam.join(", "));

    const linhas = [];
    for (let n = cab + 1; n <= ws.rowCount; n++) {
        const row = ws.getRow(n);
        if (!/^\d+$/.test(String(valorCelula(row.getCell(2)) ?? ""))) continue; // pula rodapé/resumos
        linhas.push({
            arq: String(pega(row, "nome do arquivo") ?? ""),
            pag: pega(row, "pag."),
            cod_emp: String(pega(row, "cod_emp") ?? "").trim(),
            proposta: String(pega(row, "proposta") ?? "").trim(),
            tipo: semAcento(pega(row, "tipo apurado na analise")),
            acordo: pega(row, "acordo"),
            d1: dataIso(pega(row, "data_1 - simulador")),
            d2: dataIso(pega(row, "data_2 - acordo")),
            vlr: pega(row, "vlr_acordo_pdf") === null ? null : Number(pega(row, "vlr_acordo_pdf")),
            ass_gp: sim_nao(pega(row, "assinatura gp nesta pagina")),
            ass_cli: sim_nao(pega(row, "assinatura cliente nesta pagina")),
            status: String(pega(row, "status_assinatura (acordo)") ?? "").trim(),
            obs: String(pega(row, "obs") ?? "").trim(),
            classif: String(pega(row, "classificacao ia") ?? "").trim(),
        });
    }
    return linhas;
}

function montaPlano(sim, linhas, jaAcordos, idGoogle) {
    const acordoLin = linhas.filter((l) => l.tipo === "acordo");
    const plano = { sim, acordos: [], notas: [], obsLinhas: [] };

    // acordos consolidados (várias vias/páginas do mesmo acordo viram um registro)
    const porNumero = new Map();
    for (const l of acordoLin) {
        const num = normalizaAcordo(l.acordo);
        if (!num) { plano.notas.push(`Acordo sem número identificado (${l.arq}, pág. ${l.pag}).`); continue; }
        const a = porNumero.get(num) ?? { numero: num, d1: null, d2: null, valores: new Set(), vlr: null, gp: false, cli: false, classif: l.classif, arq: l.arq, pag: l.pag };
        a.d1 = a.d1 ?? l.d1;
        a.d2 = a.d2 ?? l.d2;
        if (l.vlr !== null && !Number.isNaN(l.vlr)) { a.valores.add(l.vlr); a.vlr = a.vlr ?? l.vlr; }
        a.gp = a.gp || l.ass_gp;
        a.cli = a.cli || l.ass_cli;
        porNumero.set(num, a);
    }
    for (const a of porNumero.values()) {
        a.jaExiste = jaAcordos.has(a.numero);
        if (a.vlr === null) plano.notas.push(`Acordo ${a.numero} sem valor na planilha (gravado com 0,00).`);
        if (a.valores.size > 1) plano.notas.push(`Acordo ${a.numero} com valores diferentes entre as vias: ${[...a.valores].map(dinheiro).join(" / ")} (usado o primeiro).`);
        if (!a.d1 || !a.d2) plano.notas.push(`Acordo ${a.numero} sem data_1 ou data_2 na planilha.`);
        plano.acordos.push(a);
    }

    // todas as linhas da observação (coluna X), com a origem de cada uma
    for (const l of linhas) if (l.obs) plano.obsLinhas.push(`[${l.arq}${l.pag && /^\d+$/.test(String(l.pag)) ? ", pág. " + l.pag : ""}] ${l.obs}`);
    const obsDistintas = [...new Set(linhas.filter((l) => l.obs).map((l) => l.obs))];

    if (acordoLin.length === 0) {
        // com observação na planilha (ex.: ARQUIVO CORROMPIDO) vale o texto da coluna X; senão "SEM ACORDO"
        Object.assign(plano, { caso: "A", gp: "N", cli: "N", resposta: "N", obs: obsDistintas.join(" | ") || "SEM ACORDO" });
    } else {
        const assinado = (l) => semAcento(l.status) === "assinado";
        let gp = acordoLin.every((l) => l.ass_gp || assinado(l));
        let cli = acordoLin.every((l) => l.ass_cli || assinado(l));
        // mesma regra da função de migração: o texto da observação manda
        const txt = obsDistintas.join(" ").toUpperCase();
        if (txt.includes("ASSINATURA APENAS DO CLIENTE")) { gp = false; cli = true; }
        if (txt.includes("ASSINATURA APENAS DA GP")) { gp = true; cli = false; }
        const naoAssinado = acordoLin.some((l) => semAcento(l.status) === "nao assinado");
        if (naoAssinado) { gp = false; cli = false; }
        plano.gp = gp ? "S" : "N";
        plano.cli = cli ? "S" : "N";
        let obs = obsDistintas.join(" | ");
        if (!obs && !(gp && cli)) obs = gp ? "ASSINATURA APENAS DA GP" : cli ? "ASSINATURA APENAS DO CLIENTE" : "SEM ASSINATURA";
        plano.obs = obs;
        plano.resposta = obs ? "N" : "S"; // mesma regra do passo 03: obs com texto = 'N'
        plano.caso = obs ? "C" : "B";
    }
    plano.idGoogle = idGoogle ?? 0;
    plano.mensagem = plano.resposta === "N" ? montaMensagem(plano, linhas, acordoLin) : null;
    return plano;
}

function montaMensagem(p, linhas, acordoLin) {
    const out = ["ANÁLISE AUTOMÁTICA (IA) - conferir antes de enviar."];
    const arquivos = [...new Set(linhas.map((l) => l.arq))];
    out.push(`Arquivos analisados: ${arquivos.length} (${arquivos.slice(0, 3).join("; ")}${arquivos.length > 3 ? "; ..." : ""}), ${linhas.length} página(s).`);
    if (p.caso === "A") {
        out.push("A IA não identificou nenhum acordo nos arquivos deste SIM. Assinaturas da GP e do cliente marcadas como N.");
    } else {
        out.push(`Acordos identificados: ${p.acordos.length}`);
        for (const a of p.acordos) {
            out.push(` - Acordo ${a.numero} | data_1 ${dataBr(a.d1)} | data_2 ${dataBr(a.d2)} | R$ ${dinheiro(a.vlr)} | GP: ${a.gp ? "Sim" : "Não"} | Cliente: ${a.cli ? "Sim" : "Não"} | Confiança IA: ${a.classif || "-"}${a.jaExiste ? " | já cadastrado" : ""}`);
        }
        out.push(`Assinatura GP: ${p.gp} | Assinatura cliente: ${p.cli}`);
    }
    if (p.obsLinhas.length) {
        out.push("Observações da análise:");
        p.obsLinhas.forEach((o) => out.push(` - ${o}`));
    }
    p.notas.forEach((n) => out.push(`Atenção: ${n}`));
    return out.join("\n");
}

async function iniciar() {
    const u = new URL(process.env.DATABASE_URL || JSON.parse(fs.readFileSync(path.join(__dirname, "../shared/conexoes_nuvem.json"), "utf8")).database_url);
    console.log(`Banco: ${["localhost", "127.0.0.1"].includes(u.hostname) ? "LOCAL" : "NUVEM"} (${u.hostname}:${u.port}${u.pathname})`);
    const gravar = opts.aplicar && (opts.banco !== "nuvem" || opts.aplicarNuvem);
    if (opts.aplicar && !gravar) {
        console.log("Banco da nuvem: para gravar use também --aplicar-nuvem. Rodando só a simulação.");
    }
    console.log(gravar ? ">>> MODO GRAVAÇÃO <<<" : "Modo simulação (nada será gravado).");

    const linhas = await lerPlanilha(opts.arquivo);
    console.log(`Planilha: ${linhas.length} páginas`);

    // agrupa por SIM: id do nome do arquivo (01_<id>_...), conferindo codemp/numpro
    const grupos = new Map();
    const ignoradas = [];
    for (const l of linhas) {
        const m = /^\d+_(\d+)_/.exec(l.arq);
        const chave = m ? "id:" + Number(m[1]) : `par:${l.cod_emp}|${l.proposta}`;
        if (!grupos.has(chave)) grupos.set(chave, []);
        grupos.get(chave).push(l);
    }
    const ids = [...grupos.keys()].filter((k) => k.startsWith("id:")).map((k) => Number(k.slice(3)));
    const sims = await db.manyOrNone("select id, codemp, numpro, descrpasso, modoas from sim_historicos where id_empresa = $1 and id = any($2)", [opts.empresa, ids]);
    const simPorId = new Map(sims.map((s) => [s.id, s]));

    const lista = [];
    for (const [chave, ls] of grupos) {
        if (!chave.startsWith("id:")) { ignoradas.push(`${chave}: nome do arquivo sem id do SIM`); continue; }
        const s = simPorId.get(Number(chave.slice(3)));
        if (!s) { ignoradas.push(`${chave}: SIM não existe neste banco`); continue; }
        // filtro padrão do SIM
        if (s.descrpasso !== "Aprovada" || s.modoas !== "Ação Pontual") { ignoradas.push(`SIM ${s.id}: fora do filtro (passo "${s.descrpasso}", modo "${s.modoas}")`); continue; }
        // planilha com cod_emp/proposta em branco: vale o id do nome do arquivo (confere em todos os demais)
        const diverge = ls.find((l) => l.cod_emp && l.proposta && (String(s.codemp) !== l.cod_emp || String(s.numpro) !== l.proposta));
        if (diverge) { ignoradas.push(`SIM ${s.id}: planilha diz ${diverge.cod_emp}/${diverge.proposta}, banco tem ${s.codemp}/${s.numpro}`); continue; }
        lista.push({ s, ls });
    }

    const idsSim = lista.map((x) => x.s.id);
    const vistoriados = new Set((await db.manyOrNone("select id_sim from assinaturas where id_empresa = $1 and id_sim = any($2)", [opts.empresa, idsSim])).map((r) => r.id_sim));
    const comCab = new Set((await db.manyOrNone("select id_origem from cab_correcoes where id_empresa = $1 and origem = 'SIM' and id_origem = any($2)", [opts.empresa, idsSim])).map((r) => r.id_origem));
    const acordosExist = new Map();
    for (const r of await db.manyOrNone("select id_sim, acordo from sim_acordos where id_empresa = $1 and id_sim = any($2)", [opts.empresa, idsSim])) {
        if (!acordosExist.has(r.id_sim)) acordosExist.set(r.id_sim, new Set());
        acordosExist.get(r.id_sim).add(normalizaAcordo(r.acordo));
    }
    const docs = new Map((await db.manyOrNone(
        "select distinct on (id_origem) id_origem, id from docs_gdrives where id_empresa = $1 and origem = 'SIM' and id_origem = any($2) and status_upload = '1' order by id_origem, id",
        [opts.empresa, idsSim])).map((r) => [r.id_origem, r.id]));
    const tamObs = (await db.one("select character_maximum_length as n from information_schema.columns where table_name = 'assinaturas' and column_name = 'obs'")).n;

    const planos = [];
    const pulados = { vistoriados: 0, comCorrecao: 0 };
    for (const { s, ls } of lista) {
        if (vistoriados.has(s.id)) { pulados.vistoriados++; continue; }
        if (comCab.has(s.id)) { pulados.comCorrecao++; continue; }
        const p = montaPlano(s, ls, acordosExist.get(s.id) ?? new Set(), docs.get(s.id));
        if (tamObs && p.obs.length > tamObs) { p.notas.push(`obs da assinatura cortada em ${tamObs} caracteres.`); p.obs = p.obs.slice(0, tamObs); }
        planos.push(p);
    }

    const cont = (f) => planos.filter(f).length;
    console.log("\n===== PLANO =====");
    console.log(`SIMs na planilha: ${lista.length} | já vistoriados (ignorados): ${pulados.vistoriados} | já com correção (ignorados): ${pulados.comCorrecao}`);
    console.log(`SIMs a processar: ${planos.length}`);
    console.log(`  A) sem acordo -> assinatura N/N + correção:      ${cont((p) => p.caso === "A")}`);
    console.log(`  B) acordo assinado, sem observação -> 'S':       ${cont((p) => p.caso === "B")}`);
    console.log(`  C) com observação -> 'N' + correção:             ${cont((p) => p.caso === "C")}`);
    const novos = planos.flatMap((p) => p.acordos.filter((a) => !a.jaExiste));
    console.log(`sim_acordos a inserir: ${novos.length} (já existentes: ${planos.flatMap((p) => p.acordos).length - novos.length})`);
    console.log(`correções (cab + 1ª mensagem): ${cont((p) => p.resposta === "N")}`);
    const notas = planos.flatMap((p) => p.notas.map((n) => `SIM ${p.sim.id}: ${n}`));
    if (notas.length) console.log("\nAtenções:\n  " + notas.join("\n  "));
    if (ignoradas.length) console.log("\nIgnorados:\n  " + ignoradas.join("\n  "));
    if (opts.detalhar) {
        for (const p of planos) {
            console.log(`\n--- SIM ${p.sim.id} (${p.sim.codemp}/${p.sim.numpro}) caso ${p.caso}: assinatura ${p.resposta} obs="${p.obs}" GP=${p.gp} cli=${p.cli} id_google=${p.idGoogle}`);
            p.acordos.forEach((a) => console.log(`   sim_acordos: ${a.numero} ${dataBr(a.d1)} ${dataBr(a.d2)} ${dinheiro(a.vlr)}${a.jaExiste ? " (já existe)" : ""}`));
            if (p.mensagem) console.log("   mensagem:\n      " + p.mensagem.split("\n").join("\n      "));
        }
    }

    if (!gravar) { console.log("\nSimulação concluída. Para gravar: --aplicar"); return; }

    // gravação: uma transação geral; cada SIM em savepoint próprio (erro desfaz só aquele SIM)
    const erros = [];
    let ok = 0;
    await db.tx(async (t) => {
        for (const p of planos) {
            try {
                await t.tx(async (s) => {
                    for (const a of p.acordos.filter((x) => !x.jaExiste)) {
                        await s.none(
                            `insert into sim_acordos (id_empresa, id_sim, acordo, data_1, data_2, vlr_acordo_pdf, user_insert, user_update)
                             values ($1, $2, $3, $4, $5, $6, $7, 0)`,
                            [opts.empresa, p.sim.id, a.numero, a.d1, a.d2, a.vlr ?? 0, opts.usuario]);
                    }
                    await s.none(
                        `insert into assinaturas (id_empresa, id_cab, id_auditor, id_google, resposta, obs, processado, user_insert, user_update, id_sim, id_email, upload_cliente, old_obs, id_arker)
                         values ($1, 0, $2, $3, $4, $5, now(), $2, 0, $6, 0, '0', '', 0)`,
                        [opts.empresa, opts.usuario, p.idGoogle, p.resposta, p.resposta === "N" ? p.obs : "", p.sim.id]);
                    if (p.resposta === "N") {
                        const cab = await s.one(
                            `insert into cab_correcoes (id_empresa, cadastr, tarefa, origem, id_origem, id_exec, id_sol, status, status_assinatura_gp, status_assinatura_cliente, user_insert, user_update)
                             values ($1, current_date, $2, 'SIM', $3, 0, $4, '0', $5, $6, $4, $4) returning id`,
                            [opts.empresa, p.obs.slice(0, 255), p.sim.id, opts.usuario, p.gp, p.cli]);
                        await s.none(
                            `insert into det_correcoes (id_empresa, id_cab, mensagem, data, id_auditor, status, user_insert, user_update)
                             values ($1, $2, $3, now(), $4, '0', $4, $4)`,
                            [opts.empresa, cab.id, p.mensagem, opts.usuario]);
                    }
                });
                ok++;
            } catch (e) {
                erros.push(`SIM ${p.sim.id}: ${e.message}`);
            }
        }
    });
    console.log(`\nGravados: ${ok} SIMs | com erro (nada gravado nesses): ${erros.length}`);
    erros.forEach((e) => console.log("  " + e));
}

iniciar()
    .catch((e) => console.log("Erro:", e.message))
    .finally(() => process.exit(0));
