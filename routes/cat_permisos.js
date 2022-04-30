const { Router } = require('express');
const cors = require('cors');
const {
    Cat_Permisos_R,
    Cat_Permisos_R_id,
    Cat_Permisos_C,
    Cat_Permisos_U,
    Cat_Permisos_D
} = require('../controllers/cat_permisos');


const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();

//READ ALL
router.get('/_R', cors(corsOptions), Cat_Permisos_R);
//READ ONE
router.get('/_R_1', cors(corsOptions), Cat_Permisos_R_id);
//CREAR
router.post('/_C', cors(corsOptions), Cat_Permisos_C);
//MODIFICAR
router.put('/_U', cors(corsOptions), Cat_Permisos_U);
//ELIMINAR
router.delete('/_D', cors(corsOptions), Cat_Permisos_D);



module.exports = router;