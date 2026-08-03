/* ROUTE contratos_det */
const db = require('../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../shared/middleware/autenticartoken');
const contrato_detSrv = require('../../shared/service/contrato_detService');
const usuarioSrv = require("../../shared/service/usuarioService");
const { exceltoemailordownload } = require("../../shared/excel/excelgenarator");
const crypto = require("crypto");
const path = require('path');
const fs = require('fs');

router.use(autenticarToken); 
/* ROTA GETONE contrato_det */

const configParams = {
  "sheetName": "Relatório",
  "freezeHeader": true,
  "autoFilter": true,
  "columns": [
    {
      "header": "id_empresa",
      "key": "id_empresa",
      "width": 12,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id",
      "key": "id",
      "width": 6,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_cab",
      "key": "id_cab",
      "width": 8,
      "align": "right",
      "format": "0"
    },
    {
      "header": "nro_linha",
      "key": "nro_linha",
      "width": 11,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_paf",
      "key": "id_paf",
      "width": 8,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_sim",
      "key": "id_sim",
      "width": 8,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_email",
      "key": "id_email",
      "width": 10,
      "align": "right",
      "format": "0"
    },
    {
      "header": "id_arker",
      "key": "id_arker",
      "width": 10,
      "align": "right",
      "format": "0"
    },
    {
      "header": "competencia",
      "key": "competencia",
      "width": 13,
      "align": "left",
      "format": null
    },
    {
      "header": "base",
      "key": "base",
      "width": 9,
      "align": "left",
      "format": null
    },
    {
      "header": "cod_filial",
      "key": "cod_filial",
      "width": 12,
      "align": "right",
      "format": "0"
    },
    {
      "header": "filial",
      "key": "filial",
      "width": 23,
      "align": "left",
      "format": null
    },
    {
      "header": "cp",
      "key": "cp",
      "width": 6,
      "align": "left",
      "format": null
    },
    {
      "header": "cod_empresa",
      "key": "cod_empresa",
      "width": 13,
      "align": "right",
      "format": "0"
    },
    {
      "header": "cod_bandeiras",
      "key": "cod_bandeiras",
      "width": 15,
      "align": "right",
      "format": "0"
    },
    {
      "header": "bandeiras",
      "key": "bandeiras",
      "width": 43,
      "align": "left",
      "format": null
    },
    {
      "header": "tipo_de_pagamento",
      "key": "tipo_de_pagamento",
      "width": 19,
      "align": "left",
      "format": null
    },
    {
      "header": "cod_cliente",
      "key": "cod_cliente",
      "width": 13,
      "align": "left",
      "format": null
    },
    {
      "header": "cliente",
      "key": "cliente",
      "width": 53,
      "align": "left",
      "format": null
    },
    {
      "header": "cnpj_cliente",
      "key": "cnpj_cliente",
      "width": 16,
      "align": "left",
      "format": null
    },
    {
      "header": "investimento",
      "key": "investimento",
      "width": 14,
      "align": "right",
      "format": "#,##0.00;#,##0.00;0"
    },
    {
      "header": "acao",
      "key": "acao",
      "width": 21,
      "align": "left",
      "format": null
    },
    {
      "header": "proposta",
      "key": "proposta",
      "width": 10,
      "align": "left",
      "format": null
    },
    {
      "header": "uf",
      "key": "uf",
      "width": 4,
      "align": "left",
      "format": null
    },
    {
      "header": "tipo_de_verba",
      "key": "tipo_de_verba",
      "width": 17,
      "align": "left",
      "format": null
    },
    {
      "header": "tipo_doc",
      "key": "tipo_doc",
      "width": 10,
      "align": "left",
      "format": null
    },
    {
      "header": "dp_sic",
      "key": "dp_sic",
      "width": 8,
      "align": "right",
      "format": "0"
    },
    {
      "header": "doc_conciliador",
      "key": "doc_conciliador",
      "width": 17,
      "align": "left",
      "format": null
    },
    {
      "header": "pagina",
      "key": "pagina",
      "width": 8,
      "align": "left",
      "format": null
    },
    {
      "header": "modo",
      "key": "modo",
      "width": 6,
      "align": "left",
      "format": null
    },
    {
      "header": "status",
      "key": "status",
      "width": 8,
      "align": "left",
      "format": null
    },
    {
      "header": "status_assinatura",
      "key": "status_assinatura",
      "width": 19,
      "align": "left",
      "format": null
    },
    {
      "header": "status_arquivos",
      "key": "status_arquivos",
      "width": 17,
      "align": "left",
      "format": null
    },
    {
      "header": "user_insert",
      "key": "user_insert",
      "width": 13,
      "align": "right",
      "format": "0"
    },
    {
      "header": "user_update",
      "key": "user_update",
      "width": 13,
      "align": "right",
      "format": "0"
    },
    {
      "header": "paf_qtd_contratos",
      "key": "paf_qtd_contratos",
      "width": 19,
      "align": "right",
      "format": "0"
    },
    {
      "header": "paf_status",
      "key": "paf_status",
      "width": 12,
      "align": "left",
      "format": null
    },
    {
      "header": "paf_total_valor",
      "key": "paf_total_valor",
      "width": 17,
      "align": "right",
      "format": "#,##0.00;#,##0.00;0"
    },
    {
      "header": "sim_qtd_contratos",
      "key": "sim_qtd_contratos",
      "width": 19,
      "align": "right",
      "format": "0"
    },
    {
      "header": "sim_status_conciliador",
      "key": "sim_status_conciliador",
      "width": 24,
      "align": "left",
      "format": null
    },
    {
      "header": "sim_valorsazonal",
      "key": "sim_valorsazonal",
      "width": 18,
      "align": "right",
      "format": "#,##0.00;#,##0.00;0"
    },
    {
      "header": "ass_paf_resposta",
      "key": "ass_paf_resposta",
      "width": 18,
      "align": "left",
      "format": null
    },
    {
      "header": "ass_paf_obs",
      "key": "ass_paf_obs",
      "width": 13,
      "align": "left",
      "format": null
    },
    {
      "header": "ass_sim_resposta",
      "key": "ass_sim_resposta",
      "width": 18,
      "align": "left",
      "format": null
    },
    {
      "header": "ass_sim_obs",
      "key": "ass_sim_obs",
      "width": 13,
      "align": "left",
      "format": null
    }
  ]
}

router.get("/:id",async function(req, res) {
try 
	{
		const lsLista = await contrato_detSrv.getContrato_Det(req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Contrato_Det Não Encontrada.' });
		}
	else
		{
			res.status(200).json(lsLista);
		}
	}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'contrato_det', message: err.message });
		}
	}
})
/* ROTA GETALL contrato_det */
router.get("/",async function(req, res) {
try 
	{
		const lsLista = await contrato_detSrv.getContratos_Det();
		if (lsLista.length == 0) 
		{
			res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.'} );
		}
	else
		{
			res.status(200).json(lsLista);
		}
	}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'contrato_det', message: err.message });
		}
	}
})
/* ROTA INSERT contrato_det */
router.post("/",async function(req, res) {
try 
	{
		const contrato_det = req.body;
		const registro = await contrato_detSrv.insertContrato_Det(contrato_det);
		if (registro == null)
		{
			res.status(409).json({ message: 'Contrato_Det Cadastrado!' });
		}
		else
		{
			res.status(200).json(registro);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Contrato_Det', message: err.message });
		}
	}
})
/* ROTA UPDATE contrato_det */
router.put("/",async function(req, res) {
try 
	{
		const contrato_det = req.body;
		const registro = await contrato_detSrv.updateContrato_Det(contrato_det);
		if (registro == null)
		{
			res.status(409).json({ message: 'Contrato_Det Alterado Com Sucesso!' });
		}
		else
		{
			res.status(200).json(registro);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Contrato_Det', message: err.message });
		}
	}
})
/* ROTA DELETE contrato_det */
router.delete("/:id",async function(req, res) {
try 
	{
		await contrato_detSrv.deleteContrato_Det(req.params.id);
		res.status(200).json({ message: 'Contrato_Det Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Contrato_Det', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST contratos_det */
router.post("/contratos_det",async function(req, res) {
/*
	{
		"id_empresa":0, 
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
		"saida":0 -> resultset 
		"pagina":0, 
		"tamPagina":50, 
		"contador":"N", 
		"orderby":"", 
		"sharp":false 
	}
*/
try 
	{
		const id_empresa = req.id_empresa;
    const id_usuario = req.id_usuario;
    
		const params = req.body;

		console.log(req.user);

		const usuario = await usuarioSrv.getUsuario(id_empresa,id_usuario);

		const lsRegistros = await contrato_detSrv.getContratos_Det(params);

    if (params.saida && params.saida == 3) {
      res.status(200).json({ message: 'Select', sql: lsRegistros.replace(/[\n\t]/g, '') });
    };

		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Contrato_Det Nenhum Registro Encontrado!' });
		}
		else
		{
			if (params.saida && (params.saida == 1 || params.saida == 2)) {
				
                 const uuid = crypto.randomUUID();
                 const file_name = `CONTRATOS_${uuid}.xlsx`;
                 await exceltoemailordownload(res,usuario,"CONTRATOS",configParams,lsRegistros,params.finalizacao,file_name);
                 res.status(200).json({message:"Arquivo Gerado!"});
			}
			res.status(200).json(lsRegistros);
		}
}
catch (err)
	{
    console.log("erro:",err);

		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Contrato_Det', message: err.message });
		}
	}
})

module.exports = router;
