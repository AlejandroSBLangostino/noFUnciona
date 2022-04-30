const { Router } = require('express');
const cors = require('cors');
const {
    Proc_AntSoc_Activos_R,
    Proc_AntSoc_Inactivos_R,
    Proc_AntSoc_Activo_R,
    Proc_AntSoc_Inactivo_R,
    Proc_AntSoc_Desactivar_D,
    Proc_AntSoc_Activar_A,
    Proc_AntSoc_C,
    Proc_AntSoc_U,
    Proc_AntSoc_Actualizar_Proceso_E
} = require('../controllers/proc_antecedentes_sociales');

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();

//MOSTRAR TODOS
router.get('/As_R', cors(corsOptions), Proc_AntSoc_Activos_R);
router.get('/Is_R', cors(corsOptions), Proc_AntSoc_Inactivos_R);
//MOSTRAR UNO
router.post('/A_R', cors(corsOptions), Proc_AntSoc_Activo_R);
router.post('/I_R', cors(corsOptions), Proc_AntSoc_Inactivo_R);
//DESACTIVAR
router.post('/_D', cors(corsOptions), Proc_AntSoc_Desactivar_D);
//ACTIVAR
router.post('/_A', cors(corsOptions), Proc_AntSoc_Activar_A);
//CREAR
router.post('/_C', cors(corsOptions), Proc_AntSoc_C);
//MODIFICAR
router.post('/_U', cors(corsOptions), Proc_AntSoc_U);
//CAMBIAR ESTATUS DE PROCESO
router.post('/_E', cors(corsOptions), Proc_AntSoc_Actualizar_Proceso_E);

module.exports = router;