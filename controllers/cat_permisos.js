const SQL = require('../db/connection');

const { response, request } = require('express');

const Mysql = new SQL();

const Validar_Estructura = (req) => {
    const promesa = new Promise((resolve, reject) => {
        let atributos = [];
        if (req.body["idPermiso"] === undefined)
            atributos.push('idPermiso');
        if (req.body["nombre"] === undefined)
            atributos.push('nombre');
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

const Cat_Permisos_R = (req = request, res = response) => {
    const sql = 'SELECT * FROM cat_permisos';

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0)
            res.json(result);
        else
            res.send({ status: 'void', msg: 'No se encontraron registros' });
    });

};

const Cat_Permisos_R_id = (req = request, res = response) => {

    if (req.body["idPermiso"] === undefined) {
        res.json({
            status: 'noData',
            msg: "El atributo 'idPermiso' es necesario"
        });
    }

    if (typeof req.body.idPermiso === 'number') {

        const { idPermiso } = req.body;
        const sql = `SELECT * FROM cat_permisos WHERE idCatPermisos = ${idPermiso}`;

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

const Cat_Permisos_C = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.nombre === 'string' && typeof req.body.descripcion === 'string') {
                const sql = `INSERT INTO Cat_Permisos values(null, '${req.body.nombre}', '${req.body.descripcion}')`;
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
                    msg: 'El nombre y descripcion tienen que ser de tipo string'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });
};

const Cat_Permisos_U = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.idPermiso === 'number' && typeof req.body.nombre === 'string' && typeof req.body.descripcion === 'string') {
                const sql = `UPDATE Cat_Permisos SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}' WHERE idCatPermisos = ${req.body.idPermiso}`;
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
                    msg: 'El idPermiso tiene que ser de tipo numerico, nombre y descripcion tienen que ser de tipo string'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });

};

const Cat_Permisos_D = async(req = request, res = response) => {

    await Validar_Estructura(req)
        .then(retorno => {
            if (retorno && typeof req.body.idPermiso === 'number') {
                const sql = `DELETE FROM Cat_Permisos WHERE idCatPermisos = ${req.body.idPermiso}`;
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
                    msg: 'El idPermiso tiene que ser de tipo numerico'
                });
            }
        })
        .catch(error => {
            res.json(error);
        });



};

module.exports = {
    Cat_Permisos_R,
    Cat_Permisos_R_id,
    Cat_Permisos_C,
    Cat_Permisos_U,
    Cat_Permisos_D
};