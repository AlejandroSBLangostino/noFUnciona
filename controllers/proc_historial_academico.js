const SQL = require("../db/connection");

const { response, request } = require("express");

const Mysql = new SQL();

//Validar estructura
const Validar_Proc_HisAca_Estructura = (req) => {
    const promesa = new Promise((resolve, reject) => {
        let atributos = [];
        if (req.body["idCandidato"] === undefined)
            atributos.push('idCandidato');
        if (req.body["idHistorialAcademico"] === undefined)
            atributos.push('idHistorialAcademico');
        if (req.body["nivelEducativo"] === undefined)
            atributos.push('nivelEducativo');
        if (req.body["periodo"] === undefined)
            atributos.push('periodo');
        if (req.body["escuela"] === undefined)
            atributos.push('escuela');
        if (req.body["localizacion"] === undefined)
            atributos.push('localizacion');
        if (req.body["certificado"] === undefined)
            atributos.push('certificado');
        if (req.body["promedio"] === undefined)
            atributos.push('promedio');
        if (req.body["estatus"] === undefined)
            atributos.push('estatus');
        if (req.body["estatusproceso"] === undefined)
            atributos.push('estatusproceso');
        if (atributos.length > 0) {
            reject({
                status: 'noData',
                msj: `Los atributos ${atributos} son necesarios`
            });
        }
        resolve(true);
    });
    return promesa;
};

//Relacionar Historial Academico con Candidato
const Proc_HisAca_Relacionar = (c_id) => {
    const promesa = new Promise((resolve, reject) =>{

        const sql = `UPDATE candidato c
        INNER JOIN
                usuario u
        ON
                u.idCandidato = c.idCandidato
        SET 
                c.tieneHistorialAcademico = 1
        WHERE
                c.idCandidato = ${parseInt(c_id)} and u.idCliente is null and u.idUsuarioSistema is null and u.idLaboratorio is null and u.estatus = 1`;

        Mysql.connection.query(sql, (error, result) => {
            if (error){
                reject({
                    status: "dataBaseError",
                    msg: "Hubo un error interno en la base de datos",
                    error: {
                    name_error : error.code,
                    code_error: error.errno
                    }
                });
            }
            if (result.affectedRows > 0) {
                resolve(true);
            } else {
                reject({
                    status: 'errorRelation',
                    msg: 'No se pudo relacionar el Historial Academico con el Candidato, verificar'
                });
            }
        });
    });
    return promesa
};

//Validar que el candiadato exista y este activo
const Validar_Candidato_Existe = (req) => {
    const promesa = new Promise((resolve, reject) =>{
        
        if(typeof req.body["idCandidato"] != 'number'){
            reject({
                status: 'typeof',
                msg: "El atributo 'idCandidato' debe ser un numero"
            });
        }

        const sql = `select * from candidato c inner join usuario u on u.idCandidato = c.idCandidato where c.idCandidato = ${req.body.idCandidato} and u.estatus = 1`;
        Mysql.connection.query(sql, (error, result) => {
            if (error){
                reject({
                    status: "dataBaseError",
                    msg: "Hubo un error interno en la base de datos",
                    error: {
                    name_error : error.code,
                    code_error: error.errno
                    }
                });
            }
            if (result) {
                resolve(true);
            } else {
                reject({
                    status: 'errorVoid',
                    msg: 'El Candidato no existe'
                });
            }
        });
    });
    return promesa
};

//Validar el numero maximo de Historiales Academicos activos en un solo Candidato
const Proc_HisAca_Valudar_Numero = (c_id) =>{
    const promesa = new Promise((resolve,reject)=>{
        
        if(typeof c_id != 'number'){
            
            reject({
                status: 'typeof',
                msg: "El atributo 'idCandidato' debe ser un numero"
            });
        }
        
        const sql = `select count(*) as n_registros from historial_academico where estatus = '1' and idCandidato = ${c_id}`;
        Mysql.connection.query(sql, (error, result) => {
            if (error){
                console.log('Error',error)
                reject({
                    status: "dataBaseError",
                    msg: "Hubo un error interno en la base de datos",
                    error: {
                    name_error : error.code,
                    code_error: error.errno
                    }
                });
            }
            let casteo = JSON.parse(JSON.stringify(result))[0];
            if (casteo.n_registros < 6) {
                resolve(true);
            } else {
                reject({
                    status: 'errorMaxFields',
                    msg: 'El Candidato tiene el numero maximo de Historiales Academicos'
                });
            }
        });
    });
    return promesa;
};

//Lista de todos los Historiales Academicos Activos
const Proc_HisAca_Activos_R = (req = request, res = response) => {
    const sql = `SELECT 
                        idHistorialAcademico, 
                        idCandidato , 
                        nivelEducativo, 
                        periodo, 
                        escuela, 
                        localizacion,
                        certificado,
                        promedio,
                        estatus,
                        estatusproceso
                FROM 
                        historial_academico 
                WHERE 
                        estatus = '1'`;

    Mysql.connection.query(sql, (error, result) => {
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
            res.status(200).json(result);
        } else {
            res.status(200).json({
                status: 'void',
                msg: 'No se encontraron registros'
            });
        }
    });
};
//Lista de todos los Historiales Academicos Inactivos
const Proc_HisAca_Inactivos_R = (req = request, res = response) => {
    const sql = `SELECT 
                        idHistorialAcademico, 
                        idCandidato , 
                        nivelEducativo, 
                        periodo, 
                        escuela, 
                        localizacion,
                        certificado,
                        promedio,
                        estatus,
                        estatusproceso
                FROM 
                        historial_academico 
                WHERE 
                        estatus = '0'`;

    Mysql.connection.query(sql, (error, result) => {
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
            res.status(200).json(result);
        } else {
            res.status(200).json({
                status: 'void',
                msg: 'No se encontraron registros'
            });
        }
    });
};

//Historial Academico activo
const Proc_HisAca_Activo_R = (req = request, res = response) => {

    if (req.body["idHistorialAcademico"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idHistorialAcademico' es necesario"
        });
    }

    if (typeof req.body.idHistorialAcademico === 'number') {
        const sql = `SELECT 
                            idHistorialAcademico, 
                            idCandidato , 
                            nivelEducativo, 
                            periodo, 
                            escuela, 
                            localizacion,
                            certificado,
                            promedio,
                            estatus,
                            estatusproceso
                    FROM 
                            historial_academico 
                    WHERE 
                            estatus = '1' AND idHistorialAcademico = ${req.body.idHistorialAcademico}`;

        Mysql.connection.query(sql, (error, result) => {
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
                return res.status(200).json(result);
            } else {
                res.status(200).json({
                    status: 'void',
                    msg: 'No se encontraron registros'
                });
            }
        });
    } else {
        res.status(400).json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }


};
//Historial Academico inactivo
const Proc_HisAca_Inactivo_R = (req = request, res = response) => {

    if (req.body["idHistorialAcademico"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idHistorialAcademico' es necesario"
        });
    }

    if (typeof req.body.idHistorialAcademico === 'number') {
        const sql = `SELECT 
                            idHistorialAcademico, 
                            idCandidato , 
                            nivelEducativo, 
                            periodo, 
                            escuela, 
                            localizacion,
                            certificado,
                            promedio,
                            estatus,
                            estatusproceso
                    FROM 
                            historial_academico 
                    WHERE 
                            estatus = '0' AND idHistorialAcademico = ${req.body.idHistorialAcademico}`;

        Mysql.connection.query(sql, (error, result) => {
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
                return res.status(200).json(result);
            } else {
                res.status(200).json({
                    status: 'void',
                    msg: 'No se encontraron registros'
                });
            }
        });
    } else {
        res.status(400).json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }


};



//DESACTIVAR (Delete)
const Proc_HisAca_Desactivar_D = (req = request, res = response) => {

    if (req.body["idHistorialAcademico"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idHistorialAcademico' es necesario"
        });
    }

    if (typeof req.body.idHistorialAcademico === 'number') {

        const sql = `update historial_academico set estatus = 0 where estatus = 1 and idHistorialAcademico = ${req.body.idHistorialAcademico}`;
        Mysql.connection.query(sql, (error, result) => {
            if (error){
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
                        status: 'invalidAction',
                        msg: 'El registro esta desactivado o no se encontro'
                    });
                }

                res.status(200).json({
                    status: 'OK',
                    msg: 'Historial Academico desactivado correctamente'
                });
            }
        });
            
    } else {
        res.status(400).json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }

};

//ACTIVAR
const Proc_HisAca_Activar_A = async(req = request, res = response) => {

    if (req.body["idHistorialAcademico"] === undefined) {
        return res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idHistorialAcademico' es necesario"
        });
    }

    if (req.body["idCandidato"] === undefined) {
        return res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idCandidato' es necesario"
        });
    }
    if (typeof req.body.idHistorialAcademico === 'number' && typeof req.body.idCandidato === 'number') {

        try {
            await Proc_HisAca_Valudar_Numero(req.body.idCandidato);
        } catch (error) {
            return res.status(400).json(error);
        }

        const sql = `update historial_academico set estatus = 1 where estatus = 0 and idHistorialAcademico = ${req.body.idHistorialAcademico}`;
        Mysql.connection.query(sql, (error, result) => {
            if (error){
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
                        status: 'invalidAction',
                        msg: 'El registro esta activado o no se encontro'
                    });
                }

                res.status(200).json({
                    status: 'OK',
                    msg: 'Historial Academico activado correctamente'
                });
            }
        });
            
    } else {
        res.status(400).json({
            status: 'typeof',
            msg: "Los id's recibido no son un numero"
        });
    }

};

//Crear Historial Academico 
const Proc_HisAca_C = async(req = request, res = response) => {
    try {
        
        const validarEstructura = await Validar_Proc_HisAca_Estructura(req);
        const validaCandidato = await Validar_Candidato_Existe(req);
        const validaNumeroRegistros =  await Proc_HisAca_Valudar_Numero(req.body.idCandidato);
        
        if (validarEstructura && validaCandidato && validaNumeroRegistros){
            const sql = `INSERT INTO historial_academico
            (idCandidato, nivelEducativo, periodo, escuela, localizacion, certificado, promedio, estatus, estatusproceso)
            VALUES(${parseInt(req.body.idCandidato)}, '${req.body.nivelEducativo}', '${req.body.periodo}', '${req.body.escuela}', '${req.body.localizacion}', '${req.body.certificado}', ${parseInt(req.body.promedio)}, '1', 1);
            `;
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
                } else {
                    if(result.affectedRows === 0){
                        res.status(400).json({
                            status: 'invalidAction',
                            msg: 'No se afecto ningun registro, validar los campos'
                        });
                    }
                    if(result != null){

                        const relacionarCandidato = await Proc_HisAca_Relacionar(req.body.idCandidato);
                        if(relacionarCandidato){
                            
                            return res.status(200).json({
                                status: 'OK',
                                msg: 'El Historia Academico se creo y relaciono correctamente'
                            });
                        }else{
                            res.status(400).json({
                                status: 'invalidAction',
                                msg: 'No se afecto ningun registro, validar'
                            });
                        }
                        

                        
                    }
                }
            });
        }
    } catch (error) {
        res.status(400).json(error);
    }    
    
};

//Modificar Investigacion Legal
const Proc_HisAca_U = async(req = request, res = response) => {
    try {
        const validarEstructura = await Validar_Proc_HisAca_Estructura(req);
        await Validar_Candidato_Existe(req);
        //await Proc_HisAca_Valudar_Numero(req.body.idCandidato);

        if (validarEstructura){

            const sql = `UPDATE historial_academico ha INNER JOIN candidato c ON ha.idCandidato = c.idCandidato SET ha.nivelEducativo = '${req.body.nivelEducativo}', ha.periodo = '${req.body.periodo}', ha.escuela = '${req.body.escuela}', ha.localizacion = '${req.body.localizacion}', ha.certificado = '${req.body.certificado}', ha.promedio = ${parseInt(req.body.promedio)} WHERE ha.idHistorialAcademico=${parseInt(req.body.idHistorialAcademico)} AND c.idCandidato = ${parseInt(req.body.idCandidato)} AND ha.estatus = '1' AND ha.estatusproceso = 1 `;
            Mysql.connection.query(sql, (error, result) => {
                if (error){
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
                            status: 'invalidAction',
                            msg: 'No se afecto ningun registro, el Historial Academico no existe'
                        });
                    }
    
                    res.status(200).json({
                        status: 'OK',
                        msg: 'Historial Academico modificado correctamente'
                    });
                }
            });
        }    
    } catch (error) {
        res.status(400).json(error);
    }
};

//Estatus Proceso 
const Proc_HisAca_Actualizar_Proceso_E = (req = request, res = response) => {

    if (req.body["idHistorialAcademico"] === undefined) {
        return res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idHistorialAcademico' es necesario"
        });
    }
    if (req.body["idCandidato"] === undefined) {
        return res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idCandidato' es necesario"
        });
    }
    //null : esperando
    //1 : en proceso
    //2 : terminado
    if (req.body["estatusproceso"] === undefined) {
        return res.status(400).json({
            status: 'noData',
            msg: "El atributo 'estatusproceso' es necesario"
        });
    }

    if (typeof req.body.idHistorialAcademico === 'number' && typeof req.body.estatusproceso === 'number') {

        const sql = `UPDATE historial_academico ha INNER JOIN candidato c ON ha.idCandidato = c.idCandidato SET ha.estatusproceso = ${req.body.estatusproceso} where ha.estatus = 1 and ha.idHistorialAcademico = ${req.body.idHistorialAcademico} AND c.idCandidato = ${parseInt(req.body.idCandidato)}`;
        Mysql.connection.query(sql, (error, result) => {
            if (error){
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
                        status: 'invalidAction',
                        msg: 'No se enctontro el historial academico'
                    });
                }

                res.status(200).json({
                    status: 'OK',
                    msg: 'Proceso actualizado correctamente'
                });
            }
        });
            
    } else {
        res.status(400).json({
            status: 'typeof',
            msg: 'El id o estatusproceso recibido no es un numero'
        });
    }

};

module.exports = {
    Proc_HisAca_Activos_R,
    Proc_HisAca_Inactivos_R,
    Proc_HisAca_Activo_R,
    Proc_HisAca_Inactivo_R,
    Proc_HisAca_Desactivar_D,
    Proc_HisAca_Activar_A,
    Proc_HisAca_C,
    Proc_HisAca_U,
    Proc_HisAca_Actualizar_Proceso_E
}