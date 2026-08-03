CREATE OR REPLACE FUNCTION public.function_statusassinatura()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    DECLARE 
         histo_old text;
         histo_atual text;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN

           if (new.id_cab > 0 ) then
               UPDATE pafs_cab set status_assinatura = new.resposta where  id_empresa = new.id_empresa and id = new.id_cab;
           end if;
           if (new.id_sim > 0 ) then
               UPDATE sim_historicos set status_assinatura   = new.resposta where  id_empresa = new.id_empresa and id = new.id_sim;
           end if;
           
           IF (new.user_update = 0) then
              new.user_update := new.user_insert;
           end if;
           
           histo_old   = '';
           histo_atual = json_agg(new.*);

           insert into auditorias(id_empresa,id_contrato,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_cab,NOW(),'insert','assinatura',new.id_auditor,histo_old,histo_atual,new.user_insert,0);  
		   
           RETURN NEW;
       END IF;
       IF  (TG_OP = 'UPDATE') THEN
            if (new.id_cab > 0 ) then
               UPDATE pafs_cab set status_assinatura = new.resposta where  id_empresa = new.id_empresa and id = new.id_cab;
           end if;
           if (new.id_sim > 0 ) then
               UPDATE sim_historicos set status_assinatura   = new.resposta where  id_empresa = new.id_empresa and id = new.id_sim;
           end if;
           histo_old   = json_agg(old.*);
       histo_atual = json_agg(new.*);

           insert into auditorias(id_empresa,id_contrato,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_cab,NOW(),'update','assinatura',new.id_auditor,histo_old,histo_atual,new.user_insert,0);  
		   
           RETURN NEW;
       END IF;
       IF  (TG_OP = 'DELETE') THEN
             if (old.id_cab > 0 ) then
               UPDATE pafs_cab set status_assinatura = '' where  id_empresa = old.id_empresa and id = old.id_cab;
           end if;
           if (old.id_sim > 0 ) then
               UPDATE sim_historicos set status_assinatura   = '' where  id_empresa = old.id_empresa and id = old.id_sim;
           end if;
            histo_old   = json_agg(old.*);
            histo_atual = '';
           insert into auditorias(id_empresa,id_contrato,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(old.id_empresa,old.id_cab,NOW(),'insert','assinatura',old.id_auditor,histo_old,histo_atual,old.user_insert,old.user_update);  
		   
           RETURN OLD;
       END IF;
       RETURN NEW;
    END ;
    $function$
;

go
create or replace trigger trigger_assinaturas
    after
    insert or update or delete
    on
    public.assinaturas for each row execute function function_statusassinatura()

