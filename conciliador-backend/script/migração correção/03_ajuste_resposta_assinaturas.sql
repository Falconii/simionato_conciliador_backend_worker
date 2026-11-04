/*
  MIGRAÇÃO CORREÇÕES - PASSO 3: AJUSTE DA COLUNA resposta DE assinaturas

  Regra, para as assinaturas ligadas a um SIM (id_sim > 0):
    - obs com texto  -> resposta = 'N'
    - obs vazio      -> resposta = 'S'

  Só toca nas linhas que realmente mudam. Pode ser executado mais de uma vez
  (na segunda vez não altera nada).

  Executar antes da função de migração das assinaturas para correções, que usa resposta = 'N'.
  Sugestão: guardar uma cópia das linhas antes (ver o bloco de conferência abaixo).
*/

/* 1. conferência: quantas linhas serão alteradas (rode antes e depois; depois deve dar 0) */
SELECT count(*) AS linhas_a_alterar
  FROM assinaturas
 WHERE id_sim > 0
   AND resposta <> CASE WHEN btrim(obs) <> '' THEN 'N' ELSE 'S' END;

/* 2. cópia de segurança do estado atual (só cria se ainda não existir; apague a tabela quando não precisar mais) */
CREATE TABLE IF NOT EXISTS assinaturas_bkp_resposta AS
SELECT *
  FROM assinaturas
 WHERE id_sim > 0
   AND resposta <> CASE WHEN btrim(obs) <> '' THEN 'N' ELSE 'S' END;

/* 3. ajuste */
UPDATE assinaturas
   SET resposta = CASE WHEN btrim(obs) <> '' THEN 'N' ELSE 'S' END
 WHERE id_sim > 0
   AND resposta <> CASE WHEN btrim(obs) <> '' THEN 'N' ELSE 'S' END;
