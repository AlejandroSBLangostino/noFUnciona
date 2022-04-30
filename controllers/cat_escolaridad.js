const SQL = require('../db/connection');

const { response, request } = require('express');

const Mysql = new SQL();

const Validar_Estructura = (req) => {
    const promesa = new Promise((resolve, reject) => {
        let atributos = [];
        if (req.body["idCatEscolaridad"] === undefined)
            atributos.push('idCatEscolaridad');
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

const Cat_Escolaridad_R = (req = request, res = response) => {
    const sql = 'SELECT * FROM cat_escolaridad';

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0)
            res.json(result);
        else
            res.send({ status: 'void', msg: 'No se encontraron registros' });
    });

};

const Cat_Escolaridad_R_id = (req = request, res = response) => {

    if (req.body["idCatEscolaridad"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idCatEscolaridad' es necesario"
        });
    }

    if (typeof req.body.idCatEscolaridad === 'number') {

        const { idCatEscolaridad } = req.body;
        const sql = `SELECT * FROM cat_escolaridad WHERE idCatEscolaridad = ${idCatEscolaridad}`;

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

const Cat_Escolaridad_C = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.descripcion === 'string') {
                const sql = `INSERT INTO cat_escolaridad values(null, '${req.body.descripcion}')`;
                Mysql.connection.query(sql, error => {
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

const Cat_Escolaridad_U = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.idCatEscolaridad === 'number' && typeof req.body.descripcion === 'string') {
                const sql = `UPDATE cat_escolaridad SET descripcion = '${req.body.descripcion}' WHERE idCatEscolaridad = ${req.body.idCatEscolaridad}`;
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
                    msg: 'El idCatEscolaridad tiene que ser de tipo numerico y descripcion tienen que ser de tipo string'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });

};

const Cat_Escolaridad_D = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.idCatEscolaridad === 'number') {
                const sql = `DELETE FROM cat_escolaridad WHERE idCatEscolaridad = ${req.body.idCatEscolaridad}`;
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
                    msg: 'El idCatEscolaridad tiene que ser de tipo numerico'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });



};

module.exports = {
    Cat_Escolaridad_R,
    Cat_Escolaridad_R_id,
    Cat_Escolaridad_C,
    Cat_Escolaridad_U,
    Cat_Escolaridad_D
};