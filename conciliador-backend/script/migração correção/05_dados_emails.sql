/*
  MIGRAÇÃO CORREÇÕES - PASSO 5: DADOS DE E-MAIL

  Carrega:
    - credenciais_emails: a conta de e-mail que envia os avisos das correções
    - correcoes_emails:   os usuários que têm acesso/recebem as correções

  Pré-requisito: 01_criacao_tabelas executado.
  Pode ser executado mais de uma vez: não duplica o que já foi carregado.

  Atenção: este arquivo contém a senha da conta de e-mail em texto. Não envie para repositórios públicos.
*/
BEGIN;

/* credenciais de e-mail: só insere se a empresa ainda não tem essa conta */
INSERT INTO public.credenciais_emails
       (id_empresa, descricao, email, smtp, pass, user_insert, user_update)
SELECT 1, 'E-mail Simionato', 'control_time@simionatoauditores.com.br', 'mail-ssl.m9.network', '%f&1czZR4#FLzYna*3vtKe', 16, 0
 WHERE NOT EXISTS (SELECT 1 FROM public.credenciais_emails
                    WHERE id_empresa = 1 AND email = 'control_time@simionatoauditores.com.br');

/* usuários com acesso às correções (a chave é empresa + usuário, então repetir é ignorado) */
INSERT INTO public.correcoes_emails
       (id_empresa, id_auditor, user_insert, user_update)
VALUES
       (1,   5, 16, 0),
       (1,  15, 16, 0),
       (1,  16, 16, 0),
       (1,  43, 16, 0),
       (1,  49, 16, 0),
       (1,  50, 16, 0),
       (1,  51, 16, 1),
       (1,  57, 16, 1),
       (1, 998, 16, 0)
ON CONFLICT (id_empresa, id_auditor) DO NOTHING;

COMMIT;
