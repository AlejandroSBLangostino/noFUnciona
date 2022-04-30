const SQL = require("../db/connection");

const { response, request } = require("express");

const Mysql = new SQL();

const validar_Estructura_Sesion = (req) => {
  const promesa = new Promise((resolve, reject) => {
    let atributos = [];

    if (req.body["idUsuario"] === undefined) atributos.push("idUsuario");
    if (req.body["usuario"] === undefined) atributos.push("usuario");
    if (req.body["clave"] === undefined) atributos.push("clave");
    if (atributos.length > 0)
      reject({
        status: "noData",
        msj: `Los atributos ${atributos} son necesarios`,
      });
    resolve(true);
  });
  return promesa;
};

const sesiones_usuarios = (req = request, res = response) => {
  const sql = `SELECT 
                sesion.idSesion,
                              sesion.idUsuario,
                              sesion.usuario,
                              sesion.clave,
                              cat_permisos.idCatPermisos,
                              cat_permisos.nombre,
                              cat_permisos.descripcion 
                            FROM sesion
                            inner join usuario on usuario.idUsuario = sesion.idUsuario 
                            inner join usuario_sistema on usuario_sistema.idUsuarioSistema  = usuario.idUsuarioSistema
                            inner join cat_permisos on cat_permisos.idCatPermisos = usuario_sistema.idPermiso 
                WHERE sesion.estatus = 1`;

  Mysql.connection.query(sql, (error, result) => {
    if (error) throw error;
    if (result.length > 0) res.json(result);
    else
      res.json({
        error: "void",
        msg: "No se encontraron registros",
      });
  });
};

const sesiones_usuarios_desactivadas = (req = request, res = response) => {
  const sql = `SELECT 
                sesion.idSesion,
                              sesion.idUsuario,
                              sesion.usuario,
                              sesion.clave,
                              cat_permisos.idCatPermisos,
                              cat_permisos.nombre,
                              cat_permisos.descripcion 
                            FROM sesion
                            inner join usuario on usuario.idUsuario = sesion.idUsuario 
                            inner join usuario_sistema on usuario_sistema.idUsuarioSistema  = usuario.idUsuarioSistema
                            inner join cat_permisos on cat_permisos.idCatPermisos = usuario_sistema.idPermiso 
                WHERE sesion.estatus = 0`;

  Mysql.connection.query(sql, (error, result) => {
    if (error) throw error;
    if (result.length > 0) res.json(result);
    else
      res.json({
        error: "void",
        msg: "No se encontraron registros",
      });
  });
};

const sesiones_id_R = (req = request, res = response) => {
  const id = `${String(req.body.idSesion)}`;
  const sql = `SELECT 
                sesion.idSesion,
                sesion.idUsuario,
                sesion.usuario,
                sesion.clave,
                cat_permisos.idCatPermisos,
                cat_permisos.nombre,
                cat_permisos.descripcion 
              FROM sesion
              inner join usuario on usuario.idUsuario = sesion.idUsuario 
              inner join usuario_sistema on usuario_sistema.idUsuarioSistema  = usuario.idUsuarioSistema
              inner join cat_permisos on cat_permisos.idCatPermisos = usuario_sistema.idPermiso 
              WHERE idSesion = ${id} AND sesion.estatus = 1`;

  Mysql.connection.query(sql, (error, result) => {
    if (error) throw error;
    if (result.length > 0) res.json(result);
    else
      res.json({
        error: "void",
        msg: "No se encontraron registros",
      });
  });
};
const sesiones_id_R_desactivadas = (req = request, res = response) => {
  const id = `${String(req.body.idSesion)}`;
  const sql = `SELECT  sesion.idSesion,
                sesion.idUsuario,
                sesion.usuario,
                sesion.clave,
                cat_permisos.idCatPermisos,
                cat_permisos.nombre,
                cat_permisos.descripcion 
              FROM sesion
              inner join usuario on usuario.idUsuario = sesion.idUsuario 
              inner join usuario_sistema on usuario_sistema.idUsuarioSistema  = usuario.idUsuarioSistema
              inner join cat_permisos on cat_permisos.idCatPermisos = usuario_sistema.idPermiso
              WHERE idSesion = ${id} AND sesion.estatus = 0`;

  Mysql.connection.query(sql, (error, result) => {
    if (error) throw error;
    if (result.length > 0) res.json(result);
    else
      res.json({
        error: "void",
        msg: "No se encontraron registros",
      });
  });
};

const sesiones_C = async (req = request, res = response) => {
  try {
    const validar = await validar_Estructura_Sesion(req);
    if (validar) {
      const sql = `INSERT INTO sesion (idSesion, idUsuario, usuario, clave, estatus) VALUES (null, '${String(
        req.body.idUsuario
      )}', '${String(req.body.usuario)}', '${String(req.body.clave)}', 1)`;
      Mysql.connection.query(sql, (error, result) => {
        if (error) {
          res.status(400).json({
            status: "dataBaseError",
            msg: "Hubo un error interno en la base de datos",
            error:{
              name_error : error.code,
              code_error: error.errno
            }
          });
        } else {
          res.status(200).json({ status: "OK", msg: "Sesion creada con exito" });
        }
      });
    }
  } catch (error) {
    throw error;
  }
};

const sesiones_D = (req = request, res = response) => {
  const id = `${String(req.body.idSesion)}`;
  const sql = `UPDATE sesion SET estatus = 1 WHERE idSesion = ${id}`;
  Mysql.connection.query(sql, (error, result) => {
    if (error) {
      res.status(400).json({
        status: "dataBaseError",
        msg: "Hubo un error interno en la base de datos",
        error: {
          name_error : error.code,
          code_error: error.errno
        }
      });
    } else {
      if(result.affectedRows === 0){
        return res.status(400).json({
          status: "dataBaseException",
          msg: "No se encontro el registo",
          result: {
            db_msg: result.message
          }
        });
      }
      res.status(200).json({ status: "OK", msg: "Sesion eliminada con exito" });
    }
  });
};

const sesiones_U = (req = request, res = response) => {
  const idS = `${String(req.body.idSesion)}`;
  if (idS != undefined && req.body.estatus != undefined && typeof req.body.estatus === 'number' ) {
    const sql = `UPDATE sesion SET usuario = '${String(req.body.usuario)}', clave = '${String(req.body.clave)}', estatus = ${parseInt(req.body.estatus)} WHERE idSesion = ${idS}`;
    Mysql.connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({
          status: "dataBaseError",
          msg: "Hubo un error interno en la base de datos",
          error: {
            name_error : error.code,
            code_error: error.errno
          }
        });
      } else {
        res.status(200).json({ status: "OK", msg: "Sesion actualizada con exito" });
      }
    });
  } else {
    res.json({
      status: "noData",
      msg: "El atributo idSesion y estatus son necesarios",
    });
  }
};

module.exports = {
  sesiones_usuarios,
  sesiones_C,
  sesiones_id_R,
  sesiones_D,
  sesiones_U,
  sesiones_usuarios_desactivadas,
  sesiones_id_R_desactivadas
};
