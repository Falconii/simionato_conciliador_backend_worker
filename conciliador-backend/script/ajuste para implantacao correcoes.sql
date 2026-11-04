
 /* 0-Não iniciado, 2-Concluído , 3-Falha , 4-Salvo */
/* TABELA cab_correcoes  */
DROP TABLE IF EXISTS cab_correcoes;
CREATE TABLE Public.cab_correcoes (
		id_empresa int4  NOT NULL  ,
		id serial  NOT NULL  ,
		cadastr Date  NOT NULL  ,
		tarefa varchar(255)  NOT NULL  ,
		origem varchar(10)  NOT NULL  ,
		id_origem int4  NOT NULL  ,
		id_exec int4  NOT NULL  ,
		id_sol int4  NOT NULL  ,
		status char(1)  NOT NULL  ,
		status_assinatura_gp char(1) NOT NULL,
		status_assinatura_cliente char(1) NOT NULL,
		id_aguardando_resposta int4  NOT NULL  DEFAULT 0 ,
		user_insert int4  NOT NULL  ,
		user_update int4  NOT NULL  ,
		PRIMARY KEY(id_empresa,id)
)
 WITHOUT OIDS
 TABLESPACE "Producao"
 GO
/* uma correção por origem (documento do SIM) */
CREATE UNIQUE INDEX ux_cab_correcoes_origem ON Public.cab_correcoes (id_empresa, origem, id_origem)
 GO
/* TABELA det_correcoes  */
DROP TABLE IF EXISTS det_correcoes;
CREATE TABLE Public.det_correcoes (
		id_empresa int4  NOT NULL  ,
		id serial  NOT NULL  ,
		id_cab int4  NOT NULL  ,
		mensagem text  NOT NULL  ,
		data timestamp  NOT NULL  ,
		id_auditor int4  NOT NULL  DEFAULT 0 ,
		status char(1)  NOT NULL  ,
		user_insert int4  NOT NULL  ,
		user_update int4  NOT NULL  ,
		PRIMARY KEY(id_empresa,id)
)
 WITHOUT OIDS
 TABLESPACE "Producao"
 GO
/* TABELA credenciais_emails  */
DROP TABLE IF EXISTS credenciais_emails;
CREATE TABLE Public.credenciais_emails (
		id_empresa int4  NOT NULL  ,
		id serial  NOT NULL  ,
		descricao varchar(60)  NOT NULL  ,
		email varchar(150)  NOT NULL  ,
		smtp varchar(150)  NOT NULL  ,
		pass varchar(150)  NOT NULL  ,
		user_insert int4  NOT NULL  ,
		user_update int4  NOT NULL  ,
		PRIMARY KEY(id_empresa,id)
)
 WITHOUT OIDS
 TABLESPACE "Producao"
 GO
/* TABELA correcoes_emails  */
DROP TABLE IF EXISTS correcoes_emails;
CREATE TABLE Public.correcoes_emails (
		id_empresa int4  NOT NULL  ,
		id serial  NOT NULL  ,
		id_auditor int4  NOT NULL  ,
		user_insert int4  NOT NULL  ,
		user_update int4  NOT NULL  ,
		PRIMARY KEY(id_empresa,id_auditor)
)
 WITHOUT OIDS
 TABLESPACE "Producao"
 GO
/* TABELA acoes_correcoes  */
DROP TABLE IF EXISTS acoes_correcoes;
CREATE TABLE Public.acoes_correcoes (
		id_empresa int4  NOT NULL  ,
		id_cab_correcoes int4  NOT NULL  ,
		id serial  NOT NULL  ,
		id_auditor int4  NOT NULL  ,
		id_exec int4  ,
		inicio timestamp  NOT NULL  ,
		final timestamp  ,
		descricao varchar(100)  NOT NULL  ,
		flag_acao char(1)  NOT NULL  ,
		id_docs_gdrives int4  NOT NULL  DEFAULT 0 ,
		status char(1)  NOT NULL  ,
		user_insert int4  NOT NULL  ,
		user_update int4  NOT NULL  ,
		PRIMARY KEY(id_empresa,id)
)
 WITHOUT OIDS
 TABLESPACE "Producao"
 GO

  //credencias e-amils
 INSERT INTO Public.credenciais_emails
  (id_empresa, descricao, email, smtp, pass, user_insert, user_update)
  VALUES
  (1, 'E-mail Simionato', 'control_time@simionatoauditores.com.br', 'mail-ssl.m9.network', '%f&1czZR4#FLzYna*3vtKe', 16, 0);
  
  
 //emails dos usuarios com acesso as correções
 INSERT INTO Public.correcoes_emails
  (id_empresa, id_auditor, user_insert, user_update)
VALUES
  (1,  5, 16, 0),
  (1, 15, 16, 0),
  (1, 16, 16, 0),
  (1, 43, 16, 0),
  --(1, 49, 16, 0),
  --(1, 50, 16, 0),
  --(1, 51, 16, 1),
  --(1, 57, 16, 1),
  (1,998, 16, 0);


UPDATE assinaturas
   SET resposta = CASE WHEN btrim(obs) <> '' THEN 'N' ELSE 'S' END
 WHERE id_sim > 0
   AND resposta <> CASE WHEN btrim(obs) <> '' THEN 'N' ELSE 'S' END;
   
CREATE OR REPLACE FUNCTION migra_assinaturas_para_correcoes(p_id_empresa int4, p_ano text)
RETURNS int4
LANGUAGE plpgsql
AS $$
DECLARE
    r        record;
    v_cab    int4;
    v_gp     char(1);
    v_cli    char(1);
    v_total  int4 := 0;
BEGIN
    FOR r IN
        SELECT sim.id_empresa
             , sim.id            AS id_sim
             , ass.id_auditor
             , ass.processado
             , trim(ass.obs)     AS obs
          FROM sim_historicos sim
         INNER JOIN assinaturas ass ON ass.id_empresa = sim.id_empresa AND ass.id_sim = sim.id AND trim(ass.obs) <> ''
         INNER JOIN usuarios resp   ON resp.id_empresa = sim.id_empresa AND resp.id = ass.id_auditor
         WHERE sim.id_empresa = p_id_empresa
           AND trim(sim.descrpasso) = 'Aprovada'
           AND trim(sim.modoas) = 'Ação Pontual'
           AND to_char(sim.datini, 'YYYY') = p_ano
           AND sim.status_arquivos = '1'
           AND ass.resposta = 'N'
           AND NOT EXISTS (SELECT 1 FROM cab_correcoes c
                            WHERE c.id_empresa = sim.id_empresa AND c.origem = 'SIM' AND c.id_origem = sim.id)
         ORDER BY sim.id_empresa, sim.codemp, sim.numpro
    LOOP
        v_gp  := CASE WHEN upper(r.obs) LIKE '%ASSINATURA APENAS DO CLIENTE%' THEN 'N' ELSE 'S' END;
        v_cli := CASE WHEN upper(r.obs) LIKE '%ASSINATURA APENAS DA GP%'      THEN 'N' ELSE 'S' END;

        INSERT INTO cab_correcoes
               (id_empresa, cadastr, tarefa, origem, id_origem, id_exec, id_sol, status,
                status_assinatura_gp, status_assinatura_cliente, user_insert, user_update)
        VALUES (r.id_empresa, r.processado::date, r.obs, 'SIM', r.id_sim, 0, r.id_auditor, '0',
                v_gp, v_cli, r.id_auditor, r.id_auditor)
        RETURNING id INTO v_cab;

        /* as colunas de assinatura de det_correcoes são NOT NULL sem default na tabela atual;
           se forem removidas dela, tirar as duas daqui */
        INSERT INTO det_correcoes
               (id_empresa, id_cab, mensagem, data, id_auditor, status,
                status_assinatura_cliente, status_assinatura_gp, user_insert, user_update)
        VALUES (r.id_empresa, v_cab, r.obs, r.processado, r.id_auditor, '0',
                v_cli, v_gp, r.id_auditor, r.id_auditor);

        v_total := v_total + 1;
    END LOOP;

    RETURN v_total;
END;
$$;


SELECT migra_assinaturas_para_correcoes(1, '2019');  -- devolve quantas correções criou (esperado: 496)
