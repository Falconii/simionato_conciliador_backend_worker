    alter table sim_historicos add column vlr_acordos_pdf numeric(15,2) not null default 0;
    go
    alter table sim_historicos add column qtd_acordos_pdf int4 not null default 0;
    go
    
 CREATE OR REPLACE FUNCTION public.function_sim_acordos()
 RETURNS trigger
 LANGUAGE plpgsql
 AS $function$
    DECLARE 
         histo_old text;
         histo_atual text;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
       
            UPDATE sim_historicos set 
            vlr_acordos_pdf = vlr_acordos_pdf + new.vlr_acordo_pdf,
            qtd_acordos_pdf = qtd_acordos_pdf + 1 
            where  id_empresa = new.id_empresa and id = new.id_sim;
           
           IF (new.user_update = 0) then
              new.user_update := new.user_insert;
           end if;
           
           histo_old   = '';
           histo_atual = json_agg(new.*);

           insert into auditorias(id_empresa,id_contrato,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_sim,NOW(),'insert','acordo',new.user_insert,histo_old,histo_atual,new.user_insert,0);  
		   
           RETURN NEW;
       END IF;
       
       IF  (TG_OP = 'UPDATE') THEN
       
           UPDATE sim_historicos set 
           vlr_acordos_pdf = (vlr_acordos_pdf - old.vlr_acordo_pdf) + new.vlr_acordo_pdf,
           qtd_acordos_pdf = (qtd_acordos_pdf - 1) + 1
           where  id_empresa = new.id_empresa and id = new.id_sim;
           
           IF (new.user_update = 0) then
              new.user_update := new.user_insert;
           end if;
           
           histo_old   = '';
           histo_atual = json_agg(new.*);

           insert into auditorias(id_empresa,id_contrato,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_sim,NOW(),'insert','acordo',new.user_update,histo_old,histo_atual,new.user_insert,0);  
		   
           RETURN NEW;
                  
       END IF;
       IF  (TG_OP = 'DELETE') THEN
 
           UPDATE sim_historicos 
           set vlr_acordos_pdf = vlr_acordos_pdf - old.vlr_acordo_pdf,
               qtd_acordos_pdf = qtd_acordos_pdf - 1
           where  id_empresa = old.id_empresa and id = old.id_sim;
           
           IF (new.user_update = 0) then
              new.user_update := new.user_insert;
           end if;
           
           histo_old   = '';
           histo_atual = json_agg(new.*);

           insert into auditorias(id_empresa,id_contrato,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(old.id_empresa,old.id_sim,NOW(),'insert','acordo',old.user_update,histo_old,histo_atual,old.user_insert,0);  
           RETURN OLD;
       END IF;
       RETURN NEW;
    END ;
    $function$
;

go
create or replace trigger trigger_sim_acordos
    after
    insert or update or delete
    on
    public.sim_acordos for each row execute function function_sim_acordos()
