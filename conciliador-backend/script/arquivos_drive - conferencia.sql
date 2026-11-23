/*
  Detalhes da conferência de docs_gdrives x arquivos_drive (carregada pelo confere_drive.js).
  Troque o tipo no topo: origem em docs_gdrives e sigla em pastas (EMAIL/EMAILS, SIM/SIM_DOC, PAF/PAF, ARKER/ARKER_DOC).
*/

-- 1) links QUEBRADOS: marcados como enviados, mas o id_file não está na pasta do Drive
SELECT d.id, d.id_origem, d.id_file, d.file_name
  FROM docs_gdrives d
 WHERE d.id_empresa = 1 AND d.origem = 'EMAIL'
   AND d.status_upload = '1' AND coalesce(d.id_file, '') <> ''
   AND NOT EXISTS (SELECT 1 FROM arquivos_drive a WHERE a.id_empresa = d.id_empresa AND a.id_file = d.id_file)
 ORDER BY d.id;

-- 2) nome DIFERENTE entre docs_gdrives e o Drive
SELECT d.id, d.id_file, d.file_name AS nome_docs, a.name_file AS nome_drive
  FROM docs_gdrives d
 INNER JOIN arquivos_drive a ON a.id_empresa = d.id_empresa AND a.id_file = d.id_file
 WHERE d.id_empresa = 1 AND d.origem = 'EMAIL' AND d.file_name <> a.name_file
 ORDER BY d.id;

-- 3) pasta DIFERENTE da pasta do tipo
SELECT d.id, d.id_file, d.id_folder AS pasta_docs, a.id_pasta AS pasta_drive
  FROM docs_gdrives d
 INNER JOIN arquivos_drive a ON a.id_empresa = d.id_empresa AND a.id_file = d.id_file
 WHERE d.id_empresa = 1 AND d.origem = 'EMAIL'
   AND a.id_pasta <> (SELECT pasta FROM pastas WHERE id_empresa = 1 AND sigla = 'EMAILS')
 ORDER BY d.id;

-- 4) ÓRFÃOS: no Drive, sem registro em docs_gdrives
SELECT a.id_file, a.name_file, a.size, a.data
  FROM arquivos_drive a
 WHERE a.id_empresa = 1
   AND a.id_pasta = (SELECT pasta FROM pastas WHERE id_empresa = 1 AND sigla = 'EMAILS')
   AND NOT EXISTS (SELECT 1 FROM docs_gdrives d WHERE d.id_empresa = a.id_empresa AND d.id_file = a.id_file)
 ORDER BY a.data;

-- 5) id_file repetido em mais de um registro de docs_gdrives
SELECT d.id_file, count(*) AS qtd, array_agg(d.id ORDER BY d.id) AS ids
  FROM docs_gdrives d
 WHERE d.id_empresa = 1 AND d.origem = 'EMAIL' AND coalesce(d.id_file, '') <> ''
 GROUP BY d.id_file HAVING count(*) > 1;
