CREATE DATABASE conciliador 
		WITH 
		OWNER = postgres 
		ENCODING = 'UTF8' 
		LC_COLLATE = 'Portuguese_Brazil.1252' 
		LC_CTYPE = 'Portuguese_Brazil.1252' 
		TABLESPACE = "Producao" 
		CONNECTION LIMIT = -1; 
GO 
/* Script Tabelas */
/* TABELA parametros  */
DROP TABLE IF EXISTS parametros;
CREATE TABLE Public.parametros (
		id_empresa int4  NOT NULL  , 
		modulo char(20)  NOT NULL  , 
		assinatura char(20)  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		parametro text  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,modulo,assinatura,id_usuario) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA empresas  */
DROP TABLE IF EXISTS empresas;
CREATE TABLE Public.empresas (
		id serial  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		razao varchar(40)  NOT NULL  , 
		fantasi varchar(40)  NOT NULL  , 
		inscri varchar(14)  NOT NULL  , 
		cadastr Date  NOT NULL  , 
		ruaf varchar(80)  NOT NULL  , 
		nrof varchar(10)  NOT NULL  , 
		complementof varchar(30)  NOT NULL  , 
		bairrof varchar(40)  NOT NULL  , 
		cidadef varchar(40)  NOT NULL  , 
		uff varchar(2)  NOT NULL  , 
		cepf char(8)  NOT NULL  , 
		tel1 varchar(23)  NOT NULL  , 
		tel2 varchar(23)  NOT NULL  , 
		email varchar(100)  NOT NULL  , 
		obs varchar(200)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA usuarios  */
DROP TABLE IF EXISTS usuarios;
CREATE TABLE Public.usuarios (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		razao varchar(40)  NOT NULL  , 
		cadastr Date  NOT NULL  , 
		rua varchar(80)  NOT NULL  , 
		nro varchar(10)  NOT NULL  , 
		complemento varchar(30)  NOT NULL  , 
		bairro varchar(40)  NOT NULL  , 
		cidade varchar(40)  NOT NULL  , 
		uf varchar(2)  NOT NULL  , 
		cep char(8)  NOT NULL  , 
		tel1 varchar(23)  NOT NULL  , 
		tel2 varchar(23)  NOT NULL  , 
		email varchar(100)  NOT NULL  , 
		obs varchar(200)  NOT NULL  , 
		senha varchar(255)  NOT NULL  , 
		grupo int4  NOT NULL  , 
		ativo char(1)  NOT NULL  , 
		trocarsenha char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA gruposusuarios  */
DROP TABLE IF EXISTS gruposusuarios;
CREATE TABLE Public.gruposusuarios (
		id_empresa int4  NOT NULL  , 
		codigo serial  NOT NULL  , 
		descricao varchar(40)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,codigo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA credenciais  */
DROP TABLE IF EXISTS credenciais;
CREATE TABLE Public.credenciais (
		id serial  NOT NULL  , 
		client_id varchar(255)  NOT NULL  , 
		client_secret varchar(255)  NOT NULL  , 
		redirect_uri varchar(255)  NOT NULL  , 
		code varchar(255)  NOT NULL  , 
		tokens varchar(255)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA pastas  */
DROP TABLE IF EXISTS pastas;
CREATE TABLE Public.pastas (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		sigla varchar(20)  NOT NULL  , 
		pasta varchar(255)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id,sigla) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA docs_gdrives  */
DROP TABLE IF EXISTS docs_gdrives;
CREATE TABLE Public.docs_gdrives (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		id_folder varchar(255)  NOT NULL  , 
		id_file varchar(255)  NOT NULL  , 
		file_name varchar(255)  NOT NULL  , 
		id_origem int4  NOT NULL  , 
		origem varchar(20)  NOT NULL  , 
		file_name_original varchar(255)  NOT NULL  , 
		status_upload char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA sim_historicos  */
DROP TABLE IF EXISTS sim_historicos;
CREATE TABLE Public.sim_historicos (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		codemp int4  NOT NULL  , 
		tipopro varchar(6)  NOT NULL  , 
		numpro int4  NOT NULL  , 
		codcli varchar(12)  NOT NULL  , 
		id_complementar int4  NOT NULL  , 
		mes int4  NOT NULL  , 
		cod_cli_sim varchar(9)  NOT NULL  , 
		datini Date  NOT NULL  , 
		datfim Date  NOT NULL  , 
		descrinvestimento text  NOT NULL  , 
		id_passo int4  NOT NULL  , 
		vltotal numeric(15,2)  NOT NULL  , 
		vlbaixado numeric(15,2)  NOT NULL  , 
		vlliberado numeric(15,2)  NOT NULL  , 
		vlparcela numeric(15,2)  NOT NULL  , 
		vltotalinvestimento numeric(15,2)  NOT NULL  , 
		vlsaldoinvestimento numeric(15,2)  NOT NULL  , 
		id_proposta int4  NOT NULL  , 
		acao_id int4  NOT NULL  , 
		alterado int4  NOT NULL  , 
		emespera int4  NOT NULL  , 
		contrato char(1)  NOT NULL  , 
		idsituacao int4  NOT NULL  , 
		workspaceid int4  NOT NULL  , 
		idtiposolicitacao int4  NOT NULL  , 
		idfluxo int4  NOT NULL  , 
		contratoexistente int4  NOT NULL  , 
		id_flag int4  NOT NULL  , 
		bodyfluxopi int4  NOT NULL  , 
		cd_origem text  NOT NULL  , 
		proposta_origem int4  NOT NULL  , 
		cidemp varchar(100)  NOT NULL  , 
		nomcli varchar(255)  NOT NULL  , 
		descrpasso text  NOT NULL  , 
		acao_descricao text  NOT NULL  , 
		status int4  NOT NULL  , 
		possuipagtonaoliberado int4  NOT NULL  , 
		possuipagtoliberado int4  NOT NULL  , 
		modoas text  NOT NULL  , 
		msg text  NOT NULL  , 
		valorsazonal numeric(15,2)  NOT NULL  , 
		id_contrato int4  NOT NULL  , 
		status_conciliador char(1)  NOT NULL  , 
		qtd_contratos int4  NOT NULL  , 
		status_assinatura char(1)  NOT NULL  , 
		status_arquivos char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA contratos_cab  */
DROP TABLE IF EXISTS contratos_cab;
CREATE TABLE Public.contratos_cab (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		nome_arquivo text  NOT NULL  , 
		pasta_arquivo text  NOT NULL  , 
		aba text  NOT NULL  , 
		qtd_linhas_total int4  NOT NULL  , 
		tamanho numeric(12,2)  NOT NULL  , 
		total_valor numeric(18,2)  NOT NULL  , 
		status char(1)  NOT NULL  , 
		processado TIMESTAMP  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,nome_arquivo,pasta_arquivo,aba) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA contratos_det  */
DROP TABLE IF EXISTS contratos_det;
CREATE TABLE Public.contratos_det (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		id_cab int4  NOT NULL  , 
		nro_linha int4  NOT NULL  , 
		id_paf int4  NOT NULL  , 
		id_sim int4  NOT NULL  , 
		id_email int4  NOT NULL  , 
		id_arker int4  NOT NULL  , 
		competencia Date  NOT NULL  , 
		base text  NOT NULL  , 
		cod_filial int4  NOT NULL  , 
		filial text  NOT NULL  , 
		cp text  NOT NULL  , 
		cod_empresa int4  NOT NULL  , 
		cod_bandeiras int4  NOT NULL  , 
		bandeiras text  NOT NULL  , 
		tipo_de_pagamento text  NOT NULL  , 
		cod_cliente text  NOT NULL  , 
		cliente text  NOT NULL  , 
		cnpj_cliente varchar(14)  NOT NULL  , 
		investimento numeric(18,2)  NOT NULL  , 
		acao text  NOT NULL  , 
		proposta text  NOT NULL  , 
		uf char(2)  NOT NULL  , 
		tipo_de_verba text  NOT NULL  , 
		tipo_doc varchar(5)  NOT NULL  , 
		dp_sic int4  NOT NULL  , 
		doc_conciliador varchar(10)  NOT NULL  , 
		pagina text  NOT NULL  , 
		modo text  NOT NULL  , 
		status char(1)  NOT NULL  , 
		status_assinatura char(1)  NOT NULL  , 
		status_arquivos char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA pafs_cab  */
DROP TABLE IF EXISTS pafs_cab;
CREATE TABLE Public.pafs_cab (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		nome_arquivo text  NOT NULL  , 
		pasta_arquivo text  NOT NULL  , 
		id_folder text  NOT NULL  , 
		id_file text  NOT NULL  , 
		file_name text  NOT NULL  , 
		qtd_paginas_total int4  NOT NULL  , 
		tamanho numeric(12,2)  NOT NULL  , 
		processado TIMESTAMP  NOT NULL  , 
		qtd_contratos INT4  NOT NULL  , 
		status char(0)  NOT NULL  , 
		total_valor numeric(18,2)  NOT NULL  , 
		status_assinatura char(1)  NOT NULL  , 
		status_arquivos char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA paf_det  */
DROP TABLE IF EXISTS paf_det;
CREATE TABLE Public.paf_det (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		id_cab int4  NOT NULL  , 
		id_contrato int4  NOT NULL  , 
		pagina int4  NOT NULL  , 
		solicitante text  NOT NULL  , 
		area text  NOT NULL  , 
		unidade text  NOT NULL  , 
		fornecedor text  NOT NULL  , 
		cnpj varchar(14)  NOT NULL  , 
		data_emissao Date  NOT NULL  , 
		vencimento Date  NOT NULL  , 
		homologacao Date  NOT NULL  , 
		centro_custo_rateio text  NOT NULL  , 
		valor_bruto numeric(18,2)  NOT NULL  , 
		valor_deposito numeric(18,2)  NOT NULL  , 
		acordo text  NOT NULL  , 
		acao text  NOT NULL  , 
		numero_documento text  NOT NULL  , 
		banco text  NOT NULL  , 
		agencia text  NOT NULL  , 
		conta_deposito text  NOT NULL  , 
		status char(1)  NOT NULL  , 
		fornecedor_site text  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA assinaturas  */
DROP TABLE IF EXISTS assinaturas;
CREATE TABLE Public.assinaturas (
		id_empresa int4  NOT NULL  , 
		id_cab int4  NOT NULL  , 
		id_sim int4  NOT NULL  , 
		id_email int4  NOT NULL  , 
		id_auditor int4  NOT NULL  , 
		id_google int4  NOT NULL  , 
		resposta varchar(1)  NOT NULL  , 
		obs varchar(255)  NOT NULL  , 
		processado TIMESTAMP  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_cab) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA auditorias  */
DROP TABLE IF EXISTS auditorias;
CREATE TABLE Public.auditorias (
		id_empresa int4  NOT NULL  , 
		id_contrato int4  NOT NULL  , 
		id serial  NOT NULL  , 
		dtacao timestamptz  NOT NULL  , 
		acao varchar(15)  NOT NULL  , 
		escopo varchar(15)  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		histo_antes text  NOT NULL  , 
		histo_atual text  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA psts_anexos  */
DROP TABLE IF EXISTS psts_anexos;
CREATE TABLE Public.psts_anexos (
		id_empresa int4  NOT NULL  , 
		id int4  NOT NULL  , 
		id_email_pst int4  NOT NULL  , 
		id_pafs_det int4  NOT NULL  , 
		acordo text  NOT NULL  , 
		nome_arquivo_pst text  NOT NULL  , 
		caminho_arquivo_pst text  NOT NULL  , 
		assunto_email text  NOT NULL  , 
		remetente_email text  NOT NULL  , 
		data_email text  NOT NULL  , 
		indice_anexo int4  NOT NULL  , 
		nome_original_anexo text  NOT NULL  , 
		nome_anexo_salvo text  NOT NULL  , 
		caminho_anexo text  NOT NULL  , 
		pasta_acordo text  NOT NULL  , 
		tamanho_anexo_bytes int4  NOT NULL  , 
		data_criacao timestamp  NOT NULL  , 
		data_atualizacao timestamp  NOT NULL  , 
		status_arquivos char(1)  NOT NULL  , 
		status_assinatura char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA psts_emails  */
DROP TABLE IF EXISTS psts_emails;
CREATE TABLE Public.psts_emails (
		id_empresa int4  NOT NULL  , 
		id int4  NOT NULL  , 
		id_pafs_det int4  NOT NULL  , 
		acordo text  NOT NULL  , 
		nome_arquivo_pst text  NOT NULL  , 
		caminho_arquivo_pst text  NOT NULL  , 
		assunto_email text  NOT NULL  , 
		remetente_email text  NOT NULL  , 
		data_email text  NOT NULL  , 
		quantidade_anexos int4  NOT NULL  , 
		data_criacao timestamp  NOT NULL  , 
		data_atualizacao timestamp  NOT NULL  , 
		status_arquivos char(1)  NOT NULL  , 
		status_assinatura char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA layouts_relatorios  */
DROP TABLE IF EXISTS layouts_relatorios;
CREATE TABLE Public.layouts_relatorios (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		layout char(100)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,layout) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA sim_acordos  */
DROP TABLE IF EXISTS sim_acordos;
CREATE TABLE Public.sim_acordos (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		id_sim int4  NOT NULL  , 
		acordo varchar(100)  NOT NULL  , 
		data_1 date   , 
		data_2 date   , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_sim,acordo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA arquivos_google  */
DROP TABLE IF EXISTS arquivos_google;
CREATE TABLE Public.arquivos_google (
		id_empresa int4  NOT NULL  , 
		pasta varchar(50)  NOT NULL  , 
		id_file varchar(255)  NOT NULL  , 
		folder_id char(255)  NOT NULL  , 
		name_file varchar(255)  NOT NULL  , 
		size char(255)  NOT NULL  , 
		data varchar(255)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_file) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.parametros RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.empresas RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.usuarios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.gruposusuarios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.credenciais RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.pastas RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.docs_gdrives RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.sim_historicos RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.contratos_cab RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.contratos_det RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.pafs_cab RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.paf_det RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.assinaturas RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.auditorias RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.psts_anexos RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.psts_emails RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.layouts_relatorios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.sim_acordos RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.arquivos_google RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.parametros ; 
GO 
DROP TABLE IF EXISTS Public.empresas ; 
GO 
DROP TABLE IF EXISTS Public.usuarios ; 
GO 
DROP TABLE IF EXISTS Public.gruposusuarios ; 
GO 
DROP TABLE IF EXISTS Public.credenciais ; 
GO 
DROP TABLE IF EXISTS Public.pastas ; 
GO 
DROP TABLE IF EXISTS Public.docs_gdrives ; 
GO 
DROP TABLE IF EXISTS Public.sim_historicos ; 
GO 
DROP TABLE IF EXISTS Public.contratos_cab ; 
GO 
DROP TABLE IF EXISTS Public.contratos_det ; 
GO 
DROP TABLE IF EXISTS Public.pafs_cab ; 
GO 
DROP TABLE IF EXISTS Public.paf_det ; 
GO 
DROP TABLE IF EXISTS Public.assinaturas ; 
GO 
DROP TABLE IF EXISTS Public.auditorias ; 
GO 
DROP TABLE IF EXISTS Public.psts_anexos ; 
GO 
DROP TABLE IF EXISTS Public.psts_emails ; 
GO 
DROP TABLE IF EXISTS Public.layouts_relatorios ; 
GO 
DROP TABLE IF EXISTS Public.sim_acordos ; 
GO 
DROP TABLE IF EXISTS Public.arquivos_google ; 
GO 
