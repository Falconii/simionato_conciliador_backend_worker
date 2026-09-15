const db = require('../shared/infra/database');
//const contratodetSrv = require("./service/contrato_detService");
const pafs_cab = require("../shared/service/paf_cabService.js")


console.log(">>> Arquivo carregado!");


async function gerarConfigExcel(sql) {
    const result = await db.result(sql);
    const rows = result.rows;

    const tipos = await db.any('SELECT oid, typname FROM pg_type');
    const mapaTipos = Object.fromEntries(tipos.map(t => [t.oid, t.typname]));

    const columns = result.fields.map(f => {
        const tipo = mapaTipos[f.dataTypeID] || "unknown";

        let align = "left";
        let format = null;

        // Números inteiros
        if (["int2","int4","int8"].includes(tipo)) {
            align = "right";
            format = "0"; // inteiro
        }

        // Números decimais
        if (["float4","float8","numeric"].includes(tipo)) {
            align = "right";
            format = "#,##0.00;#,##0.00;0"; 
        }

        // Datas
        if (["date","timestamp","timestamptz"].includes(tipo)) {
            align = "center";
            format = "dd/mm/yyyy";
        }

        // Auto-ajuste de largura
        let maxLen = f.name.length;
        rows.forEach(r => {
            const val = r[f.name];
            if (val !== null && val !== undefined) {
                const str = String(val);
                if (str.length > maxLen) maxLen = str.length;
            }
        });

        const width = Math.min(maxLen + 2, 60);

        return {
            header: f.name,
            key: f.name,
            width,
            align,
            format
        };
    });

    const json = {
        sheetName: "Relatório",
        freezeHeader: true,
        autoFilter: true,
        columns
    };

    console.log(JSON.stringify(json, null, 2));

    return json;
}


// Execução
(async () => {
    console.log(">>> Função iniciou!");

    params = {
		"id_empresa":1, 
		"id":0, 
		"nome_arquivo":"", 
		"file_name":"", 
		"processado":"", 
		"qtd_contratos":0, 
		"status":"", 
		"total_valor":0, 
		"status_assinatura":"", 
		"status_arquivo":"", 
		"ass_obs":"", 
		"ass_resposta":"", 
        "status_arquivos":"",
        "saida":3,
		"pagina":0, 
		"tamPagina":50, 
		"contador":"N", 
		"orderby":"", 
		"sharp":false 
	}

    const sql = await pafs_cab.getPafs_Cab(params);

    await gerarConfigExcel(sql);

})();