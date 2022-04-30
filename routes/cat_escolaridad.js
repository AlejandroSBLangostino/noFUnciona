const { Router } = require('express');
const cors = require('cors');
const {
    Cat_Escolaridad_R,
    Cat_Escolaridad_R_id,
    Cat_Escolaridad_C,
    Cat_Escolaridad_U,
    Cat_Escolaridad_D
} = require('../controllers/cat_escolaridad');


const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();

//READ ALL
router.get('/_R', cors(corsOptions), Cat_Escolaridad_R);
//READ ONE
router.get('/_R_1', cors(corsOptions), Cat_Escolaridad_R_id);
//CREAR
router.post('/_C', cors(corsOptions), Cat_Escolaridad_C);
//MODIFICAR
router.put('/_U', cors(corsOptions), Cat_Escolaridad_U);
//ELIMINAR
router.delete('/_D', cors(corsOptions), Cat_Escolaridad_D);



module.exports = router;