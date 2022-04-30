const SQL = require('../db/connection');

const { response, request } = require('express');

const Mysql = new SQL();

const Validar_Estructura = (req) => {
    const promesa = new Promise((resolve, reject) => {
        let atributos = [];
        if (req.body["idCatEstadoCivil"] === undefined)
            atributos.push('idCatEstadoCivil');
        if (req.body["descripcion"] === undefined)
            atributos.push('descripcion');
        if (atributos.length > 0)
            reject({
                status: 'noData',
                msj: `Los atributos ${atributos} son necesarios`
            });
        resolve(true);
    });
    return promesa;
};

const Cat_EstadoCivil_R = (req = request, res = response) => {

    const sql = 'SELECT * FROM cat_estado_civil';

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0)
            res.json(result);
        else
            res.send({ status: 'void', msg: 'No se encontraron registros' });
    });

};

const Cat_EstadoCivil_R_id = (req = request, res = response) => {

    if (req.body["idCatEstadoCivil"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idCatEstadoCivil' es necesario"
        });
    }

    if (typeof req.body.idCatEstadoCivil === 'number') {

        const { idCatEstadoCivil } = req.body;
        const sql = `SELECT * FROM cat_estado_civil WHERE idCatEstadoCivil = ${idCatEstadoCivil}`;

        Mysql.connection.query(sql, (error, result) => {
            if (error) throw error;
            if (result.length > 0)
                res.json(result);
            else
                res.send({ status: 'void', msg: 'No se encontraron registros' });
        });
    } else {
        res.json({
            status: 'typeof',
            msg: 'El id recibido no es un numero'
        });
    }
};

const Cat_EstadoCivil_C = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.descripcion === 'string') {
                const sql = `INSERT INTO cat_estado_civil values(null, '${req.body.descripcion}')`;
                Mysql.connection.query(sql, (error, result) => {
                    if (error) throw error;
                    res.send({
                        status: 'OK',
                        msg: 'Registro agregado'
                    });
                });

            } else {
                res.json({
                    status: 'typeof',
                    msg: 'La descripcion tienen que ser de tipo string'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });
};

const Cat_EstadoCivil_U = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.idCatEstadoCivil === 'number' && typeof req.body.descripcion === 'string') {
                const sql = `UPDATE cat_estado_civil SET descripcion = '${req.body.descripcion}' WHERE idCatEstadoCivil = ${req.body.idCatEstadoCivil}`;
                Mysql.connection.query(sql, error => {
                    if (error) throw error;
                    res.send({
                        status: 'OK',
                        msg: 'Registro modificado'
                    });
                });
            } else {
                res.json({
                    status: 'typeof',
                    msg: 'El idCatEstadoCivil tiene que ser de tipo numerico y descripcion tienen que ser de tipo string'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });
};

const Cat_EstadoCivil_D = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.idCatEstadoCivil === 'number') {
                const sql = `DELETE FROM cat_estado_civil WHERE idCatEstadoCivil = ${req.body.idCatEstadoCivil}`;
                Mysql.connection.query(sql, error => {
                    if (error) throw error;
                    res.send({
                        status: 'OK',
                        msg: 'Registro eliminado'
                    });
                });
            } else {
                res.json({
                    status: 'typeof',
                    msg: 'El idCatEstadoCivil tiene que ser de tipo numerico'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });

};

module.exports = {
    Cat_EstadoCivil_R,
    Cat_EstadoCivil_R_id,
    Cat_EstadoCivil_C,
    Cat_EstadoCivil_U,
    Cat_EstadoCivil_D
};