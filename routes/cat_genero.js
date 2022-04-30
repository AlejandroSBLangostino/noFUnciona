const { Router } = require('express');
const cors = require('cors');
const {
    Cat_Genero_R,
    Cat_Genero_R_id,
    Cat_Genero_C,
    Cat_Genero_U,
    Cat_Genero_D
} = require('../controllers/cat_genero');


const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();
//READ ALL
router.get('/_R', cors(corsOptions), Cat_Genero_R);

//READ
router.get('/_R/:id', cors(corsOptions), Cat_Genero_R_id);

//CREATE
router.post('/_C', cors(corsOptions), Cat_Genero_C);

//UPDATE
router.put('/_U/:id', cors(corsOptions), Cat_Genero_U);

//DELETE
router.delete('/_D/:id', cors(corsOptions), Cat_Genero_D);

module.exports = router;