/*
  MIGRAÇÃO CORREÇÕES - PASSO 2: ÍNDICES

  Executar depois do 01_criacao_tabelas.sql.
  Pode ser executado mais de uma vez (CREATE INDEX IF NOT EXISTS).

  Executar de uma vez só (é uma transação). Se der erro, nada é gravado.
*/
BEGIN;

/* um documento do SIM só pode ter uma correção, em qualquer situação */
CREATE UNIQUE INDEX IF NOT EXISTS ux_cab_correcoes_origem
    ON public.cab_correcoes (id_empresa, origem, id_origem);

/* mensagens de uma correção (chat, exclusão da correção, cálculo do id_aguardando_resposta) */
CREATE INDEX IF NOT EXISTS ix_det_correcoes_cab
    ON public.det_correcoes (id_empresa, id_cab, id);

/* ações de uma correção, e o filtro "ação pendente" (EXISTS por correção, tipo e status) */
CREATE INDEX IF NOT EXISTS ix_acoes_correcoes_cab
    ON public.acoes_correcoes (id_empresa, id_cab_correcoes, status, flag_acao);

COMMIT;
