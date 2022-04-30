const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const validaJWT = (req = request, res = response, next) => {
    const token = req.header('token-api-ch');
    if(token === undefined){
        return res.status(401).json({
            status: 'noToken',
            msg: 'La peticion necesita de un token'
        });
    }

    try {
        const payload = jwt.verify(token,'ConneCt1n6Hum4nBack');
        
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'errorToken',
            msg: 'El token es invalido',
            error
        });
    }

}

module.exports = {
    validaJWT
}