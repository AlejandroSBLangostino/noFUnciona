const { Router } = require('express');
const cors = require('cors');

const {
    sesiones_usuarios,
    sesiones_C,
    sesiones_D,
    sesiones_U,
    sesiones_id_R,
    sesiones_id_R_desactivadas,
    sesiones_usuarios_desactivadas
} = require('../controllers/sesion');

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();
router.post('/_C', cors(corsOptions), sesiones_C);
router.get('/_R_id', cors(corsOptions), sesiones_id_R);
router.get('/_R', cors(corsOptions), sesiones_usuarios);
router.post('/_U', cors(corsOptions), sesiones_U);
router.delete('/_D', cors(corsOptions), sesiones_D);
router.get('/_R_des', cors(corsOptions), sesiones_usuarios_desactivadas);
router.post('/_R_id_des', cors(corsOptions), sesiones_id_R_desactivadas);




module.exports = router;