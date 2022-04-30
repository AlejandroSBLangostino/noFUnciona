const { Router } = require('express');
const cors = require('cors');
const {
    Paquete_R,
    Paquete_R_id,
    Paquete_C,
    Paquete_U,
    Paquete_D
} = require('../controllers/paquete');


const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();

//READ ALL
router.get('/_R', cors(corsOptions), Paquete_R);
//READ ONE
router.get('/_R_1', cors(corsOptions), Paquete_R_id);
//CREAR
router.post('/_C', cors(corsOptions), Paquete_C);
//MODIFICAR
router.put('/_U', cors(corsOptions), Paquete_U);
//ELIMINAR
router.delete('/_D', cors(corsOptions), Paquete_D);



module.exports = router;