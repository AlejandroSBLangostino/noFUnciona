const { Router } = require('express');
const cors = require('cors');

const {
    login
} = require('../controllers/autenticacion');

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const router = Router();
router.post('/login', cors(corsOptions), login);

module.exports = router;