CREATE OR REPLACE FUNCTION get_ano_trimestre(dt DATE)
RETURNS TEXT AS $$
DECLARE
    ano INTEGER;
    trimestre INTEGER;
BEGIN
    ano := EXTRACT(YEAR FROM dt);
    trimestre := CEIL(EXTRACT(MONTH FROM dt) / 3.0);

    RETURN ano || '-T' || trimestre;
END;
$$ LANGUAGE plpgsql;
