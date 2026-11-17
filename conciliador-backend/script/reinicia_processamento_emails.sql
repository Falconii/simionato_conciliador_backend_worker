/*
  Zera o processamento dos anexos de e-mail para o upload_emails_v2.js recomeçar do zero.

  O que faz:
    - apaga os registros de docs_gdrives com origem 'EMAIL' (a trigger recalcula o status de psts_anexos);
    - volta para '0' os anexos com status_arquivos '1' ou '2'. O '3' (não é PDF/imagem) é mantido,
      porque o script o grava de novo, só pela extensão do arquivo.

  ATENÇÃO: apagar o registro NÃO apaga o arquivo no Google Drive. Se o arquivo continuar na pasta EMAILS, o upload
  seguinte responde "já existe no Drive" e o registro fica pendente. Por isso o passo 1 lista os arquivos que
  já foram enviados: apague-os (ou mande para a lixeira) na pasta EMAILS do Drive antes de rodar o script.

  Faça um backup antes. Rode por partes: passo 1 (conferir), depois o bloco BEGIN ... COMMIT.
*/

/* 1) Conferência: o que será apagado e quais arquivos já estão no Drive */
SELECT count(*)                                  AS registros_email,
       count(*) FILTER (WHERE id_file <> '')     AS ja_no_drive,
       count(*) FILTER (WHERE status_upload = '0') AS pendentes
  FROM docs_gdrives
 WHERE id_empresa = 1 AND origem = 'EMAIL';

SELECT id_origem AS id_anexo, file_name, id_file          -- arquivos a remover do Drive (pasta EMAILS)
  FROM docs_gdrives
 WHERE id_empresa = 1 AND origem = 'EMAIL' AND id_file <> ''
 ORDER BY id_origem;

SELECT status_arquivos, count(*)                          -- situação atual dos anexos
  FROM psts_anexos
 WHERE id_empresa = 1
 GROUP BY 1 ORDER BY 1;

/* 2) Reinício (confira os resultados antes do COMMIT) */
BEGIN;

DELETE FROM docs_gdrives
 WHERE id_empresa = 1 AND origem = 'EMAIL';

UPDATE psts_anexos
   SET status_arquivos = '0'
 WHERE id_empresa = 1 AND status_arquivos IN ('1', '2');

-- esperado: nenhum registro EMAIL e anexos só em 0 e 3
SELECT (SELECT count(*) FROM docs_gdrives WHERE id_empresa = 1 AND origem = 'EMAIL') AS registros_email;
SELECT status_arquivos, count(*) FROM psts_anexos WHERE id_empresa = 1 GROUP BY 1 ORDER BY 1;

COMMIT;   -- ou ROLLBACK; se algo estiver estranho
