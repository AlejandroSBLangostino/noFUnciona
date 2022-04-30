const { Router } = require('express');
const cors = require('cors');
const {
    Proc_HisAca_Activos_R,
    Proc_HisAca_Inactivos_R,
    Proc_HisAca_Activo_R,
    Proc_HisAca_Inactivo_R,
    Proc_HisAca_Desactivar_D,
    Proc_HisAca_Activar_A,
    Proc_HisAca_C,
    Proc_HisAca_U,
    Proc_HisAca_Actualizar_Proceso_E
} = require('../controllers/proc_historial_academico');

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();

//MOSTRAR TODOS
router.get('/As_R', cors(corsOptions), Proc_HisAca_Activos_R);
router.get('/Is_R', cors(corsOptions), Proc_HisAca_Inactivos_R);
//MOSTRAR UNO
router.post('/A_R', cors(corsOptions), Proc_HisAca_Activo_R);
router.post('/I_R', cors(corsOptions), Proc_HisAca_Inactivo_R);
//DESACTIVAR
router.post('/_D', cors(corsOptions), Proc_HisAca_Desactivar_D);
//ACTIVAR
router.post('/_A', cors(corsOptions), Proc_HisAca_Activar_A);
//CREAR
router.post('/_C', cors(corsOptions), Proc_HisAca_C);
//MODIFICAR
router.post('/_U', cors(corsOptions), Proc_HisAca_U);
//CAMBIAR ESTATUS DE PROCESO
router.post('/_E', cors(corsOptions), Proc_HisAca_Actualizar_Proceso_E);

module.exports = router;