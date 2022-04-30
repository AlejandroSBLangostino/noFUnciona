const SQL = require('../db/connection');

const { response, request } = require('express');

const Mysql = new SQL();

const Validar_Estructura = (req) => {
    const promesa = new Promise((resolve, reject) => {
        let atributos = [];
        if (req.body["idPaquete"] === undefined)
            atributos.push('idPaquete');
        if (req.body["nombre"] === undefined)
            atributos.push('nombre');
        if (req.body["descripcion"] === undefined)
            atributos.push('descripcion');
        if (req.body["precio"] === undefined)
            atributos.push('precio');
        if (atributos.length > 0)
            reject({
                status: 'noData',
                msj: `Los atributos ${atributos} son necesarios`
            });
        resolve(true);
    });
    return promesa;
};

const Paquete_R = (req = request, res = response) => {
    const sql = 'SELECT * FROM paquete';

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0)
            res.json(result);
        else
            res.send({ status: 'void', msg: 'No se encontraron registros' });
    });

};

const Paquete_R_id = (req = request, res = response) => {

    if (req.body["idPaquete"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idPaquete' es necesario"
        });
    }

    if (typeof req.body.idPaquete === 'number') {

        const { idPaquete } = req.body;
        const sql = `SELECT * FROM paquete WHERE idPaquete = ${idPaquete}`;

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

const Paquete_C = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.nombre === 'string' && typeof req.body.descripcion === 'string' && typeof req.body.precio === 'number') {
                const sql = `INSERT INTO paquete values(null, '${req.body.nombre}', '${req.body.descripcion}', '${req.body.precio}')`;
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
                    msg: 'El precio tiene que ser de tipo numerico, nombre y descripcion tienen que ser de tipo string'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });
};

const Paquete_U = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.idPaquete === 'number' && typeof req.body.nombre === 'string' && typeof req.body.descripcion === 'string' && typeof req.body.precio === 'number') {
                const sql = `UPDATE paquete SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}', precio = ${req.body.precio} WHERE idPaquete = ${req.body.idPaquete}`;
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
                    msg: 'El idPaquete tiene que ser de tipo numerico, nombre y descripcion tienen que ser de tipo string'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });

};

const Paquete_D = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.idPaquete === 'number') {
                const sql = `DELETE FROM paquete WHERE idPaquete = ${req.body.idPaquete}`;
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
                    msg: 'El idPaquete tiene que ser de tipo numerico'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });



};

module.exports = {
    Paquete_R,
    Paquete_R_id,
    Paquete_C,
    Paquete_U,
    Paquete_D
};