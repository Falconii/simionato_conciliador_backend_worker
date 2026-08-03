/* SERVICE usuarios */
const usuarioData = require("../../shared/data/usuarioData");
const validacao = require("../../shared/util/validacao");
const parametros = require("../../shared/util/usuarioParametros");
const erroDB = require("../../shared/util/userfunctiondb");
const regras = require("../../shared/util/usuarioRegra");
const TABELA = "USUARIOS";
/* CRUD GET SERVICE */
exports.getUsuario = async function (id_empresa, id) {
  return usuarioData.getUsuario(id_empresa, id);
};
/* CRUD GET ALL SERVICE */
exports.getUsuarios = async function (params) {
  return usuarioData.getUsuarios(params);
};
//* CRUD - INSERT - SERVICE */
exports.insertUsuario = async function (usuario) {
  try {
    await regras.usuario_Inclusao(usuario);
    validacao.Validacao(TABELA, usuario, parametros.usuarios());
    return usuarioData.insertUsuario(usuario);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};
//* CRUD - UPDATE - SERVICE */
exports.updateUsuario = async function (usuario) {
  try {
    await regras.usuario_Alteracao(usuario);
    validacao.Validacao(TABELA, usuario, parametros.usuarios());
    return usuarioData.updateUsuario(usuario);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};

exports.updateUsuarioAtivo = async function (usuario) {
  try {
    await regras.usuario_Alteracao(usuario);
    validacao.Validacao(TABELA, usuario, parametros.usuarios());
    return usuarioData.updateUsuarioAtivo(usuario);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};

//* CRUD - DELETE - SERVICE */
exports.deleteUsuario = async function (id_empresa, id) {
  try {
    await regras.usuario_Exclusao(id_empresa, id);
    return usuarioData.deleteUsuario(id_empresa, id);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};

exports.updatesenhaUsuario = async function (
  id_empresa,
  id_usuario,
  senha,
  reciclar,
) {
  try {
    return usuarioData.updatesenhaUsuario(
      id_empresa,
      id_usuario,
      senha,
      reciclar,
    );
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};
