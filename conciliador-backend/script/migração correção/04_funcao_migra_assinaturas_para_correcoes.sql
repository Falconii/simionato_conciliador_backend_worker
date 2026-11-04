/*
  MIGRAÇÃO CORREÇÕES - PASSO 4: FUNÇÃO migra_assinaturas_para_correcoes

  Este script só CRIA a função; quem grava os dados é a chamada (ver "Uso" abaixo).

  Pré-requisitos: 01_criacao_tabelas, 02_criacao_indices e 03_ajuste_resposta_assinaturas já executados.

  Para cada assinatura com id_sim > 0, resposta = 'N' e obs preenchido (SIM Aprovada, Ação Pontual,
  status_arquivos = '1', do ano informado) cria:
    - cab_correcoes: origem 'SIM', id_origem = sim.id, tarefa = obs, id_sol = user_insert = user_update = id_auditor,
      status '0' (Não Enviado), sem executor (id_exec = 0), sem ninguém aguardando resposta (id_aguardando_resposta = 0),
      cadastr = data do processamento da assinatura
        * obs com "ASSINATURA APENAS DO CLIENTE": assinatura do cliente = 'S' e da GP = 'N'
        * obs com "ASSINATURA APENAS DA GP":      assinatura da GP = 'S' e do cliente = 'N'
        * sem menção: as duas = 'S'
    - det_correcoes: mensagem inicial (obs), do mesmo auditor, na data do processamento

  Repetível: SIM que já tem correção (uma por SIM, índice ux_cab_correcoes_origem) é ignorado.
  Tudo acontece numa única chamada, então se algo falhar nada é gravado.

  Uso:
    -- 1. conferência: quantas correções serão criadas (a função devolve o mesmo número)
    SELECT count(*)
      FROM sim_historicos sim
     INNER JOIN assinaturas ass ON ass.id_empresa = sim.id_empresa AND ass.id_sim = sim.id AND trim(ass.obs) <> ''
     INNER JOIN usuarios resp   ON resp.id_empresa = sim.id_empresa AND resp.id = ass.id_auditor
     WHERE sim.id_empresa = 1 AND trim(sim.descrpasso) = 'Aprovada' AND trim(sim.modoas) = 'Ação Pontual'
       AND to_char(sim.datini, 'YYYY') = '2019' AND sim.status_arquivos = '1' AND ass.resposta = 'N'
       AND NOT EXISTS (SELECT 1 FROM cab_correcoes c
                        WHERE c.id_empresa = sim.id_empresa AND c.origem = 'SIM' AND c.id_origem = sim.id);

    -- 2. migração: devolve quantas correções foram criadas
    SELECT migra_assinaturas_para_correcoes(1, '2019');
*/
CREATE OR REPLACE FUNCTION migra_assinaturas_para_correcoes(p_id_empresa int4, p_ano text)
RETURNS int4
LANGUAGE plpgsql
AS $$
DECLARE
    r        record;
    v_cab    int4;
    v_gp     char(1);
    v_cli    char(1);
    v_total  int4 := 0;
BEGIN
    FOR r IN
        SELECT sim.id_empresa
             , sim.id            AS id_sim
             , ass.id_auditor
             , ass.processado
             , trim(ass.obs)     AS obs
          FROM sim_historicos sim
         INNER JOIN assinaturas ass ON ass.id_empresa = sim.id_empresa AND ass.id_sim = sim.id AND trim(ass.obs) <> ''
         INNER JOIN usuarios resp   ON resp.id_empresa = sim.id_empresa AND resp.id = ass.id_auditor
         WHERE sim.id_empresa = p_id_empresa
           AND trim(sim.descrpasso) = 'Aprovada'
           AND trim(sim.modoas) = 'Ação Pontual'
           AND to_char(sim.datini, 'YYYY') = p_ano
           AND sim.status_arquivos = '1'
           AND ass.resposta = 'N'
           AND NOT EXISTS (SELECT 1 FROM cab_correcoes c
                            WHERE c.id_empresa = sim.id_empresa AND c.origem = 'SIM' AND c.id_origem = sim.id)
         ORDER BY sim.id_empresa, sim.codemp, sim.numpro
    LOOP
        v_gp  := CASE WHEN upper(r.obs) LIKE '%ASSINATURA APENAS DO CLIENTE%' THEN 'N' ELSE 'S' END;
        v_cli := CASE WHEN upper(r.obs) LIKE '%ASSINATURA APENAS DA GP%'      THEN 'N' ELSE 'S' END;

        INSERT INTO cab_correcoes
               (id_empresa, cadastr, tarefa, origem, id_origem, id_exec, id_sol, status,
                status_assinatura_gp, status_assinatura_cliente, user_insert, user_update)
        VALUES (r.id_empresa, r.processado::date, r.obs, 'SIM', r.id_sim, 0, r.id_auditor, '0',
                v_gp, v_cli, r.id_auditor, r.id_auditor)
        RETURNING id INTO v_cab;

        INSERT INTO det_correcoes
               (id_empresa, id_cab, mensagem, data, id_auditor, status, user_insert, user_update)
        VALUES (r.id_empresa, v_cab, r.obs, r.processado, r.id_auditor, '0', r.id_auditor, r.id_auditor);

        v_total := v_total + 1;
    END LOOP;

    RETURN v_total;
END;
$$;
