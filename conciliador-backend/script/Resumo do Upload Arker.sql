select case 
	       when dg.status_upload  = '0'  then  'Não Processando!'
	       when dg.status_upload = '1'  then  'Upload Executado Com Sucesso'
	       when dg.status_upload = '2'  then  'Falha No Upload'
	       else                               'Sem Definição'
       end as status_upload 
       , count(*) as total
from docs_gdrives dg
where dg.origem = 'ARKER'
group by case 
	       when dg.status_upload = '0'  then  'Não Processando!'
	       when dg.status_upload = '1'  then  'Upload Executado Com Sucesso'
	       when dg.status_upload = '2'  then  'Falha No Upload'
	       else                               'Sem Definição'
       end


select case 
	       when a.status_arquivos   = '0'  then  'Não Processando!'
	       when a.status_arquivos = '1'  then  'Upload Executado Com Sucesso'
	       when a.status_arquivos = '2'  then  'Falha No Upload'
	       else                               'Sem Definição'
       end as status_upload
       , count(*) as total
from arkers a 
group by case 
	       when a.status_arquivos = '0'  then  'Não Processando!'
	       when a.status_arquivos = '1'  then  'Upload Executado Com Sucesso'
	       when a.status_arquivos = '2'  then  'Falha No Upload'
	       else                                'Sem Definição'
       end


