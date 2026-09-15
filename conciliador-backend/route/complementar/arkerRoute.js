/* ROUTE arker */
const db = require('../../../shared/infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../../shared/middleware/autenticartoken');
const arkerSrv = require('../../../shared/service/complementar/arkerService');

router.use(autenticarToken);



router.post("/getresumostatusarker",async function(req, res) {

	
try 
	{
				
		const params = {
			id_empresa : req.id_empresa
		}	

		const lsRegistros = await arkerSrv.getResumoStatusArker(params);

		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Não Encontrado Resumo Das Formas de Pagto!' });
		}
		else
		{
			res.status(200).json(lsRegistros);
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'RESUMO FORMA PAGTO', message: err.message });
		}
	}
})

router.post("/getresumofrmpagto",async function(req, res) {

	
try 
	{
				
		const params = {
			id_empresa : req.id_empresa
		}	

		const lsRegistros = await arkerSrv.getResumoFrmPagto(params);

		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Não Encontrado Resumo Das Formas de Pagto!' });
		}
		else
		{
			res.status(200).json(lsRegistros);
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'RESUMO FORMA PAGTO', message: err.message });
		}
	}
})



module.exports = router;
