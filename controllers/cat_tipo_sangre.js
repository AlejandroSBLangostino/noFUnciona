const SQL = require('../db/connection')

const { response, request } = require('express');

const Mysql = new SQL();


const Cat_Tipo_Sangre_R = (req = request, res = response) => {
    const sql = 'SELECT * FROM cat_tipo_sangre';

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0)
            res.json(result);
        else
            res.send('No se encontraron registros');
    });
};

const Cat_Tipo_Sangre_R_id = (req = request, res = response) => {

    const { id } = req.params;
    const sql = `SELECT * FROM cat_tipo_sangre WHERE idCatEscolaridad = ${id}`;

    Mysql.connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0)
            res.json(result);
        else
            res.send('No se encontraron registros');
    });
};

const Cat_Tipo_Sangre_C = (req = request, res = response) => {
    const sql = `INSERT INTO cat_tipo_sangre values(null, '${req.body.descripcion}')`;

    Mysql.connection.query(sql, error => {
        if (error) throw error;
        res.send('Registro creado!!!')
    });
};

const Cat_Tipo_Sangre_U = (req = request, res = response) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    const sql = `UPDATE cat_tipo_sangre SET descripcion = '${descripcion}' WHERE idCatEscolaridad = ${id}`;

    Mysql.connection.query(sql, error => {
        if (error) throw error;
        res.send('Registro modificado!!')
    });
};

const Cat_Tipo_Sangre_D = (req = request, res = response) => {
    const { id } = req.params;
    const sql = `DELETE FROM cat_tipo_sangre WHERE idCatEscolaridad = ${id}`;

    Mysql.connection.query(sql, error => {
        if (error) throw error;
        res.send('Registro eliminado!!!')
    });
};

module.exports = {
    Cat_Tipo_Sangre_C,
    Cat_Tipo_Sangre_R,
    Cat_Tipo_Sangre_R_id,
    Cat_Tipo_Sangre_U,
    Cat_Tipo_Sangre_D
};