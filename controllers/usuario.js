const SQL = require('../db/connection');
const { response, request } = require('express');

const Mysql = new SQL();

//Funciones de apoyo
const Validar_Usuario_Activo = (id) => { //Valida que el usuario este activo
    const promesa = new Promise((resolve, reject) => {
        const sqlValidator = `select * from usuario where estatus = 1 and idUsuario = ${id}`
        Mysql.connection.query(sqlValidator, (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
                resolve(true);
            } else {
                reject({
                    status: 'invalidAction',
                    msg: 'El registro esta desactivado o no se encontro'
                });
            }
        });
    });
    return promesa;
};

const Validar_Usuario_Desactivado = (id) => { //Valida que el usuario este desactivado
    const promesa = new Promise((resolve, reject) => {
        const sqlValidator = `select * from usuario where estatus = 0 and idUsuario = ${id}`
        Mysql.connection.query(sqlValidator, (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
                resolve(true);
            } else {
                reject({
                    status: 'invalidAction',
                    msg: 'El registro esta activado o no se encontro'
                });
            }
        });
    });
    return promesa;
};

const Validar_Usuario_Estructura = (req) => {
    const promesa = new Promise((resolve, reject) => {
        let atributos = [];
        if (req.body["permiso"] === undefined)
            atributos.push('permiso');
        if (req.body["idUsuario"] === undefined)
            atributos.push('idUsuario');
        if (req.body["idCliente"] === undefined)
            atributos.push('idCliente');
        if (req.body["idCandidato"] === undefined)
            atributos.push('idCandidato');
        if (req.body["idLaboratorio"] === undefined)
            atributos.push('idLaboratorio');
        if (req.body["idUsuarioSistema"] === undefined)
            atributos.push('idUsuarioSistema');
        if (req.body["nombre"] === undefined)
            atributos.push('nombre');
        if (req.body["apellidoPaterno"] === undefined)
            atributos.push('apellidoPaterno');
        if (req.body["apellidoMaterno"] === undefined)
            atributos.push('apellidoMaterno');
        if (req.body["telefono"] === undefined)
            atributos.push('telefono');
        if (req.body["telefonoAlternativo"] === undefined)
            atributos.push('telefonoAlternativo');
        if (req.body["correo"] === undefined)
            atributos.push('correo');
        if (req.body["calle"] === undefined)
            atributos.push('calle');
        if (req.body["numInterior"] === undefined)
            atributos.push('numInterior');
        if (req.body["numExterior"] === undefined)
            atributos.push('numExterior');
        if (req.body["calleCruza1"] === undefined)
            atributos.push('calleCruza1');
        if (req.body["calleCruza1"] === undefined)
            atributos.push('calleCruza1');
        if (req.body["estado"] === undefined)
            atributos.push('estado');
        if (req.body["municipio"] === undefined)
            atributos.push('municipio');
        if (req.body["cp"] === undefined)
            atributos.push('cp');
        if (atributos.length > 0)
            reject({
                status: 'noData',
                msj: `Los atributos ${atributos} son necesarios`
            });
        resolve(true);
    });
    return promesa;
};

const Crear_Usuario_Sistema = (permiso) => {
    const promesa = new Promise((resolve, reject) => {
        const sql = `INSERT INTO usuario_sistema (idUsuarioSistema, idPermiso) VALUES (null,${permiso})`;
        Mysql.connection.query(sql, (error, result) => {
            if (error)
                reject({
                    status: 'dataBaseError',
                    msg: 'Hubo un error interno en la base de datos',
                    dberror: error.errno
                });
            if (result) {
                resolve(result.insertId);

            }

        });
    });
    return promesa;
};

const Borrar_Usuario_Sistema = (id) => {
    const sql = `DELETE FROM usuario_sistema WHERE idUsuariSistema = ${id}`;
    Mysql.connection.query(sql, (error, result) => {
        if (error)
            return {
                status: 'dataBaseError',
                msg: 'Hubo un error interno en la base de datos',
                dberror: error.errno
            };
        return ('OK');
    });
};

const Crear_Usuario = (req) => {
    const promesa = new Promise(async(resolve, reject) => {
        try {
            const validarEstructura = await Validar_Usuario_Estructura(req);
            if (validarEstructura) {
                const idUsuarioSistema = await Crear_Usuario_Sistema(req.body.permiso);
                const sql = `INSERT INTO usuario VALUES ( null, null, null, null, ${parseInt(idUsuarioSistema)}, '${String(req.body.nombre)}', '${String(req.body.apellidoPaterno)}', '${String(req.body.apellidoMaterno)}', '${String(req.body.telefono)}', '${String(req.body.telefonoAlternativo)}', '${String(req.body.correo)}', '${String(req.body.calle)}', ${parseInt(req.body.numInterior)}, ${parseInt(req.body.numExterior)}, '${String(req.body.calleCruza1)}', '${String(req.body.calleCruza2)}', '${String(req.body.estado)}', '${String(req.body.municipio)}', ${parseInt(req.body.cp)}, 1 )`;
                Mysql.connection.query(sql, (error, result) => {
                    if (error) {
                        Borrar_Usuario_Sistema(idUsuarioSistema);
                        reject({
                            status: 'dataBaseError',
                            msg: 'Hubo un error interno en la base de datos',
                            dberror: error
                        });
                    } else {
                        resolve({ status: 'OK', msg: 'Usuario creado con exito' });
                    }
                });
            }
        } catch (error) {
            reject(error);
        }

    });
    return promesa;
};

const Modificar_Usuario = async(req) => {
    const promesa = new Promise(async(resolve, reject) => {
        try {
            const validarEstructura = await Validar_Usuario_Estructura(req);
            if (validarEstructura) {
                const sql = `UPDATE usuario u INNER JOIN usuario_sistema us ON u.idUsuarioSistema = us.idUsuarioSistema SET us.idPermiso = ${parseInt(req.body.permiso)}, u.nombre = '${String(req.body.nombre)}', u.apellidoPaterno = '${String(req.body.apellidoPaterno)}', u.apellidoMaterno = '${String(req.body.apellidoMaterno)}', u.telefono = '${String(req.body.telefono)}', u.telefonoAlternativo = '${String(req.body.telefonoAlternativo)}', u.correo = '${String(req.body.correo)}', u.calle = '${String(req.body.calle)}', u.numInterior = ${parseInt(req.body.numInterior)}, u.numExterior = ${parseInt(req.body.numExterior)}, u.calleCruza1 = '${String(req.body.calleCruza1)}', u.calleCruza2 = '${String(req.body.calleCruza2)}', u.estado = '${String(req.body.estado)}', u.municipio = '${String(req.body.municipio)}', u.cp = ${parseInt(req.body.cp)} WHERE u.idUsuario = ${parseInt(req.body.idUsuario)} and idCliente is null and idCandidato is null and idLaboratorio is null`;
                Mysql.connection.query(sql, (error, result) => {
                    if (error) {
                        reject({
                            status: 'dataBaseError',
                            msg: 'Hubo un error interno en la base de datos',
                            dberror: error
                        });
                    } else {
                        if (result.affectedRows > 0)
                            resolve({ status: 'OK', msg: 'Usuario modificado con exito' });
                        else
                            reject({ status: 'void', msg: 'No se encontraron registros' });
                    }
                });
            }
        } catch (error) {
            reject(error);
        }
    });
    return promesa;
};

//Lista de todos los usuarios del sistema activos
const Usuario_Activos_R = (req = request, res = response) => {
    const sql = `select
	u.idUsuario,
	u.idUsuarioSistema,
	us.idPermiso,
	cp.nombre as nombre_permiso,
	cp.descripcion,
	u.nombre,
	u.apellidoPaterno,
	u.apellidoMaterno,
	u.telefono,
	u.telefonoAlternativo,
	u.correo,
	u.calle,
	u.numInterior,
	u.numExterior,
	u.calleCruza1,
	u.calleCruza2,
	u.estado,
	u.municipio,
	u.cp,
	u.estatus
    from usuario u
    inner join usuario_sistema us on us.idUsuarioSistema = u.idUsuarioSistema
    inner join cat_permisos cp on cp.idCatPermisos = us.idPermiso 
    where u.estatus = 1`;

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json({
                status: 'void',
                msg: 'No se encontraron registros'
            });
        }
    });
};
//Lista de todos los usuarios del sistema inactivos
const Usuario_Inactivos_R = (req = request, res = response) => {
    const sql = `select
	u.idUsuario,
	u.idUsuarioSistema,
	us.idPermiso,
	cp.nombre as nombre_permiso,
	cp.descripcion,
	u.nombre,
	u.apellidoPaterno,
	u.apellidoMaterno,
	u.telefono,
	u.telefonoAlternativo,
	u.correo,
	u.calle,
	u.numInterior,
	u.numExterior,
	u.calleCruza1,
	u.calleCruza2,
	u.estado,
	u.municipio,
	u.cp,
	u.estatus
    from usuario u
    inner join usuario_sistema us  on us.idUsuarioSistema = u.idUsuarioSistema
    inner join cat_permisos cp on cp.idCatPermisos = us.idPermiso 
    where u.estatus = 0`;

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json({
                status: 'void',
                msg: 'No se encontraron registros'
            });
        }
    });
};

//Usuario del sistema activo
const Usuario_Activo_R = (req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }

    if (typeof req.body.idUsuario === 'number') {
        const sql = `select
        u.idUsuario,
        u.idUsuarioSistema,
        us.idPermiso,
        cp.nombre as nombre_permiso,
        cp.descripcion,
        u.nombre,
        u.apellidoPaterno,
        u.apellidoMaterno,
        u.telefono,
        u.telefonoAlternativo,
        u.correo,
        u.calle,
        u.numInterior,
        u.numExterior,
        u.calleCruza1,
        u.calleCruza2,
        u.estado,
        u.municipio,
        u.cp,
        u.estatus
        from usuario u
        inner join usuario_sistema us  on us.idUsuarioSistema = u.idUsuarioSistema
        inner join cat_permisos cp on cp.idCatPermisos = us.idPermiso 
        where u.estatus = 1 and u.idUsuario = ${req.body.idUsuario}`;

        Mysql.connection.query(sql, (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({
                    status: 'void',
                    msg: 'No se encontraron registros'
                });
            }
        });
    } else {
        res.json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }


};
//Usuario del sistema inactivos
const Usuario_Inactivo_R = (req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }

    if (typeof req.body.idUsuario === 'number') {
        const sql = `select
        u.idUsuario,
        u.idUsuarioSistema,
        us.idPermiso,
        cp.nombre as nombre_permiso,
        cp.descripcion,
        u.nombre,
        u.apellidoPaterno,
        u.apellidoMaterno,
        u.telefono,
        u.telefonoAlternativo,
        u.correo,
        u.calle,
        u.numInterior,
        u.numExterior,
        u.calleCruza1,
        u.calleCruza2,
        u.estado,
        u.municipio,
        u.cp,
        u.estatus
        from usuario u
        inner join usuario_sistema us  on us.idUsuarioSistema = u.idUsuarioSistema
        inner join cat_permisos cp on cp.idCatPermisos = us.idPermiso 
        where u.estatus = 0 and u.idUsuario = ${req.body.idUsuario}`;

        Mysql.connection.query(sql, (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({
                    status: 'void',
                    msg: 'No se encontraron registros'
                });
            }
        });
    } else {
        res.json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }


};

//DESACTIVAR (Delete)
const Usuario_Desactivar_D = async(req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }



    if (typeof req.body.idUsuario === 'number') {

        await Validar_Usuario_Activo(req.body.idUsuario)
            .then(dato => {
                const sql = `update usuario set estatus = 0 where estatus = 1 and idUsuario = ${req.body.idUsuario}`;
                Mysql.connection.query(sql, (error, result) => {
                    if (error) {
                        res.json({
                            status: 'dataBaseError',
                            msg: 'Hubo un error interno en la base de datos'
                        });
                        throw error;
                    } else {
                        res.json({
                            status: 'OK',
                            msg: 'El fue afectado correctamente'
                        });
                    }
                });
            })
            .catch(error => {
                res.json(error);
            });
    } else {
        res.json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }

};
//ACTIVAR
const Usuario_Activar_A = async(req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }

    if (typeof req.body.idUsuario === 'number') {


        await Validar_Usuario_Desactivado(req.body.idUsuario)
            .then(dato => {
                const sql = `update usuario set estatus = 1 where estatus = 0 and idUsuario = ${req.body.idUsuario}`;
                Mysql.connection.query(sql, (error, result) => {
                    if (error) {
                        res.json({
                            status: 'dataBaseError',
                            msg: 'Hubo un error interno en la base de datos'
                        });
                        throw error;
                    } else {
                        res.json({
                            status: 'OK',
                            msg: 'El fue afectado correctamente'
                        });
                    }
                });
            })
            .catch(error => {
                res.json(error);
            });


    } else {
        res.json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }
};

//Crear Usuario tipo Usuario del Sistema
const Usuario_C = (req = request, res = response) => {
    Crear_Usuario(req).then(dato => res.json(dato)).catch(error => res.json(error));
};

//Modificar Usuario tipo Usuario del Sistema
const Usuario_U = async(req = request, res = response) => {
    await Modificar_Usuario(req)
        .then(dato => {
            res.json(dato);
        })
        .catch(error => {
            res.json(error);
        });
};


module.exports = {
    Usuario_Activos_R,
    Usuario_Inactivos_R,
    Usuario_Activo_R,
    Usuario_Inactivo_R,
    Usuario_Desactivar_D,
    Usuario_Activar_A,
    Usuario_C,
    Usuario_U
};