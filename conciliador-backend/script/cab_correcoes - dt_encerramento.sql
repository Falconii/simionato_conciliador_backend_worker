/* data e hora em que a correção foi encerrada (situação 9). Nula enquanto não encerrada.
   timestamptz guarda o instante absoluto, sem depender do fuso do servidor (local = Brasília, Railway = UTC).
   A consulta mostra sempre a hora de Brasília (at time zone 'America/Sao_Paulo') */
ALTER TABLE cab_correcoes ADD COLUMN IF NOT EXISTS dt_encerramento timestamptz;

/* se a coluna já foi criada como "timestamp" (sem fuso), converte; só havia dados de teste.
   Os valores existentes são lidos como hora de Brasília: */
ALTER TABLE cab_correcoes
  ALTER COLUMN dt_encerramento TYPE timestamptz
  USING dt_encerramento AT TIME ZONE 'America/Sao_Paulo';

/* correções que já estavam encerradas antes da coluna: sem a data real. Descomente apenas se quiser preencher o histórico:
UPDATE cab_correcoes SET dt_encerramento = now() WHERE status = '9' AND dt_encerramento IS NULL;
*/
