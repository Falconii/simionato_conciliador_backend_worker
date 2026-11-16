/*
  Cria a mensagem inicial (det_correcoes) das correções migradas de assinaturas que ficaram sem nenhuma mensagem.

  Critério: cab_correcoes origem 'SIM', status '0', user_insert = id_sol e sem nenhuma linha em det_correcoes.
  Mensagem = tarefa; autor = id_sol; data = data de processamento da assinatura (se não achar, a data do cadastro).

  Repetível: só mexe em correção sem mensagem, então rodar de novo não duplica.

  1) Confira quantas serão afetadas:
*/
SELECT count(*) AS sem_mensagem
  FROM cab_correcoes c
 WHERE c.origem = 'SIM' AND c.status = '0' AND c.user_insert = c.id_sol
   AND NOT EXISTS (SELECT 1 FROM det_correcoes d WHERE d.id_empresa = c.id_empresa AND d.id_cab = c.id);

/* 2) Cria as mensagens (rode dentro de uma transação e confira o resultado antes do COMMIT): */
BEGIN;

INSERT INTO det_correcoes (id_empresa, id_cab, mensagem, data, id_auditor, status, user_insert, user_update)
SELECT c.id_empresa
     , c.id
     , c.tarefa
     , COALESCE((SELECT max(a.processado)
                   FROM assinaturas a
                  WHERE a.id_empresa = c.id_empresa AND a.id_sim = c.id_origem), c.cadastr)
     , c.id_sol
     , '0'
     , c.id_sol
     , c.id_sol
  FROM cab_correcoes c
 WHERE c.origem = 'SIM' AND c.status = '0' AND c.user_insert = c.id_sol
   AND NOT EXISTS (SELECT 1 FROM det_correcoes d WHERE d.id_empresa = c.id_empresa AND d.id_cab = c.id);

-- deve zerar:
SELECT count(*) AS ainda_sem_mensagem
  FROM cab_correcoes c
 WHERE c.origem = 'SIM' AND c.status = '0' AND c.user_insert = c.id_sol
   AND NOT EXISTS (SELECT 1 FROM det_correcoes d WHERE d.id_empresa = c.id_empresa AND d.id_cab = c.id);

COMMIT;   -- ou ROLLBACK; se algo estiver estranho
