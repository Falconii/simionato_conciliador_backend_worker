alter table assinaturas add column upload_cliente char(1) default '0'
alter table assinaturas add column old_obs        varchar(255) default ''