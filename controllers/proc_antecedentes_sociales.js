const SQL = require("../db/connection");

const { response, request } = require("express");

const Mysql = new SQL();

//Validar estructura
const Validar_Proc_AntSoc_Estructura = (req) => {
    const promesa = new Promise((resolve, reject) => {
        let atributos = [];
        if (req.body["idCandidato"] === undefined)
            atributos.push('idCandidato');
        if (req.body["idAntecedentesSociales"] === undefined)
            atributos.push('idAntecedentesSociales');
        if (req.body["puestoSindical"] === undefined)
            atributos.push('puestoSindical');
        if (req.body["cualPuestoSindical"] === undefined)
            atributos.push('cualPuestoSindical');
        if (req.body["cargoSindical"] === undefined)
            atributos.push('cargoSindical');
        if (req.body["partidoPolitico"] === undefined)
            atributos.push('partidoPolitico');
        if (req.body["cualPartidoPolitico"] === undefined)
            atributos.push('cualPartidoPolitico');
        if (req.body["cargoPartidoPolitico"] === undefined)
            atributos.push('cargoPartidoPolitico');
        if (req.body["deporte"] === undefined)
            atributos.push('deporte');
        if (req.body["cualDeporte"] === undefined)
            atributos.push('cualDeporte');
        if (req.body["religion"] === undefined)
            atributos.push('religion');
        if (req.body["religionFrecuencia"] === undefined)
            atributos.push('religionFrecuencia');
        if (req.body["alcohol"] === undefined)
            atributos.push('alcohol');
        if (req.body["alcoholFrecuencia"] === undefined)
            atributos.push('alcoholFrecuencia');
        if (req.body["fuma"] === undefined)
            atributos.push('fuma');
        if (req.body["fumaFrecuencia"] === undefined)
            atributos.push('fumaFrecuencia');
        if (req.body["intervencionQuirurgica"] === undefined)
            atributos.push('intervencionQuirurgica');
        if (req.body["enfermedadHereditaria"] === undefined)
            atributos.push('enfermedadHereditaria');
        if (req.body["planCortoPlazo"] === undefined)
            atributos.push('planCortoPlazo');
        if (req.body["planMedianoPlazo"] === undefined)
            atributos.push('planMedianoPlazo');
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
        const sql = `select idAntecedentesSociales from candidato where idCandidato = ${req.body.idCandidato} and idAntecedentesSociales is null`;

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
                    msg: 'El candidato ya tiene un Antecedente Social relacionado'
                });
            }
        });
    });
    return promesa
};

//Relacionar Antecedentes Sociales con Candidato
const Proc_AntSoc_Relacionar = (c_id, antsoc_id) => {
    const promesa = new Promise((resolve, reject) =>{
        const sql = `UPDATE candidato c
        INNER JOIN
                usuario u
        ON
                u.idCandidato = c.idCandidato
        SET 
                c.idAntecedentesSociales = ${parseInt(antsoc_id)}
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
                    msg: 'No se pudo relacionar el Antecedente Social con el Candidato, verificar'
                });
            }
        });
    });
    return promesa
};

//Lista de todos los Antecedentes Sociales
const Proc_AntSoc_Activos_R = (req = request, res = response) => {
    const sql = `select 	
    idAntecedentesSociales, 
    puestoSindical, 
    cualPuestoSindical, 
    cargoSindical, 
    partidoPolitico, 
    cualPartidoPolitico,
    cargoPartidoPolitico,
    deporte,
    cualDeporte,
    religion, 
    religionFrecuencia,
    alcohol,
    alcoholFrecuencia,
    fuma,
    fumaFrecuencia,
    intervencionQuirurgica,
    enfermedadHereditaria,
    planCortoPlazo,
    planMedianoPlazo,
    estatus,
    estatusproceso
    from antecedentes_sociales where estatus = '1'`;

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

//Lista de todos los Antecedentes Sociales
const Proc_AntSoc_Inactivos_R = (req = request, res = response) => {
    const sql = `select 	
    idAntecedentesSociales, 
    puestoSindical, 
    cualPuestoSindical, 
    cargoSindical, 
    partidoPolitico, 
    cualPartidoPolitico,
    cargoPartidoPolitico,
    deporte,
    cualDeporte,
    religion, 
    religionFrecuencia,
    alcohol,
    alcoholFrecuencia,
    fuma,
    fumaFrecuencia,
    intervencionQuirurgica,
    enfermedadHereditaria,
    planCortoPlazo,
    planMedianoPlazo,
    estatus,
    estatusproceso
    from antecedentes_sociales where estatus = '0'`;

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

//Antecedente Social activo
const Proc_AntSoc_Activo_R = (req = request, res = response) => {

    if (req.body["idAntecedentesSociales"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idAntecedentesSociales' es necesario"
        });
    }

    if (typeof req.body.idAntecedentesSociales === 'number') {
        const sql = `select 	
        idAntecedentesSociales, 
        puestoSindical, 
        cualPuestoSindical, 
        cargoSindical, 
        partidoPolitico, 
        cualPartidoPolitico,
        cargoPartidoPolitico,
        deporte,
        cualDeporte,
        religion, 
        religionFrecuencia,
        alcohol,
        alcoholFrecuencia,
        fuma,
        fumaFrecuencia,
        intervencionQuirurgica,
        enfermedadHereditaria,
        planCortoPlazo,
        planMedianoPlazo,
        estatus,
        estatusproceso
        from antecedentes_sociales where estatus = '1' and idAntecedentesSociales = ${req.body.idAntecedentesSociales}`;

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

//Antecedente Social inactivo
const Proc_AntSoc_Inactivo_R = (req = request, res = response) => {

    if (req.body["idAntecedentesSociales"] === undefined) {
        res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idAntecedentesSociales' es necesario"
        });
    }

    if (typeof req.body.idAntecedentesSociales === 'number') {
        const sql = `select 	
        idAntecedentesSociales, 
        puestoSindical, 
        cualPuestoSindical, 
        cargoSindical, 
        partidoPolitico, 
        cualPartidoPolitico,
        cargoPartidoPolitico,
        deporte,
        cualDeporte,
        religion, 
        religionFrecuencia,
        alcohol,
        alcoholFrecuencia,
        fuma,
        fumaFrecuencia,
        intervencionQuirurgica,
        enfermedadHereditaria,
        planCortoPlazo,
        planMedianoPlazo,
        estatus,
        estatusproceso
        from antecedentes_sociales where estatus = '0' and idAntecedentesSociales = ${req.body.idAntecedentesSociales}`;

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
const Proc_AntSoc_Desactivar_D = (req = request, res = response) => {

    if (req.body["idAntecedentesSociales"] === undefined) {
       return  res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idAntecedentesSociales' es necesario"
        });
    }

    if (typeof req.body.idAntecedentesSociales === 'number') {

        const sql = `update antecedentes_sociales set estatus = 0 where estatus = 1 and idAntecedentesSociales = ${req.body.idAntecedentesSociales}`;
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
                    msg: 'Ancededente Social desactivado correctamente'
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
const Proc_AntSoc_Activar_A = (req = request, res = response) => {

    if (req.body["idAntecedentesSociales"] === undefined) {
        return res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idAntecedentesSociales' es necesario"
        });
    }

    if (typeof req.body.idAntecedentesSociales === 'number') {

        const sql = `update antecedentes_sociales set estatus = 1 where estatus = 0 and idAntecedentesSociales = ${req.body.idAntecedentesSociales}`;
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
                    msg: 'Antecedente Social activado correctamente'
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

//Crear Anteedente Social
const Proc_AntSoc_C = async(req = request, res = response) => {
    let antsoc_id = null;
    try {
        const validarEstructura = await Validar_Proc_AntSoc_Estructura(req);
        await Validar_Candidato_Proceso(req);
    
        if (validarEstructura){
            let cualPuestoSindical;
            let cargoSindical;
            let cualPartidoPolitico;
            let cargoPartidoPolitico;
            let cualDeporte;
            let religionFrecuencia;
            let alcoholFrecuencia;
            let fumaFrecuencia;

            req.body.puestoSindical === 0 ? cualPuestoSindical = null : cualPuestoSindical = `'${req.body.cualPuestoSindical}'`;
            req.body.puestoSindical === 0 ? cargoSindical = null : cargoSindical = `'${req.body.cargoSindical}'`;
            
            req.body.partidoPolitico === 0 ? cualPartidoPolitico= null : cualPartidoPolitico = `'${req.body.cualPartidoPolitico}'`;
            req.body.partidoPolitico === 0 ? cargoPartidoPolitico= null : cargoPartidoPolitico = `'${req.body.cargoPartidoPolitico}'`;

            req.body.deporte === 0 ? cualDeporte = null : cualDeporte = `'${req.body.cualDeporte}'`;

            req.body.religion === 0 ? religionFrecuencia = null : religionFrecuencia = `'${req.body.religionFrecuencia}'`;

            req.body.alcohol === 0 ? alcoholFrecuencia = null : alcoholFrecuencia = `'${req.body.alcoholFrecuencia}'`;

            req.body.fuma === 0 ? fumaFrecuencia = null : fumaFrecuencia = `'${req.body.fumaFrecuencia}'`;
            
            const sql = `INSERT INTO antecedentes_sociales (puestoSindical, cualPuestoSindical, cargoSindical, partidoPolitico, cualPartidoPolitico, cargoPartidoPolitico, deporte, cualDeporte, religion, religionFrecuencia, alcohol, alcoholFrecuencia, fuma, fumaFrecuencia, intervencionQuirurgica, enfermedadHereditaria, planCortoPlazo, planMedianoPlazo, estatus, estatusproceso) VALUES(${parseInt(req.body.puestoSindical)}, ${cualPuestoSindical}, ${cargoSindical}, ${parseInt(req.body.partidoPolitico)}, ${cualPartidoPolitico}, ${cargoPartidoPolitico}, ${parseInt(req.body.deporte)}, ${cualDeporte}, ${parseInt(req.body.religion)}, ${religionFrecuencia}, ${parseInt(req.body.alcohol)}, ${alcoholFrecuencia}, ${parseInt(req.body.fuma)}, ${fumaFrecuencia}, ${parseInt(req.body.intervencionQuirurgica)}, ${parseInt(req.body.enfermedadHereditaria)}, '${req.body.planCortoPlazo}', '${req.body.planMedianoPlazo}', '1', 1)`;
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
                        return res.status(400).json({
                            status: 'invalidAction',
                            msg: 'No se afecto ningun registro, validar los campos'
                        });
                    }
                    antsoc_id = result.insertId
                    if(antsoc_id != null){
                        const relacionarCandidato = await Proc_AntSoc_Relacionar(req.body.idCandidato ,antsoc_id);
                        if(relacionarCandidato){
                            
                            res.status(200).json({
                                status: 'OK',
                                msg: 'El Antecedente Social se creo y relaciono correctamente'
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
        res.status(400).json(error);
    }    
    
};

//Modificar Anteedente Social
const Proc_AntSoc_U = async(req = request, res = response) => {
    try {
        const validarEstructura = await Validar_Proc_AntSoc_Estructura(req);
        if (validarEstructura){

            let cualPuestoSindical;
            let cargoSindical;
            let cualPartidoPolitico;
            let cargoPartidoPolitico;
            let cualDeporte;
            let religionFrecuencia;
            let alcoholFrecuencia;
            let fumaFrecuencia;

            req.body.puestoSindical === 0 ? cualPuestoSindical = null : cualPuestoSindical = `'${req.body.cualPuestoSindical}'`;
            req.body.puestoSindical === 0 ? cargoSindical = null : cargoSindical = `'${req.body.cargoSindical}'`;
            
            req.body.partidoPolitico === 0 ? cualPartidoPolitico= null : cualPartidoPolitico = `'${req.body.cualPartidoPolitico}'`;
            req.body.partidoPolitico === 0 ? cargoPartidoPolitico= null : cargoPartidoPolitico = `'${req.body.cargoPartidoPolitico}'`;

            req.body.deporte === 0 ? cualDeporte = null : cualDeporte = `'${req.body.cualDeporte}'`;

            req.body.religion === 0 ? religionFrecuencia = null : religionFrecuencia = `'${req.body.religionFrecuencia}'`;

            req.body.alcohol === 0 ? alcoholFrecuencia = null : alcoholFrecuencia = `'${req.body.alcoholFrecuencia}'`;

            req.body.fuma === 0 ? fumaFrecuencia = null : fumaFrecuencia = `'${req.body.fumaFrecuencia}'`;

            const sql = `UPDATE antecedentes_sociales INNER JOIN candidato c ON antecedentes_sociales.idAntecedentesSociales = c.idAntecedentesSociales  SET antecedentes_sociales.puestoSindical=${parseInt(req.body.puestoSindical)}, antecedentes_sociales.cualPuestoSindical=${cualPuestoSindical}, antecedentes_sociales.cargoSindical=${cargoSindical}, antecedentes_sociales.partidoPolitico=${parseInt(req.body.partidoPolitico)}, antecedentes_sociales.cualPartidoPolitico=${cualPartidoPolitico}, antecedentes_sociales.cargoPartidoPolitico=${cargoPartidoPolitico}, antecedentes_sociales.deporte=${parseInt(req.body.deporte)}, antecedentes_sociales.cualDeporte=${cualDeporte}, antecedentes_sociales.religion=${parseInt(req.body.religion)}, antecedentes_sociales.religionFrecuencia=${religionFrecuencia}, antecedentes_sociales.alcohol=${parseInt(req.body.alcohol)}, antecedentes_sociales.alcoholFrecuencia=${alcoholFrecuencia}, antecedentes_sociales.fuma=${parseInt(req.body.fuma)}, antecedentes_sociales.fumaFrecuencia=${fumaFrecuencia}, antecedentes_sociales.intervencionQuirurgica=${parseInt(req.body.intervencionQuirurgica)}, antecedentes_sociales.enfermedadHereditaria=${parseInt(req.body.enfermedadHereditaria)}, antecedentes_sociales.planCortoPlazo='${req.body.planCortoPlazo}', antecedentes_sociales.planMedianoPlazo='${req.body.planMedianoPlazo}' WHERE antecedentes_sociales.idAntecedentesSociales=${parseInt(req.body.idAntecedentesSociales)} AND c.idCandidato = ${parseInt(req.body.idCandidato)} AND antecedentes_sociales.estatus = '1' AND antecedentes_sociales.estatusproceso = 1 `;
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
                            msg: 'No se afecto ningun registro, el Antecedente Social no existe'
                        });
                    }
    
                    res.status(200).json({
                        status: 'OK',
                        msg: 'Ancededente Social modificado correctamente'
                    });
                }
            });
        }    
    } catch (error) {
        res.status(400).json(error);
    }
};

//Estatus Proceso 
const Proc_AntSoc_Actualizar_Proceso_E = (req = request, res = response) => {

    if (req.body["idAntecedentesSociales"] === undefined) {
        return res.status(400).json({
            status: 'noData',
            msg: "El atributo 'idAntecedentesSociales' es necesario"
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

    if (typeof req.body.idAntecedentesSociales === 'number' && typeof req.body.estatusproceso === 'number') {

        const sql = `UPDATE antecedentes_sociales aso INNER JOIN candidato c ON aso.idAntecedentesSociales = c.idAntecedentesSociales  SET aso.estatusproceso = ${req.body.estatusproceso} where aso.estatus = 1 and aso.idAntecedentesSociales = ${req.body.idAntecedentesSociales} AND c.idCandidato = ${parseInt(req.body.idCandidato)}`;
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
                        msg: 'No se enctontro el antecedente social'
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
    Proc_AntSoc_Activos_R,
    Proc_AntSoc_Inactivos_R,
    Proc_AntSoc_Activo_R,
    Proc_AntSoc_Inactivo_R,
    Proc_AntSoc_Desactivar_D,
    Proc_AntSoc_Activar_A,
    Proc_AntSoc_C,
    Proc_AntSoc_U,
    Proc_AntSoc_Actualizar_Proceso_E
};