const SQL = require('../db/connection');
const { response, request } = require('express');

const Mysql = new SQL();

//Funciones de apoyo
const Validar_Usuario_Cliente_Activo = (id) => { //Valida que el usuario este activo
    const promesa = new Promise((resolve, reject) => {
        const sqlValidator = `select * from usuario where estatus = 1 and idUsuario = ${id} and idCandidato is null and idLaboratorio is null and idUsuarioSistema is null`;
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

const Validar_Usuario_Cliente_Desactivado = (id) => { //Valida que el usuario este desactivado
    const promesa = new Promise((resolve, reject) => {
        const sqlValidator = `select * from usuario where estatus = 0 and idUsuario = ${id} and idCandidato is null and idLaboratorio is null and idUsuarioSistema is null`;
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

const Validar_Cliente_Estructura = (req) => {
    const promesa = new Promise((resolve, reject) => {
        let atributos = [];
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
        if (req.body["idPaquete"] === undefined)
            atributos.push('idPaquete');
        if (req.body["nombreEmpresa"] === undefined)
            atributos.push('nombreEmpresa')
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
            atributos.push('callesCrusa1');
        if (req.body["calleCruza2"] === undefined)
            atributos.push('calleCrusa2');
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

const Crear_Cliente = (paquete, nombreEmpresa) => {
    const promesa = new Promise((resolve, reject) => {

        const sql = `INSERT INTO cliente (idCliente, idPaquete, nombreEmpresa ) VALUES (null,${parseInt(paquete)},'${String(nombreEmpresa)}')`;
        Mysql.connection.query(sql, (error, result) => {
            if (error) {
                reject({
                    status: 'dataBaseError',
                    msg: 'Hubo un error interno en la base de datos',
                    dberror: error.errno
                });
                throw error;
            }
            if (result) {
                resolve(result.insertId);
            }
        });
    });
    return promesa;
};

const Borrar_Cliente = (id) => {
    const sql = `DELETE FROM cliente WHERE idCliente = ${parseInt(id)}`;
    Mysql.connection.query(sql, (error, result) => {
        if (error) {
            return {
                status: 'dataBaseError',
                msg: 'Hubo un error interno en la base de datos',
                dberror: error.errno
            };
        }
        return ('OK');
    });
};

const Crear_Usuario_Cliente = (req) => {
    const promesa = new Promise(async(resolve, reject) => {
        try {
            const validarEstructura = await Validar_Cliente_Estructura(req);
            if (validarEstructura) {
                const idCliente = await Crear_Cliente(req.body.idPaquete, req.body.nombreEmpresa);
                const sql = `INSERT INTO usuario VALUES ( null, ${parseInt(idCliente)}, null, null, null, '${String(req.body.nombre)}', '${String(req.body.apellidoPaterno)}', '${String(req.body.apellidoMaterno)}', '${String(req.body.telefono)}', '${String(req.body.telefonoAlternativo)}', '${String(req.body.correo)}', '${String(req.body.calle)}', ${parseInt(req.body.numInterior)}, ${parseInt(req.body.numExterior)}, '${String(req.body.calleCruza1)}', '${String(req.body.calleCruza2)}', '${String(req.body.estado)}', '${String(req.body.municipio)}', ${parseInt(req.body.cp)}, 1 )`;
                Mysql.connection.query(sql, (error, result) => {
                    if (error) {
                        Borrar_Cliente(idCliente);
                        reject({
                            status: 'dataBaseError',
                            msg: 'Hubo un error interno en la base de datos',
                            dberror: error
                        });
                    } else {
                        resolve({ status: 'OK', msg: 'Cliente creado con exito' });
                    }
                });
            }
        } catch (error) {
            reject(error);
        }

    });
    return promesa;
};

const Modificar_Usuario_Cliente = (req) => {
    const promesa = new Promise(async(resolve, reject) => {
        try {
            const validarEstructura = await Validar_Cliente_Estructura(req);
            if (validarEstructura) {
                const sql = `UPDATE usuario u INNER JOIN cliente c ON u.idCliente = c.idCliente SET c.idPaquete = ${parseInt(req.body.idPaquete)}, c.nombreEmpresa = '${String(req.body.nombreEmpresa)}' , u.nombre = '${String(req.body.nombre)}', u.apellidoPaterno = '${String(req.body.apellidoPaterno)}', u.apellidoMaterno = '${String(req.body.apellidoMaterno)}', u.telefono = '${String(req.body.telefono)}', u.telefonoAlternativo = '${String(req.body.telefonoAlternativo)}', u.correo = '${String(req.body.correo)}', u.calle = '${String(req.body.calle)}', u.numInterior = ${parseInt(req.body.numInterior)}, u.numExterior = ${parseInt(req.body.numExterior)}, u.calleCruza1 = '${String(req.body.calleCruza1)}', u.calleCruza2 = '${String(req.body.calleCruza2)}', u.estado = '${String(req.body.estado)}', u.municipio = '${String(req.body.municipio)}', u.cp = ${parseInt(req.body.cp)} WHERE u.idUsuario = ${parseInt(req.body.idUsuario)} and u.idCandidato is null and u.idLaboratorio is null and u.idUsuarioSistema is null`;
                Mysql.connection.query(sql, (error, result) => {
                    if (error) {
                        reject({
                            status: 'dataBaseError',
                            msg: 'Hubo un error interno en la base de datos',
                            dberror: error
                        });
                    } else {
                        if (result.affectedRows > 0)
                            resolve({ status: 'OK', msg: 'Cliente modificado con exito' });
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

//Lista de todos los clientes
const Clientes_Activos_R = (req = request, res = response) => {
    const sql = `select
    u.idUsuario,
    u.idCliente,
    c.nombreEmpresa,
    p.nombre as nombre_paquete,
    p.descripcion as descripcion_paquete,
    p.precio as precio_paquete,
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
    from 	
    usuario u
    inner join
    cliente c on c.idCliente = u.idCliente 
    inner join
    paquete p on c.idPaquete = p.idPaquete 
    where 
    u.estatus = 1`;

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
//Lista de todos los clientes
const Clientes_Inactivos_R = (req = request, res = response) => {
    const sql = `select
    u.idUsuario,
    u.idCliente,
    c.nombreEmpresa,
    p.nombre as nombre_paquete,
    p.descripcion as descripcion_paquete,
    p.precio as precio_paquete,
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
    from 	
    usuario u
    inner join
    cliente c on c.idCliente = u.idCliente 
    inner join
    paquete p on c.idPaquete = p.idPaquete 
    where 
    u.estatus = 0`;

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

//Cliente activo
const Cliente_Activo_R = (req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }

    if (typeof req.body.idUsuario === 'number') {
        const sql = `select
        u.idUsuario,
        u.idCliente,
        c.nombreEmpresa,
        p.nombre as nombre_paquete,
        p.descripcion as descripcion_paquete,
        p.precio as precio_paquete,
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
        from 	
        usuario u
        inner join
        cliente c on c.idCliente = u.idCliente 
        inner join
        paquete p on c.idPaquete = p.idPaquete 
        where 
        u.estatus = 1 and u.idUsuario = ${req.body.idUsuario}`;

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
//Cliente inactivos
const Cliente_Inactivo_R = (req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }

    if (typeof req.body.idUsuario === 'number') {
        const sql = `select
        u.idUsuario,
        u.idCliente,
        c.nombreEmpresa,
        p.nombre as nombre_paquete,
        p.descripcion as descripcion_paquete,
        p.precio as precio_paquete,
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
        from 	
        usuario u
        inner join
        cliente c on c.idCliente = u.idCliente 
        inner join
        paquete p on c.idPaquete = p.idPaquete 
        where 
        u.estatus = 0 and u.idUsuario = ${req.body.idUsuario}`;

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
const Usuario_Cliente_Desactivar_D = async(req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }



    if (typeof req.body.idUsuario === 'number') {

        await Validar_Usuario_Cliente_Activo(req.body.idUsuario)
            .then(dato => {
                const sql = `update usuario set estatus = 0 where estatus = 1 and idUsuario = ${req.body.idUsuario} and idCandidato is null and idLaboratorio is null and idUsuarioSistema is null`;
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
                            msg: 'Cliente desactivado correctamente'
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
const Usuario_Cliente_Activar_A = async(req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }

    if (typeof req.body.idUsuario === 'number') {


        await Validar_Usuario_Cliente_Desactivado(req.body.idUsuario)
            .then(dato => {
                const sql = `update usuario set estatus = 1 where estatus = 0 and idUsuario = ${req.body.idUsuario} and idCandidato is null and idLaboratorio is null and idUsuarioSistema is null`;
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
                            msg: 'Cliente activado correctamente'
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

//Crear Usuario tipo Cliente
const Cliente_C = (req = request, res = response) => {

    Crear_Usuario_Cliente(req).then(dato => res.json(dato)).catch(error => res.json(error));

};

//Modificar Usuario tipo Cliente
const Cliente_U = async(req = request, res = response) => {
    await Modificar_Usuario_Cliente(req)
        .then(dato => {
            res.json(dato);
        })
        .catch(error => {
            res.json(error);
        });
};

module.exports = {
    Clientes_Activos_R,
    Clientes_Inactivos_R,
    Cliente_Activo_R,
    Cliente_Inactivo_R,
    Cliente_C,
    Usuario_Cliente_Desactivar_D,
    Usuario_Cliente_Activar_A,
    Cliente_U
};