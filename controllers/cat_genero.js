const SQL = require('../db/connection');

const { response, request } = require('express');

const Mysql = new SQL();

const Cat_Genero_R = (req = request, res = response) => {
    const sql = 'SELECT * FROM cat_genero';

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0)
            res.json(result);
        else
            res.send({ status: 'void', msg: 'No se encontraron registros' });
    });

};

const Cat_Genero_R_id = (req = request, res = response) => {

    const { id } = req.params;
    const sql = `SELECT * FROM cat_genero WHERE idCatGenero = ${id}`;

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0)
            res.json(result);
        else
            res.send({ status: 'void', msg: 'No se encontraron registros' });
    });

};

const Cat_Genero_C = (req = request, res = response) => {
    const sql = `INSERT INTO Cat_Genero values(null, '${req.body.descripcion}')`;

    Mysql.connection.query(sql, error => {
        if (error) throw error;
        res.send({ status: 'OK', msg: 'Registro creado' });
    });
};

const Cat_Genero_U = (req = request, res = response) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    const sql = `UPDATE Cat_Genero SET descripcion = '${descripcion}' WHERE idCatGenero = ${id}`;

    Mysql.connection.query(sql, error => {
        if (error) throw error;
        res.send({ status: 'OK', msg: 'Registro actualizado' });
    });
};

const Cat_Genero_D = (req = request, res = response) => {
    const { id } = req.params;
    const sql = `DELETE FROM Cat_Genero WHERE idCatGenero = ${id}`;

    Mysql.connection.query(sql, error => {
        if (error) throw error;
        res.send({ status: 'OK', msg: 'Registro eliminado' });
    });
};

module.exports = {
    Cat_Genero_C,
    Cat_Genero_R,
    Cat_Genero_R_id,
    Cat_Genero_U,
    Cat_Genero_D
};