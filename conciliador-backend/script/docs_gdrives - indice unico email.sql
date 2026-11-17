/*
  Garante um único registro em docs_gdrives por anexo de e-mail.

  Contexto: o upload_emails_v2.js pode rodar em várias instâncias ao mesmo tempo. Se duas pegarem o mesmo anexo
  (faixas de ids sobrepostas), as duas poderiam gravar o registro. Com este índice o banco recusa o segundo; o anexo
  que perder a corrida fica em status 2 e, na tentativa seguinte, a rota encontra o registro e devolve 'jaRegistrado'.

  O índice é parcial (só origem 'EMAIL'): SIM e PAF continuam podendo ter vários arquivos por origem.

  1) Confira se já há duplicados (precisa vir vazio; se não vier, o índice não é criado):
*/
SELECT id_empresa, id_origem, count(*) AS qtd, array_agg(id ORDER BY id) AS ids
  FROM docs_gdrives
 WHERE origem = 'EMAIL'
 GROUP BY id_empresa, id_origem
HAVING count(*) > 1;

/* 2) Cria o índice: */
CREATE UNIQUE INDEX IF NOT EXISTS ux_docs_gdrives_email
    ON public.docs_gdrives (id_empresa, id_origem)
 WHERE origem = 'EMAIL';
