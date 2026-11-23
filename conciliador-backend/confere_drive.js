/* Confere os links de docs_gdrives com o Google Drive, por tipo de documento (EMAIL, SIM, PAF, ARKER).
   1) lista a pasta do tipo no Drive (a pasta vem de pastas.pasta) e grava a cópia em arquivos_drive;
   2) compara docs_gdrives x arquivos_drive e mostra o resumo: link quebrado, nome diferente, pasta errada,
      arquivos órfãos (no Drive sem registro) e duplicados.
   Só escreve em arquivos_drive (apaga e recarrega as linhas da pasta). Antes: script/arquivos_drive.sql.
   Para conferir o banco do Railway: $env:DATABASE_URL = "<url do banco>" antes de rodar. */
const { Command } = require("commander");
const { google } = require("googleapis");
const db = require("../shared/infra/database");
const funcoes = require("../shared/util/googleFuncoes");

// tipo -> origem em docs_gdrives e sigla em pastas
const TIPOS = {
    EMAIL: { origem: "EMAIL", sigla: "EMAILS" },
    SIM: { origem: "SIM", sigla: "SIM_DOC" },
    PAF: { origem: "PAF", sigla: "PAF" },
    ARKER: { origem: "ARKER", sigla: "ARKER_DOC" },
};

const program = new Command();
program
    .name("confere_drive")
    .description("Confere docs_gdrives com o Google Drive")
    .requiredOption("--tipo <tipo>", "EMAIL, SIM, PAF ou ARKER")
    .option("--empresa <id>", "empresa", (v) => parseInt(v, 10), 1)
    .option("--detalhar <n>", "quantos links quebrados consultar um a um no Drive (lixeira/outra pasta)", (v) => parseInt(v, 10), 50)
    .option("--sem-carga", "não lista o Drive: usa a cópia que já está em arquivos_drive");
program.parse();
const opts = program.opts();

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

// repete em erro transitório do Google (cota, 5xx, rede)
async function comTentativas(chamada) {
    for (let t = 1; ; t++) {
        try {
            return await chamada();
        } catch (error) {
            const codigo = error.code || error.response?.status;
            const transitorio = [429, 500, 502, 503, 504].includes(Number(codigo)) || ["ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN"].includes(error.code);
            if (!transitorio || t >= 6) throw error;
            const espera = 2000 * t;
            console.log(`⏳ Google respondeu ${codigo}; nova tentativa em ${espera / 1000}s (${t}/5)...`);
            await dormir(espera);
        }
    }
}

async function listarPasta(drive, pastaId) {
    const arquivos = [];
    let pageToken = null;
    let pagina = 0;
    do {
        const res = await comTentativas(() => drive.files.list({
            q: `'${pastaId}' in parents and trashed=false`,
            spaces: "drive",
            pageSize: 1000,
            fields: "nextPageToken, files(id, name, size, modifiedTime)",
            pageToken,
        }));
        arquivos.push(...res.data.files);
        pageToken = res.data.nextPageToken;
        pagina++;
        if (pagina % 10 === 0 || !pageToken) console.log(`   ${arquivos.length} arquivos listados (${pagina} páginas)...`);
    } while (pageToken);
    return arquivos;
}

async function gravarCopia(empresa, pastaId, arquivos) {
    const LOTE = 5000;
    await db.tx(async (t) => {
        await t.none("delete from arquivos_drive where id_empresa = $1 and id_pasta = $2", [empresa, pastaId]);
        for (let i = 0; i < arquivos.length; i += LOTE) {
            const l = arquivos.slice(i, i + LOTE);
            await t.none(
                `insert into arquivos_drive (id_empresa, id_file, id_pasta, name_file, size, data)
                 select $1, x.id_file, $2, x.name_file, x.size, x.data
                   from unnest($3::text[], $4::text[], $5::int8[], $6::timestamp[]) as x(id_file, name_file, size, data)
                 on conflict (id_empresa, id_file) do update
                    set id_pasta = excluded.id_pasta, name_file = excluded.name_file, size = excluded.size,
                        data = excluded.data, carga = now()`,
                [
                    empresa, pastaId,
                    l.map((a) => a.id),
                    l.map((a) => a.name),
                    l.map((a) => (a.size === undefined ? null : Number(a.size))),
                    l.map((a) => a.modifiedTime ?? null),
                ],
            );
        }
    });
}

async function iniciar() {
    const tipo = TIPOS[String(opts.tipo).toUpperCase()];
    if (!tipo) {
        console.log("Tipo inválido. Use: " + Object.keys(TIPOS).join(", "));
        return;
    }

    const pasta = await db.oneOrNone("select pasta from pastas where id_empresa = $1 and sigla = $2", [opts.empresa, tipo.sigla]);
    if (!pasta) {
        console.log(`Pasta ${tipo.sigla} não encontrada em pastas (empresa ${opts.empresa}).`);
        return;
    }
    const pastaId = pasta.pasta;
    console.log(`Tipo ${opts.tipo.toUpperCase()}: origem ${tipo.origem}, pasta ${tipo.sigla} (${pastaId})`);

    const params = await funcoes.loadCredencials(opts.empresa);
    const drive = google.drive({ version: "v3", auth: funcoes.getoauth2Client(params) });

    if (!opts.semCarga) {
        console.log("Listando a pasta no Drive...");
        const arquivos = await listarPasta(drive, pastaId);
        console.log(`Gravando ${arquivos.length} arquivos em arquivos_drive...`);
        await gravarCopia(opts.empresa, pastaId, arquivos);
    } else {
        console.log("Usando a cópia que já está em arquivos_drive.");
    }

    const base = [opts.empresa, tipo.origem, pastaId];
    const um = async (sql) => Number((await db.one(sql, base)).n);

    const naCopia = await um("select count(*) as n from arquivos_drive where id_empresa = $1 and id_pasta = $3");
    const total = await um("select count(*) as n from docs_gdrives where id_empresa = $1 and origem = $2");
    const semLink = await um(`select count(*) as n from docs_gdrives d where d.id_empresa = $1 and d.origem = $2
                              and (d.status_upload <> '1' or coalesce(d.id_file,'') = '')`);
    const quebrados = await um(`select count(*) as n from docs_gdrives d where d.id_empresa = $1 and d.origem = $2
                                and d.status_upload = '1' and coalesce(d.id_file,'') <> ''
                                and not exists (select 1 from arquivos_drive a where a.id_empresa = d.id_empresa and a.id_file = d.id_file)`);
    const nomeDif = await um(`select count(*) as n from docs_gdrives d
                              inner join arquivos_drive a on a.id_empresa = d.id_empresa and a.id_file = d.id_file
                              where d.id_empresa = $1 and d.origem = $2 and d.file_name <> a.name_file`);
    const pastaDif = await um(`select count(*) as n from docs_gdrives d
                               inner join arquivos_drive a on a.id_empresa = d.id_empresa and a.id_file = d.id_file
                               where d.id_empresa = $1 and d.origem = $2 and a.id_pasta <> $3`);
    const orfaos = await um(`select count(*) as n from arquivos_drive a where a.id_empresa = $1 and a.id_pasta = $3
                             and not exists (select 1 from docs_gdrives d where d.id_empresa = a.id_empresa and d.id_file = a.id_file)`);
    const duplicados = await um(`select count(*) as n from (select id_file from docs_gdrives
                                  where id_empresa = $1 and origem = $2 and coalesce(id_file,'') <> ''
                                  group by id_file having count(*) > 1) x`);

    console.log("\n===== RESULTADO =====");
    console.log(`Arquivos na pasta do Drive (cópia):          ${naCopia}`);
    console.log(`Registros em docs_gdrives (${tipo.origem}):          ${total}`);
    console.log(`  sem link (não enviados / id_file vazio):    ${semLink}`);
    console.log(`  link QUEBRADO (id_file fora da pasta):      ${quebrados}`);
    console.log(`  nome DIFERENTE do Drive:                    ${nomeDif}`);
    console.log(`  pasta DIFERENTE da pasta do tipo:           ${pastaDif}`);
    console.log(`  id_file duplicado em mais de um registro:   ${duplicados}`);
    console.log(`Arquivos ÓRFÃOS (no Drive, sem docs_gdrives): ${orfaos}`);

    // links quebrados: consulta um a um para dizer o motivo (lixeira, outra pasta, apagado)
    if (quebrados > 0 && opts.detalhar > 0) {
        const lista = await db.manyOrNone(
            `select d.id, d.id_file, d.file_name from docs_gdrives d where d.id_empresa = $1 and d.origem = $2
                and d.status_upload = '1' and coalesce(d.id_file,'') <> ''
                and not exists (select 1 from arquivos_drive a where a.id_empresa = d.id_empresa and a.id_file = d.id_file)
              order by d.id limit ${Number(opts.detalhar)}`, base);
        const motivos = { lixeira: 0, "outra pasta": 0, "apagado/sem acesso": 0, "outro erro": 0 };
        console.log(`\nDetalhando ${lista.length} dos ${quebrados} links quebrados:`);
        for (const d of lista) {
            try {
                const r = await comTentativas(() => drive.files.get({ fileId: d.id_file, fields: "id, name, trashed, parents" }));
                const m = r.data.trashed ? "lixeira" : "outra pasta";
                motivos[m]++;
                console.log(`  doc ${d.id}: ${m} - ${r.data.name}${m === "outra pasta" ? " (pastas " + (r.data.parents || []).join(",") + ")" : ""}`);
            } catch (error) {
                const m = Number(error.code) === 404 ? "apagado/sem acesso" : "outro erro";
                motivos[m]++;
                console.log(`  doc ${d.id}: ${m} - ${d.file_name}`);
            }
        }
        console.log("  Resumo:", JSON.stringify(motivos));
    }
    console.log("\nDetalhes pelas consultas de script/arquivos_drive - conferencia.sql");
}

iniciar()
    .catch((error) => console.log("Erro:", error.message))
    .finally(() => process.exit(0));
