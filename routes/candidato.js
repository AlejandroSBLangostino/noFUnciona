const { Router } = require('express');
const cors = require('cors');
const {
    Candidatos_Activos_R,
    Candidatos_Inactivos_R,
    Candidato_Activo_R,
    Candidato_Inactivo_R,
    Candidato_C,
    Usuario_Candidato_Desactivar_D,
    Usuario_Candidato_Activar_A,
    Candidato_U
} = require('../controllers/candidato');

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();

//MOSTRAR TODOS
router.get('/As_R', cors(corsOptions), Candidatos_Activos_R);
router.get('/Is_R', cors(corsOptions), Candidatos_Inactivos_R);
//MOSTRAR UNO
router.post('/A_R', cors(corsOptions), Candidato_Activo_R);
router.post('/I_R', cors(corsOptions), Candidato_Inactivo_R);
//DESACTIVAR
router.post('/_D', cors(corsOptions), Usuario_Candidato_Desactivar_D);
//ACTIVAR
router.post('/_A', cors(corsOptions), Usuario_Candidato_Activar_A);
//CREAR
router.post('/_C', cors(corsOptions), Candidato_C);
//MODIFICAR
router.post('/_U', cors(corsOptions), Candidato_U);

module.exports = router;