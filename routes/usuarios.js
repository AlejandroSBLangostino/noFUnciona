const { Router } = require('express');
const cors = require('cors');
const {
    Usuario_Activos_R,
    Usuario_Inactivos_R,
    Usuario_Activo_R,
    Usuario_Inactivo_R,
    Usuario_Desactivar_D,
    Usuario_Activar_A,
    Usuario_C,
    Usuario_U
} = require('../controllers/usuario');
const { validaJWT } = require('../middlewares/validar-jwt');


const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();
//MOSTRAR TODOS
router.get('/As_R',[validaJWT], cors(corsOptions), Usuario_Activos_R);
router.get('/Is_R', cors(corsOptions), Usuario_Inactivos_R);
//MOSTRAR UNO
router.post('/A_R', cors(corsOptions), Usuario_Activo_R);
router.post('/I_R', cors(corsOptions), Usuario_Inactivo_R);
//DESACTIVAR
router.post('/_D', cors(corsOptions), Usuario_Desactivar_D);
//ACTIVAR
router.post('/_A', cors(corsOptions), Usuario_Activar_A);
//CREAR
router.post('/_C', cors(corsOptions), Usuario_C);
//MODIFICAR
router.post('/_U', cors(corsOptions), Usuario_U);





module.exports = router;