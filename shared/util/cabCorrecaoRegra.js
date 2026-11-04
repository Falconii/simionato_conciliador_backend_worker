const cabCorrecaoSrv = require('../service/cabCorrecaoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO cab_correcao */

exports.cabCorrecao_Inclusao = async function(cab) {
	try {
		const obj = await cabCorrecaoSrv.getCabCorrecao(cab.id_empresa,cab.id);
		if (obj != null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CAB_CORRECAO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}

		/* uma correção por origem: empresa + origem + id da origem, qualquer que seja a situação.
		   sem origem e id_origem o filtro da consulta some e traria tudo, por isso a checagem é pulada */
		if (String(cab.origem ?? '').trim() !== '' && Number(cab.id_origem) > 0) {
			const existentes = await cabCorrecaoSrv.getCabCorrecoes({
				id_empresa: cab.id_empresa,
				origem: cab.origem,
				id_origem: cab.id_origem,
				sharp: true,
			});
			if (existentes.length > 0) {
				throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CAB_CORRECAO', message: `"INCLUSÃO" Já Existe A Correção ${existentes[0].id} Para ${String(cab.origem).toUpperCase()} ${cab.id_origem}.!` }]);
			}
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.cabCorrecao_Alteracao = async function(cab) {
	try {
		const obj = await cabCorrecaoSrv.getCabCorrecao(cab.id_empresa,cab.id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CAB_CORRECAO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.cabCorrecao_Exclusao = async function(id_empresa,id) {
	try {
		const obj = await cabCorrecaoSrv.getCabCorrecao(id_empresa,id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CAB_CORRECAO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
		if (obj.status != '0' && obj.status != '1') {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CAB_CORRECAO', message: `"EXCLUSÃO" Só Permitida Com Situação Não Enviado Ou Aguardando Executor.!` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}
