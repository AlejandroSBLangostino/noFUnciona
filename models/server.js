const express = require('express');
const cors = require('cors');
//const SQL = require('../db/connection');

class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
        this.corsOptions = {
            //origin: 'http://localhost:4200',//Nombre de Dominios que podran acceder al Backend
            origin: '*',
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
            optionsSuccessStatus: 200
        };
        //this.Mysql = new SQL();

        this.middleware();
        this.routes();
    }

    middleware() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({
            extended: true,
            limit: '50mb'
        }));
        this.app.use(cors(this.corsOptions));
    }

    routes() {

        //RUTAS------------------------->

        //CONSTROL DE USUARIOS---
        //USUARIOS DEL SISTEMA
        // this.app.use('/usuario_sistema', require('../routes/usuarios'));

        // //CLIENTES Y PAQUETES
        // this.app.use('/cliente', require('../routes/cliente'));
        // //Los paquetes podrian verse como catalogo, pero son mas importantes que un simple catalogo
        // this.app.use('/paquete', require('../routes/paquete'));

        // //LABORATORIOS
        // this.app.use('/laboratorio', require('../routes/laboratorio'));

        // //CANDIDATOS
        // this.app.use('/candidato', require('../routes/candidato'));

        // //CONTROL DE SESIONES---
        // //SESIONES
        // this.app.use('/sesiones', require('../routes/sesion'));
        // //AUTENTIFICACION    
        // this.app.use('/autenticacion', require('../routes/autenticacion'));

        // //PROCESOS---
        // //ANTECEDENTES SOCIALES
        // this.app.use('/proc_antsoc', require('../routes/proc_antecedentes_sociales'));
        // this.app.use('/proc_invleg', require('../routes/proc_investigacion_legal'));
        // this.app.use('/proc_hisaca', require('../routes/proc_historial_academico'));


        // //CATALOGOS
        // this.app.use('/cat_genero', require('../routes/cat_genero'));
        // this.app.use('/cat_permisos', require('../routes/cat_permisos'));
        // this.app.use('/cat_tipo_sangre', require('../routes/cat_tipo_sangre'));
        // this.app.use('/cat_escolaridad', require('../routes/cat_escolaridad'));
        // this.app.use('/cat_estado_civil', require('../routes/cat_esado_civil'));


        //HOLA MUNDO
        this.app.get('/', cors(this.corsOptions), (req, res) => {
            res.json({ status: 'test', msg: 'Hola Mundo desde API en Node.js Express' });
            
        });


    }

    listen() {
        this.app.listen(this.PORT, () => console.log(`Server corriendo en el puerto ${this.PORT}`));

    }

}

module.exports = Server;