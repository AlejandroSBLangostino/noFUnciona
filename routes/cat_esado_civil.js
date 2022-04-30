const { Router } = require('express');
const cors = require('cors');
const {
    Cat_EstadoCivil_R,
    Cat_EstadoCivil_R_id,
    Cat_EstadoCivil_C,
    Cat_EstadoCivil_U,
    Cat_EstadoCivil_D
} = require('../controllers/cat_estado_civil');


const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();

//READ ALL
router.get('/_R', cors(corsOptions), Cat_EstadoCivil_R);
//READ ONE
router.get('/_R_1', cors(corsOptions), Cat_EstadoCivil_R_id);
//CREAR
router.post('/_C', cors(corsOptions), Cat_EstadoCivil_C);
//MODIFICAR
router.put('/_U', cors(corsOptions), Cat_EstadoCivil_U);
//ELIMINAR
router.delete('/_D', cors(corsOptions), Cat_EstadoCivil_D);



module.exports = router;