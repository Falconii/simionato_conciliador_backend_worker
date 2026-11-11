/* Regra de quem pode aceitar uma correção: fonte única, usada pelo e-mail de aceite, pela consulta
   "aceitáveis por mim" e pelo aceite em lote.
   O aceite fica com o grupo de destino do grupo do solicitante: solicitante do 902 ou 906 tem o aceite
   no grupo 1, e solicitante do 1 tem o aceite no 902. */
const GRUPO_DESTINO_ACEITE = { 902: 1, 906: 1, 1: 902 };

/* trecho de SQL: o usuário do parâmetro $paramUsuario está cadastrado em correcoes_emails e pertence ao
   grupo de destino do solicitante.
   aliasSol = alias de usuarios do solicitante, aliasCab = alias de cab_correcoes.
   O CASE sai do mapa acima (só números inteiros entram no SQL), então a regra existe em um lugar só. */
function sqlPodeAceitar(aliasSol, aliasCab, paramUsuario) {
	const quando = Object.entries(GRUPO_DESTINO_ACEITE)
		.map(([origem, destino]) => `when ${Number(origem)} then ${Number(destino)}`)
		.join(' ');

	return `exists (select 1 from correcoes_emails ce
				inner join usuarios ue on ue.id_empresa = ce.id_empresa and ue.id = ce.id_auditor
				where ce.id_empresa = ${aliasCab}.id_empresa
				  and ce.id_auditor = $${Number(paramUsuario)}
				  and ue.grupo = case ${aliasSol}.grupo ${quando} end)`;
}

module.exports = { GRUPO_DESTINO_ACEITE, sqlPodeAceitar };
