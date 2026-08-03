/*





*/


DROP TYPE IF EXISTS status;
CREATE TYPE status AS 
(
         status_upload             text
);
go

CREATE OR REPLACE FUNCTION public.status_arquivo (
    IN _id_empresa    INT4, 
    IN _id_origem     INT4, 
    IN _origem        TEXT,
    OUT _status       TEXT
)   
AS
$$
DECLARE
    tempo    status%ROWTYPE;
   _Contador int4;
BEGIN
    
    _Contador := 0;
    _status := '1';

     FOR tempo in  
         select distinct status_upload
                    from docs_gdrives
                    where id_empresa = _id_empresa
                    and id_origem = _id_origem
                    and origem = _origem
                    
                    LOOP      
                     
                        IF ((tempo.status_upload = '0') OR (tempo.status_upload = '2')) THEN
                            _status := '2';
                        END IF;

                        _Contador := _Contador + 1;

                    END LOOP;

    IF (_Contador = 0) THEN
        _status := '0';
    END IF;
              

    RETURN;
END;
$$
LANGUAGE 'plpgsql';
go


CREATE OR REPLACE FUNCTION public.function_status01()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    DECLARE 
     __status text;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           select _status from status_arquivo(new.id_empresa,new.id_origem,new.origem) into __status;
           IF (new.origem = 'SIM') THEN
               update sim_historicos set status_arquivos = __status where id_empresa = new.id_empresa and id = new.id_origem;
           END IF;
           IF (new.origem = 'PAF') THEN
               update pafs_cab set status_arquivos = __status where id_empresa = new.id_empresa and id = new.id_origem;
           END IF;
            IF (new.origem = 'EMAIL') THEN
               update psts_anexos set status_arquivos = __status where id_empresa = new.id_empresa and id = new.id_origem;
           END IF;
           RAISE NOTICE '__status % ',__status;
           RETURN NEW;
       END IF;
       IF  (TG_OP = 'UPDATE') THEN 
           select _status from status_arquivo(new.id_empresa,new.id_origem,new.origem) into __status;
           IF (new.origem = 'SIM') THEN
               update sim_historicos set status_arquivos = __status where id_empresa = new.id_empresa and id = new.id_origem;
           END IF;
           IF (new.origem = 'PAF') THEN
               update pafs_cab set status_arquivos = __status where id_empresa = new.id_empresa and id = new.id_origem;
           END IF;
           IF (new.origem = 'EMAIL') THEN
               update psts_anexos set status_arquivos = __status where id_empresa = new.id_empresa and id = new.id_origem;
           END IF;
           RAISE NOTICE '__status % ',__status;
           RETURN NEW;
       END IF;
       IF  (TG_OP = 'DELETE') THEN 
           select _status from status_arquivo(OLD.id_empresa,OLD.id_origem,OLD.origem) into __status;
           IF (OLD.origem = 'SIM') THEN
               update sim_historicos set status_arquivos = __status where id_empresa = OLD.id_empresa and id = OLD.id_origem;
           END IF;
           IF (OLD.origem = 'PAF') THEN
               update pafs_cab set status_arquivos = __status where id_empresa = OLD.id_empresa and id = OLD.id_origem;
           END IF;
           IF (OLD.origem = 'EMAIL') THEN
               update psts_anexos set status_arquivos = __status where id_empresa = OLD.id_empresa and id = OLD.id_origem;
           END IF;
           RAISE NOTICE '__status % ',__status;
           RETURN NEW;
       END IF;
       RETURN NEW;
    END ;
    $function$
;
go
create or replace trigger trigger_docs_gdrives
    after
    insert or update or delete
    on
    public.docs_gdrives for each row execute function function_status01()



CREATE OR REPLACE FUNCTION public.function_status02()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    DECLARE 
     __status text;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           update contratos_det set status_arquivos = new.status_arquivos where id_empresa = new.id_empresa and id_sim = new.id;
           RETURN NEW;
       END IF;
       IF  (TG_OP = 'UPDATE') THEN
           update contratos_det set status_arquivos = new.status_arquivos where id_empresa = new.id_empresa and id_sim = new.id;
           RETURN NEW;
       END IF;
       RETURN NEW;
    END ;
    $function$
;
go
create or replace trigger trigger_sim_historicos
    after
    insert or update
    on
    public.sim_historicos for each row execute function function_status02()



CREATE OR REPLACE FUNCTION public.function_status03()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    DECLARE 
     __status text;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           update contratos_det set status_arquivos = new.status_arquivos where id_empresa = new.id_empresa and id_cab = new.id;
           RETURN NEW;
       END IF;
       IF  (TG_OP = 'UPDATE') THEN
           update contratos_det set status_arquivos = new.status_arquivos where id_empresa = new.id_empresa and id_cab = new.id;
           RETURN NEW;
       END IF;
       RETURN NEW;
    END ;
    $function$
;
go
create or replace trigger trigger_pafs_cab
    after
    insert or update
    on
    public.pafs_cab for each row execute function function_status03()




select _status from status_arquivo(1,54846,'SIM')


select * from docs_gdrives

select * from sim_historicos where status_arquivos = '1'

UPDATE docs_gdrives SET STATUS_UPLOAD = STATUS_UPLOAD

UPDATE SIM_HISTORICOS SET  CODEMP = CODEMP

update pafs_cab set nome_arquivo = nome_arquivo

select id,id_paf,id_sim,status_assinatura from contratos_det where status_arquivos = '1'