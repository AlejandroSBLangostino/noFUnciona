const mysql = require('mysql');

class SQL {

    constructor() {
        //Conexion a DB
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'connecting_humans'
        });
        // this.connection = mysql.createConnection({
        //     host: 'us-cdbr-east-05.cleardb.net',
        //     user: 'bd7f2418edf8d7',
        //     password: '233af0e3',
        //     database: 'heroku_ec356f3baed17a0'
        // });

    }

    AbrirConexion() {
        this.connection.connect(error => {
            if (error) throw error;
            console.log('Conexion exitosa');
        });
    }

    CerrarConexion() {
        this.connection.end(function(error) {
            if (error) throw error;
            console.log('Desconexion exitosa');
        });
    }

}

module.exports = SQL;