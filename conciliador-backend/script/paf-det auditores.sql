CREATE OR REPLACE FUNCTION public.function_auditores_paf_det()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    DECLARE 
         histo_old text;
         histo_atual text;
    BEGIN
       IF  (TG_OP = 'UPDATE') THEN
           UPDATE pafs_cab set total_valor = (total_valor - old.valor_bruto) + new.valor_bruto where  id_empresa = new.id_empresa and id = new.id_cab;
           histo_old   = json_agg(old.*);
       histo_atual = json_agg(new.*);

           insert into auditorias(id_empresa,id_contrato,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id,NOW(),'update','paf-det',new.user_update,histo_old,histo_atual,new.user_insert,new.user_update);  
		   
           RETURN NEW;
       END IF;
       RETURN NEW;
    END ;
    $function$
;

go
create or replace trigger trigger_paf_det
    after
    insert or update or delete
    on
    public.paf_det for each row execute function function_auditores_paf_det()

