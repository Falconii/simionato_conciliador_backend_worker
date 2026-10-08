DROP INDEX IF EXISTS idx_unico_id_cab;
DROP INDEX IF EXISTS idx_unico_id_sim;
DROP INDEX IF EXISTS idx_unico_id_email;
  
                         
                         
CREATE UNIQUE INDEX idx_unico_id_cab
ON assinaturas (id_empresa,id_cab)
WHERE id_cab <> 0;

CREATE UNIQUE INDEX idx_unico_id_sim
ON assinaturas (id_empresa,id_sim)
WHERE id_sim <> 0;

CREATE UNIQUE INDEX idx_unico_id_email
ON assinaturas (id_empresa,id_email)
WHERE id_email <> 0;
