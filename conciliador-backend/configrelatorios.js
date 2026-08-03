const db = require('./infra/database');
const contratodetSrv = require("./service/contrato_detService");


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
		"competencia":"", 
		"cod_empresa":0, 
		"cod_cliente":"", 
		"cliente":"", 
		"cnpj_cliente":"", 
		"doc_conciliador":"", 
		"proposta":"", 
		"acao":"", 
		"tipo_de_verba":"", 
		"tipo_de_pagamento":"", 
		"status":"", 
		"status_assinatura":"", 
		"status_arquivos":"", 
		"id_paf":0, 
		"id_sim":0, 
		"id_email":0, 
		"id_arker":0,
		"saida":3,
		"pagina":1, 
		"tamPagina":50, 
		"contador":"N", 
		"orderby":"", 
		"sharp":false 
	}

    const sql = await contratodetSrv.getContratos_Det(params);

    await gerarConfigExcel(sql);

})();