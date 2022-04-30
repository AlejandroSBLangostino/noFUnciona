const { Router } = require('express');
const cors = require('cors');
const {
    Clientes_Activos_R,
    Clientes_Inactivos_R,
    Cliente_Activo_R,
    Cliente_Inactivo_R,
    Cliente_C,
    Usuario_Cliente_Activar_A,
    Usuario_Cliente_Desactivar_D,
    Cliente_U
} = require('../controllers/cliente');

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();

//MOSTRAR TODOS
router.get('/As_R', cors(corsOptions), Clientes_Activos_R);
router.get('/Is_R', cors(corsOptions), Clientes_Inactivos_R);
//MOSTRAR UNO
router.post('/A_R', cors(corsOptions), Cliente_Activo_R);
router.post('/I_R', cors(corsOptions), Cliente_Inactivo_R);
//DESACTIVAR
router.post('/_D', cors(corsOptions), Usuario_Cliente_Desactivar_D);
//ACTIVAR
router.post('/_A', cors(corsOptions), Usuario_Cliente_Activar_A);
//CREAR
router.post('/_C', cors(corsOptions), Cliente_C);
//MODIFICAR
router.post('/_U', cors(corsOptions), Cliente_U);

module.exports = router;