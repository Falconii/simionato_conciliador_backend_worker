CREATE OR REPLACE FUNCTION public.contador_db_files (
    IN _id_sim    INT4,
    OUT _TOTAL    INT4
)   
AS
$$
DECLARE

BEGIN
    SELECT COUNT(*) FROM  docs_gdrives dg INTO _TOTAL 
       WHERE DG.id_empresa = 1
       AND DG.origem = 'SIM' 
       AND DG.id_origem = _id_sim;
    IF (_TOTAL IS NULL) THEN 
       _TOTAL := 0;
    END IF ;
END;
$$
LANGUAGE 'plpgsql';
go



CREATE OR REPLACE FUNCTION public.contador_db_one_drive (
    IN _codemp    INT4,
    IN _proposta  INT4,
    OUT _TOTAL    INT4
)   
AS
$$
DECLARE

BEGIN
    SELECT COUNT(*) FROM arquivos_sim odrive INTO _TOTAL
      WHERE odrive.codemp = _codemp
      AND odrive.proposta = _proposta;
    IF (_TOTAL IS NULL) THEN 
       _TOTAL := 0;
    END IF ;
END;
$$
LANGUAGE 'plpgsql';
go

