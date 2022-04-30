const { Router } = require('express');
const cors = require('cors');
const {
    Laboratorios_Activos_R,
    Laboratorios_Inactivos_R,
    Laboratorio_Activo_R,
    Laboratorio_Inactivo_R,
    Usuario_Laboratorio_Desactivar_D,
    Usuario_Laboratorio_Activar_A,
    Laboratorio_C,
    Laboratorio_U
} = require('../controllers/laboratorio');

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();

//MOSTRAR TODOS
router.get('/As_R', cors(corsOptions), Laboratorios_Activos_R);
router.get('/Is_R', cors(corsOptions), Laboratorios_Inactivos_R);
//MOSTRAR UNO
router.post('/A_R', cors(corsOptions), Laboratorio_Activo_R);
router.post('/I_R', cors(corsOptions), Laboratorio_Inactivo_R);
//DESACTIVAR
router.post('/_D', cors(corsOptions), Usuario_Laboratorio_Desactivar_D);
//ACTIVAR
router.post('/_A', cors(corsOptions), Usuario_Laboratorio_Activar_A);
//CREAR
router.post('/_C', cors(corsOptions), Laboratorio_C);
//MODIFICAR
router.post('/_U', cors(corsOptions), Laboratorio_U);

module.exports = router;