/*
  Cópia da listagem do Google Drive, para conferir os links de docs_gdrives (id_file, nome e pasta).
  Quem preenche é o confere_drive.js: a cada execução apaga as linhas da pasta conferida e recarrega.

  id_pasta = id da pasta no Drive (pastas.pasta). size em bytes. data = modifiedTime do Drive.
*/
CREATE TABLE IF NOT EXISTS public.arquivos_drive (
    id_empresa  int4          NOT NULL,
    id_file     varchar(100)  NOT NULL,
    id_pasta    varchar(100)  NOT NULL,
    name_file   varchar(255)  NOT NULL,
    size        int8,
    data        timestamp,
    carga       timestamp     NOT NULL DEFAULT now(),
    PRIMARY KEY (id_empresa, id_file)
);

CREATE INDEX IF NOT EXISTS ix_arquivos_drive_pasta
    ON public.arquivos_drive (id_empresa, id_pasta);
