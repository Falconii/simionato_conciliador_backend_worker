//anexos
alter table public.psts_anexos add column id_empresa int4 not null default 1;
go
alter table public.psts_anexos add column status_assinatutura char(1) default ''
go
alter table public.psts_anexos add column status_arquivos char(1) default '';
go

//public.psts_emails
alter table public.psts_emails add column id_empresa int4 not null default 1;
go
alter table public.psts_emails add column status_arquivos char(1) default '';
go
alter table public.psts_emails add column status_assinatura char(1) default '';
go
alter table public.psts_emails add column user_insert int4 default 0;
go
alter table public.psts_emails add column user_update int4 default 0;

