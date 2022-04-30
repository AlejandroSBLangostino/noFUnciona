const SQL = require("../db/connection");

const { response, request } = require("express");

const Mysql = new SQL();

//Validar estructura
const Validar_Proc_InvLeg_Estructura = (req) => {
    const promesa = new Promise((resolve, reject) => {
        let atributos = [];
        if (req.body["idCandidato"] === undefined)
            atributos.push('idCandidato');
        if (req.body["idInvestigacionLegal"] === undefined)
            atributos.push('idInvestigacionLegal');
        if (req.body["penal"] === undefined)
            atributos.push('penal');
        if (req.body["civil"] === undefined)
            atributos.push('civil');
        if (req.body["laboral"] === undefined)
            atributos.push('laboral');
        if (req.body["estatus"] === undefined)
            atributos.push('estatus');
        if (req.body["estatusproceso"] === undefined)
            atributos.push('estatusproceso');
        if (atributos.length > 0) {
            console.log(atributos);
            reject({
                status: 'noData',
                msj: `Los atributos ${atributos} son necesarios`
            });
        }
        resolve(true);
    });
    return promesa;
};

//Validar que no haya otro proceso
const Validar_Candidato_Proceso = (req) => {
    const promesa = new Promise((resolve, reject) =>{
        const sql = `select idInvestigacionLegal from candidato where idCandidato = ${req.body.idCandidato} and idInvestigacionLegal is null`;
        console.log(sql)
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
            if (result.length === 1) {
                resolve(true);
            } else {
                reject({
                    status: 'errorDuplicate',
                    msg: 'El candidato ya tiene una Investigacion Legal relacionado'
                });
            }
        });
    });
    return promesa
};

//Relacionar Investigacion Legal con Candidato
const Proc_InvLeg_Relacionar = (c_id, invleg_id) => {
    const promesa = new Promise((resolve, reject) =>{
        const sql = `UPDATE candidato c
        INNER JOIN
                usuario u
        ON
                u.idCandidato = c.idCandidato
        SET 
                c.idInvestigacionLegal = ${parseInt(invleg_id)}
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
                    msg: 'No se pudo relacionar la Investigacion Legal con el Candidato, verificar'
                });
            }
        });
    });
    return promesa
};

//Lista de todas las Investigaciones Legales Activas
const Proc_InvLeg_Activos_R = (req = request, res = response) => {
    const sql = `SELECT 
                        idInvestigacionLegal, 
                        penal, 
                        civil, 
                        laboral, 
                        estatus, 
                        estatusproceso
                FROM 
                        investigacion_legal 
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
            return res.status(200).json(result);
        } else {
            res.status(200).json({
                status: 'void',
                msg: 'No se encontraron registros'
            });
        }
    });
};

//Lista de todas las Investigaciones Legales Inactivas
const Proc_InvLeg_Inactivos_R = (req = request, res = response) => {
    const sql = `SELECT 
                        idInvestigacionLegal, 
                        penal, 
                        civil, 
                        laboral, 
                        estatus, 
                        estatusproceso
                FROM 
                        investigacion_legal 
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
            return res.status(200).json(result);
        } else {
            res.status(200).json({
                status: 'void',
                msg: 'No se encontraron registros'
            });
        }
    });
};

//Investigacion Legal activa
const Proc_InvLeg_Activo_R = (req = request, res = response) => {

    if (req.body["idInvestigacionLegal"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idInvestigacionLegal' es necesario"
        });
    }

    if (typeof req.body.idInvestigacionLegal === 'number') {
        const sql = `SELECT 
                            idInvestigacionLegal, 
                            penal, 
                            civil, 
                            laboral, 
                            estatus, 
                            estatusproceso
                    FROM 
                            investigacion_legal 
                    WHERE 
                            estatus = '1' AND idInvestigacionLegal = ${req.body.idInvestigacionLegal}`;

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
    } else {
        res.status(400).json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }


};

const Proc_InvLeg_Inactivo_R = (req = request, res = response) => {

    if (req.body["idInvestigacionLegal"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idInvestigacionLegal' es necesario"
        });
    }

    if (typeof req.body.idInvestigacionLegal === 'number') {
        const sql = `SELECT 
                            idInvestigacionLegal, 
                            penal, 
                            civil, 
                            laboral, 
                            estatus, 
                            estatusproceso
                    FROM 
                            investigacion_legal 
                    WHERE 
                            estatus = '0' AND idInvestigacionLegal = ${req.body.idInvestigacionLegal}`;

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
    } else {
        res.status(400).json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }


};

//DESACTIVAR (Delete)
const Proc_InvLeg_Desactivar_D = (req = request, res = response) => {

    if (req.body["idInvestigacionLegal"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idInvestigacionLegal' es necesario"
        });
    }

    if (typeof req.body.idInvestigacionLegal === 'number') {

        const sql = `update investigacion_legal set estatus = 0 where estatus = 1 and idInvestigacionLegal = ${req.body.idInvestigacionLegal}`;
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
                    msg: 'Investigacion Legal desactivada correctamente'
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
const Proc_InvLeg_Activar_A = (req = request, res = response) => {

    if (req.body["idInvestigacionLegal"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idInvestigacionLegal' es necesario"
        });
    }

    if (typeof req.body.idInvestigacionLegal === 'number') {

        const sql = `update investigacion_legal set estatus = 1 where estatus = 0 and idInvestigacionLegal = ${req.body.idInvestigacionLegal}`;
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
                    msg: 'investigacion Legal activada correctamente'
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

//Crear Investigacion Social
const Proc_InvLeg_C = async(req = request, res = response) => {
    let invleg_id = null;
    try {
        
        const validarEstructura = await Validar_Proc_InvLeg_Estructura(req);
        await Validar_Candidato_Proceso(req);
    
        if (validarEstructura){
            let penal;
            let civil;
            let laboral;

            req.body.penal === 0 ? penal = null : penal = `'${req.body.penal}'`;
            req.body.civil === 0 ? civil = null : civil = `'${req.body.civil}'`;
            
            req.body.laboral === 0 ? laboral= null : laboral = `'${req.body.laboral}'`;
            
            const sql = `INSERT INTO investigacion_legal
                                        (penal, civil, laboral, estatus, estatusproceso)
                                    VALUES(${penal}, ${civil}, ${laboral}, '1', 1);`;
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
                    invleg_id = result.insertId
                    if(invleg_id != null){
                        const relacionarCandidato = await Proc_InvLeg_Relacionar(req.body.idCandidato ,invleg_id);
                        if(relacionarCandidato){
                            
                            res.status(200).json({
                                status: 'OK',
                                msg: 'La Investigacion Legal se creo y relaciono correctamente'
                            });
                        }else{
                            res.status(400).json({
                                status: 'invalidAction',
                                msg: 'No se afecto ningun registro, no se pudo recuperar el id'
                            });
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.log('Error');
        res.status(400).json(error);
    }    
    
};

//Modificar Investigacion Legal
const Proc_InvLeg_U = async(req = request, res = response) => {
    try {
        const validarEstructura = await Validar_Proc_InvLeg_Estructura(req);
        if (validarEstructura){

            let penal;
            let civil;
            let laboral;

            req.body.penal === 0 ? penal = null : penal = `'${req.body.penal}'`;
            req.body.civil === 0 ? civil = null : civil = `'${req.body.civil}'`;
            
            req.body.laboral === 0 ? laboral= null : laboral = `'${req.body.laboral}'`;

            const sql = `UPDATE investigacion_legal INNER JOIN candidato c ON investigacion_legal.idInvestigacionLegal = c.idInvestigacionLegal SET investigacion_legal.penal = ${penal}, investigacion_legal.civil = ${civil}, investigacion_legal.laboral = ${laboral}  WHERE investigacion_legal.idInvestigacionLegal=${parseInt(req.body.idInvestigacionLegal)} AND c.idCandidato = ${parseInt(req.body.idCandidato)} AND investigacion_legal.estatus = '1' AND investigacion_legal.estatusproceso = 1 `;
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
                            msg: 'No se afecto ningun registro, la Investigacion Legal no existe'
                        });
                    }
    
                    res.status(200).json({
                        status: 'OK',
                        msg: 'Investigacion Legal modificada correctamente'
                    });
                }
            });
        }    
    } catch (error) {
        res.status(400).json(error);
    }
};

//Estatus Proceso 
const Proc_InvLeg_Actualizar_Proceso_E = (req = request, res = response) => {

    if (req.body["idInvestigacionLegal"] === undefined) {
        return res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idInvestigacionLegal' es necesario"
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

    if (typeof req.body.idInvestigacionLegal === 'number' && typeof req.body.estatusproceso === 'number') {

        const sql = `UPDATE investigacion_legal il INNER JOIN candidato c ON il.idInvestigacionLegal = c.idInvestigacionLegal SET il.estatusproceso = ${req.body.estatusproceso} where il.estatus = 1 and il.idInvestigacionLegal = ${req.body.idInvestigacionLegal} AND c.idCandidato = ${parseInt(req.body.idCandidato)}`;
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
                        msg: 'No se enctontro la investigacion legal'
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
    Proc_InvLeg_Activos_R,
    Proc_InvLeg_Inactivos_R,
    Proc_InvLeg_Activo_R,
    Proc_InvLeg_Inactivo_R,
    Proc_InvLeg_Desactivar_D,
    Proc_InvLeg_Activar_A,
    Proc_InvLeg_C,
    Proc_InvLeg_U,
    Proc_InvLeg_Actualizar_Proceso_E
};