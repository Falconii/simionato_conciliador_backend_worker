/*
  MIGRAÇÃO CORREÇÕES - PASSO 1: TABELAS

  Cria as tabelas do módulo de correções.
  Pode ser executado mais de uma vez: só cria o que ainda não existe.
  NÃO apaga nenhuma tabela e NÃO altera tabelas existentes.

  Executar de uma vez só (é uma transação). Se der erro, nada é gravado.
  Depois deste, executar 02_criacao_indices.sql.
*/
BEGIN;

/* ---------------------------------------------------------------
   1. cab_correcoes - cabeçalho da correção (uma por documento do SIM)
      status: 0 Não Enviado, 1 Aguardando Executor, 2 Em Andamento,
              3 Correção Aceita - Aguardando Ação, 9 Encerrada
      id_aguardando_resposta: usuário oposto ao autor da última mensagem (mantido pelo sistema)
   --------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS public.cab_correcoes (
    id_empresa                 int4         NOT NULL,
    id                         serial       NOT NULL,
    cadastr                    date         NOT NULL,
    tarefa                     varchar(255) NOT NULL,
    origem                     varchar(10)  NOT NULL,
    id_origem                  int4         NOT NULL,
    id_exec                    int4         NOT NULL,
    id_sol                     int4         NOT NULL,
    status                     char(1)      NOT NULL,
    status_assinatura_gp       char(1)      NOT NULL,
    status_assinatura_cliente  char(1)      NOT NULL,
    id_aguardando_resposta     int4         NOT NULL DEFAULT 0,
    user_insert                int4         NOT NULL,
    user_update                int4         NOT NULL,
    PRIMARY KEY (id_empresa, id)
);

/* ---------------------------------------------------------------
   2. det_correcoes - mensagens da correção (chat)
   --------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS public.det_correcoes (
    id_empresa   int4      NOT NULL,
    id           serial    NOT NULL,
    id_cab       int4      NOT NULL,
    mensagem     text      NOT NULL,
    data         timestamp NOT NULL,
    id_auditor   int4      NOT NULL DEFAULT 0,
    status       char(1)   NOT NULL,
    user_insert  int4      NOT NULL,
    user_update  int4      NOT NULL,
    PRIMARY KEY (id_empresa, id)
);

/* ---------------------------------------------------------------
   3. acoes_correcoes - ações que não se resolvem por mensagem
      flag_acao: 1 = Upload De Arquivos, 2 = Exclusão De Arquivos
      status:    1 = Pendente, 2 = Executada
   --------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS public.acoes_correcoes (
    id_empresa        int4         NOT NULL,
    id_cab_correcoes  int4         NOT NULL,
    id                serial       NOT NULL,
    id_auditor        int4         NOT NULL,
    id_exec           int4,
    inicio            timestamp    NOT NULL,
    final             timestamp,
    descricao         varchar(100) NOT NULL,
    flag_acao         char(1)      NOT NULL,
    id_docs_gdrives   int4         NOT NULL DEFAULT 0,
    status            char(1)      NOT NULL,
    user_insert       int4         NOT NULL,
    user_update       int4         NOT NULL,
    PRIMARY KEY (id_empresa, id)
);

/* ---------------------------------------------------------------
   4. credenciais_emails - conta de e-mail usada para enviar os avisos
      (não confundir com a tabela credenciais, que guarda o acesso ao Google Drive)
   --------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS public.credenciais_emails (
    id_empresa   int4         NOT NULL,
    id           serial       NOT NULL,
    descricao    varchar(60)  NOT NULL,
    email        varchar(150) NOT NULL,
    smtp         varchar(150) NOT NULL,
    pass         varchar(150) NOT NULL,
    user_insert  int4         NOT NULL,
    user_update  int4         NOT NULL,
    PRIMARY KEY (id_empresa, id)
);

/* ---------------------------------------------------------------
   5. correcoes_emails - usuários que recebem os avisos das correções
   --------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS public.correcoes_emails (
    id_empresa   int4   NOT NULL,
    id           serial NOT NULL,
    id_auditor   int4   NOT NULL,
    user_insert  int4   NOT NULL,
    user_update  int4   NOT NULL,
    PRIMARY KEY (id_empresa, id_auditor)
);

COMMIT;
