/*
  Marca com status 3 (ignorado) os anexos que não são PDF/imagem, sem precisar do Y:.
  Mesmo critério de extensões do copia_emails_d.js.

  1) Conferência: quantos por status e se a extensão é aceita
*/
SELECT status_arquivos,
       (lower(nome_anexo_salvo) ~ '\.(pdf|png|jpe?g|gif|bmp|tiff?|webp)$') AS extensao_aceita,
       count(*) AS qtd
  FROM psts_anexos
 GROUP BY 1, 2
 ORDER BY 1, 2;

/* 2) Atualiza (confira o "UPDATE n" e dê COMMIT; senão ROLLBACK) */
BEGIN;

UPDATE psts_anexos
   SET status_arquivos = '3'
 WHERE status_arquivos IN ('0', '2')
   AND nome_anexo_salvo IS NOT NULL
   AND lower(nome_anexo_salvo) !~ '\.(pdf|png|jpe?g|gif|bmp|tiff?|webp)$';

-- COMMIT;
-- ROLLBACK;
