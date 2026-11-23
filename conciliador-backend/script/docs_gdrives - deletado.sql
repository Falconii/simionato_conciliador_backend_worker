/*
  Exclusão lógica de arquivos: o arquivo continua no Google Drive e em docs_gdrives, só fica marcado como excluído
  (a tela de documentos mostra "(EXCLUÍDO)" e quem é executor de uma ação de Exclusão De Arquivos pendente pode
  excluir e restaurar). Os registros existentes ficam como não excluídos.
*/
ALTER TABLE public.docs_gdrives
    ADD COLUMN IF NOT EXISTS deletado boolean NOT NULL DEFAULT false;
