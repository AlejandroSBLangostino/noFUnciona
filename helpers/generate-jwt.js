const jwt = require('jsonwebtoken');

const generateJWT = (uid = '', sid = '') => {

    return new Promise((resolve, reject) => {
        //Cuerpo del token
        const payload = {uid, sid};
        jwt.sign(payload, "ConneCt1n6Hum4nBack", 
        {expiresIn: '1h'},
        (error, token) => {
            if(error){
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT
}