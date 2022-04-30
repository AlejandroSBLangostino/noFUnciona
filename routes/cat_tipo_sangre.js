const { Router } = require('express');
const cors = require('cors');

const {
    Cat_Tipo_Sangre_C,
    Cat_Tipo_Sangre_R,
    Cat_Tipo_Sangre_R_id,
    Cat_Tipo_Sangre_U,
    Cat_Tipo_Sangre_D
} = require('../controllers/cat_tipo_sangre');


const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
const router = Router();


//READ ALL
router.get('/_R', cors(corsOptions), Cat_Tipo_Sangre_R);

//READ
router.get('/_R/:id', cors(corsOptions), Cat_Tipo_Sangre_R_id);

//CREATE
router.post('/_C', cors(corsOptions), Cat_Tipo_Sangre_C, );

//UPDATE
router.put('/_U/:id', cors(corsOptions), Cat_Tipo_Sangre_U);

//DELETE
router.delete('/_D/:id', cors(corsOptions), Cat_Tipo_Sangre_D);



module.exports = router;