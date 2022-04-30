const SQL = require("../db/connection");

const { response, request } = require("express");
const { generateJWT } = require("../helpers/generate-jwt");

const Mysql = new SQL();

const login =(req, res = response) => {

    if (req.body["Usuario"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'Usuario' es necesario"
        });
    }
    if (req.body["Password"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'Password' es necesario"
        });
    }

    //const sql = `select * from sesion s where estatus = 1 and usuario = '${req.body["Usuario"]}' and clave = '${req.body["Password"]}'`;
    const sql = `select s.*, u.idCliente, u.idCandidato , u.idLaboratorio , u.idUsuarioSistema,
    (select us.idPermiso  from usuario_sistema us where us.idUsuarioSistema = u.idUsuario) as permiso
    from sesion s
    inner join usuario u on u.idUsuario = s.idUsuario 
    where s.estatus = 1 
    and s.usuario = '${req.body["Usuario"]}' and s.clave = '${req.body["Password"]}'`;

    Mysql.connection.query(sql, async(error, result) => {
        if (error){
            res.status(400).json({
                status: "dataBaseError",
                msg: "Hubo un error interno en la base de datos",
                error: {
                  name_error : error.code,
                  code_error: error.errno
                }
            });
        }
        if (result.length > 0) {
            try {
                //Generar JWT
                const token = await generateJWT(result[0].idUsuario, result[0].idSesion);
                res.json({
                    id: result[0].idUsuario,
                    usuario: result[0].usuario,
                    sesion: result[0].idSesion,
                    idCliente: result[0].idCliente,
                    idCandidato: result[0].idCandidato,
                    idLaboratorio: result[0].idLaboratorio,
                    idUsuarioSistema: result[0].idUsuarioSistema,
                    permiso: result[0].permiso,
                    token
                });
            } catch (error) {
                console.log(error);
                res.json({
                    status: 'errorToken',
                    msg: error
                });
            }
        } else {
            res.json({
                status: 'invalidAutentication',
                msg: 'Credenciales invalidas'
            });
        }
    });
}

module.exports = {
    login
  };