const SQL = require('../db/connection');
const { response, request } = require('express');

const Mysql = new SQL();

//Funciones de apoyo
const toDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(day, month - 1, year);
};
const toDateDB = (dateStr) => toDate(dateStr).toISOString().split('T')[0];

const Validar_Usuario_Candidato_Activo = (id) => { //Valida que el usuario este activo
    const promesa = new Promise((resolve, reject) => {
        const sqlValidator = `select * from usuario where estatus = 1 and idUsuario = ${id} and idCliente is null and idLaboratorio is null and idUsuarioSistema is null`;
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

const Validar_Usuario_Candidato_Desactivado = (id) => { //Valida que el usuario este desactivado
    const promesa = new Promise((resolve, reject) => {
        const sqlValidator = `select * from usuario where estatus = 0 and idUsuario = ${id} and idCliente is null and idLaboratorio is null and idUsuarioSistema is null`;
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

const Validar_Candidato_Estructura = (req) => {
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
        if (req.body["fechaNacimiento"] === undefined)
            atributos.push('fechaNacimiento');
        if (req.body["lugarNacimiento"] === undefined)
            atributos.push('lugarNacimiento');
        if (req.body["genero"] === undefined)
            atributos.push('genero');
        if (req.body["estadoCivil"] === undefined)
            atributos.push('estadoCivil');
        if (req.body["edad"] === undefined)
            atributos.push('edad');
        if (req.body["gradoMaxEstudios"] === undefined)
            atributos.push('gradoMaxEstudios');
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

const Crear_Candidato = (candidatoObj) => {
    const promesa = new Promise((resolve, reject) => {

        let sql = `INSERT INTO candidato (
            idCliente,
            idLaboratorio, 
            idUsuarioSistema,
            fechaNacimiento,
            lugarNacimiento,
            genero,
            estadoCivil,
            edad,
            gradoMaxEstudios,
            tieneHistorialAcademico,
            idAntecedentesSociales,
            idReferenciasPersonales,
            tieneAntecedentesLaborales,
            idInvestigacionLegal,
            tieneTrabajosNoMencionados)
            VALUES(${candidatoObj.idCliente}, `;
        String(candidatoObj.idLaboratorio) === 'null' ? sql += 'null, ' : sql += `${parseInt(candidatoObj.idLaboratorio)}, `;
        sql += `${parseInt(candidatoObj.idUsuarioSistema)}, '${toDateDB(candidatoObj.fechaNacimiento)}', '${candidatoObj.lugarNacimiento}', '${candidatoObj.genero}', '${candidatoObj.estadoCivil}', ${parseInt(candidatoObj.edad)}, '${candidatoObj.gradoMaxEstudios}', 0, null, null, 0, null, 0)`;

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

const Borrar_Candidato = (id) => {
    const sql = `DELETE FROM candidato WHERE idCandidato = ${parseInt(id)}`;
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

const Crear_Usuario_Candidato = (req) => {
    const promesa = new Promise(async(resolve, reject) => {
        try {
            const validarEstructura = await Validar_Candidato_Estructura(req);
            if (validarEstructura) {
                const idCandidato = await Crear_Candidato(req.body);
                const sql = `INSERT INTO usuario VALUES ( null, null, ${parseInt(idCandidato)}, null, null, '${String(req.body.nombre)}', '${String(req.body.apellidoPaterno)}', '${String(req.body.apellidoMaterno)}', '${String(req.body.telefono)}', '${String(req.body.telefonoAlternativo)}', '${String(req.body.correo)}', '${String(req.body.calle)}', ${parseInt(req.body.numInterior)}, ${parseInt(req.body.numExterior)}, '${String(req.body.calleCruza1)}', '${String(req.body.calleCruza2)}', '${String(req.body.estado)}', '${String(req.body.municipio)}', ${parseInt(req.body.cp)}, 1 )`;
                Mysql.connection.query(sql, (error, result) => {
                    if (error) {
                        Borrar_Candidato(idCliente);
                        reject({
                            status: 'dataBaseError',
                            msg: 'Hubo un error interno en la base de datos',
                            dberror: error
                        });
                    } else {
                        resolve({ status: 'OK', msg: 'Candidato creado con exito' });
                    }
                });
            }
        } catch (error) {
            reject(error);
        }

    });
    return promesa;
};

const Modificar_Usuario_Candidato = (req) => {
    const promesa = new Promise(async(resolve, reject) => {
        try {
            const validarEstructura = await Validar_Candidato_Estructura(req);
            if (validarEstructura) {
                const sql = `UPDATE usuario u
                INNER JOIN
                        candidato c
                ON
                        u.idCandidato = c.idCandidato
                SET
                        c.fechaNacimiento = '${toDateDB(String(req.body.fechaNacimiento))}',
                        c.lugarNacimiento = '${String(req.body.lugarNacimiento)}',
                        c.genero = '${String(req.body.genero)}',
                        c.estadoCivil = '${String(req.body.estadoCivil)}',
                        c.edad = ${parseInt(req.body.edad)},
                        c.gradoMaxEstudios = '${String(req.body.gradoMaxEstudios)}',
                        u.nombre = '${String(req.body.nombre)}', 
                        u.apellidoPaterno = '${String(req.body.apellidoPaterno)}', 
                        u.apellidoMaterno = '${String(req.body.apellidoMaterno)}', 
                        u.telefono = '${String(req.body.telefono)}', 
                        u.telefonoAlternativo = '${String(req.body.telefonoAlternativo)}', 
                        u.correo = '${String(req.body.correo)}', 
                        u.calle = '${String(req.body.calle)}', 
                        u.numInterior = ${parseInt(req.body.numInterior)}, 
                        u.numExterior = ${parseInt(req.body.numExterior)}, 
                        u.calleCruza1 = '${String(req.body.calleCruza1)}', 
                        u.calleCruza2 = '${String(req.body.calleCruza2)}', 
                        u.estado = '${String(req.body.estado)}', 
                        u.municipio = '${String(req.body.municipio)}', 
                        u.cp = ${parseInt(req.body.cp)}
                WHERE
                        u.idUsuario = ${parseInt(req.body.idUsuario)} and u.idCliente is null and u.idUsuarioSistema is null and u.idLaboratorio is null`;
                Mysql.connection.query(sql, (error, result) => {
                    if (error) {
                        reject({
                            status: 'dataBaseError',
                            msg: 'Hubo un error interno en la base de datos',
                            dberror: error
                        });
                    } else {
                        if (result.affectedRows > 0)
                            resolve({ status: 'OK', msg: 'Candidato modificado con exito' });
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

//Lista de todos los candidatos
const Candidatos_Activos_R = (req = request, res = response) => {
    const sql = `select
    u.idUsuario,
    u.idCandidato,
    c.idCliente,
    c.idLaboratorio,
    c.idUsuarioSistema,
    c.fechaNacimiento,
    c.lugarNacimiento,
    c.genero,
    c.estadoCivil,
    c.edad,
    c.gradoMaxEstudios,
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
    u.estatus,
    c.tieneHistorialAcademico,
    c.idAntecedentesSociales,
    c.idReferenciasPersonales,
    c.tieneAntecedentesLaborales,
    c.idInvestigacionLegal,
    c.tieneTrabajosNoMencionados
    from 	
    usuario u
    inner join
    candidato c on c.idCandidato = u.idCandidato
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
//Lista de todos los candidatos
const Candidatos_Inactivos_R = (req = request, res = response) => {
    const sql = `select
    u.idUsuario,
    u.idCandidato,
    c.idCliente,
    c.idLaboratorio,
    c.idUsuarioSistema,
    c.fechaNacimiento,
    c.lugarNacimiento,
    c.genero,
    c.estadoCivil,
    c.edad,
    c.gradoMaxEstudios,
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
    u.estatus,
    c.tieneHistorialAcademico,
    c.idAntecedentesSociales,
    c.idReferenciasPersonales,
    c.tieneAntecedentesLaborales,
    c.idInvestigacionLegal,
    c.tieneTrabajosNoMencionados
    from 	
    usuario u
    inner join
    candidato c on c.idCandidato = u.idCandidato
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

//Candidato activo
const Candidato_Activo_R = (req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }

    if (typeof req.body.idUsuario === 'number') {
        const sql = `select
        u.idUsuario,
        u.idCandidato,
        c.idCliente,
        c.idLaboratorio,
        c.idUsuarioSistema,
        c.fechaNacimiento,
        c.lugarNacimiento,
        c.genero,
        c.estadoCivil,
        c.edad,
        c.gradoMaxEstudios,
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
        u.estatus,
        c.tieneHistorialAcademico,
        c.idAntecedentesSociales,
        c.idReferenciasPersonales,
        c.tieneAntecedentesLaborales,
        c.idInvestigacionLegal,
        c.tieneTrabajosNoMencionados
        from 	
        usuario u
        inner join
        candidato c on c.idCandidato = u.idCandidato
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
//Candidato inactivos
const Candidato_Inactivo_R = (req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }

    if (typeof req.body.idUsuario === 'number') {
        const sql = `select
        u.idUsuario,
        u.idCandidato,
        c.idCliente,
        c.idLaboratorio,
        c.idUsuarioSistema,
        c.fechaNacimiento,
        c.lugarNacimiento,
        c.genero,
        c.estadoCivil,
        c.edad,
        c.gradoMaxEstudios,
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
        u.estatus,
        c.tieneHistorialAcademico,
        c.idAntecedentesSociales,
        c.idReferenciasPersonales,
        c.tieneAntecedentesLaborales,
        c.idInvestigacionLegal,
        c.tieneTrabajosNoMencionados
        from 	
        usuario u
        inner join
        candidato c on c.idCandidato = u.idCandidato
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
const Usuario_Candidato_Desactivar_D = async(req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }



    if (typeof req.body.idUsuario === 'number') {

        await Validar_Usuario_Candidato_Activo(req.body.idUsuario)
            .then(dato => {
                const sql = `update usuario set estatus = 0 where estatus = 1 and idUsuario = ${req.body.idUsuario} and idCliente is null and idLaboratorio is null and idUsuarioSistema is null`;
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
                            msg: 'Candidato desactivado correctamente'
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
const Usuario_Candidato_Activar_A = async(req = request, res = response) => {

    if (req.body["idUsuario"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idUsuario' es necesario"
        });
    }

    if (typeof req.body.idUsuario === 'number') {


        await Validar_Usuario_Candidato_Desactivado(req.body.idUsuario)
            .then(dato => {
                const sql = `update usuario set estatus = 1 where estatus = 0 and idUsuario = ${req.body.idUsuario} and idCliente is null and idLaboratorio is null and idUsuarioSistema is null`;
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
                            msg: 'Candidato activado correctamente'
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
const Candidato_C = (req = request, res = response) => {

    Crear_Usuario_Candidato(req).then(dato => res.json(dato)).catch(error => res.json(error));

};

//Modificar Usuario tipo Cliente
const Candidato_U = async(req = request, res = response) => {
    await Modificar_Usuario_Candidato(req)
        .then(dato => {
            res.json(dato);
        })
        .catch(error => {
            res.json(error);
        });
};

module.exports = {
    Candidatos_Activos_R,
    Candidatos_Inactivos_R,
    Candidato_Activo_R,
    Candidato_Inactivo_R,
    Candidato_C,
    Usuario_Candidato_Desactivar_D,
    Usuario_Candidato_Activar_A,
    Candidato_U
};