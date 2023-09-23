const config = require('../config');
const jwt = require('jsonwebtoken');

const logged = async (req, res, next) => {
    try {
        const bearerToken = req.header('authorization');
        //console.log(bearerToken);
        if (!bearerToken) return res.status(401).json({msj: "Autenticación fallida. no token"});

        const token = bearerToken.split(' ')[1]; 
        //console.log("token: ",token);
        const user = await dataFromToken(token);
        //console.log("el user", user);
        if(!user || !user.id) return res.status(401).json({msj: "Autenticación fallida. bad token"});

        req.user = user;
        next();
    } catch (error) {
        /* if (!user)  */return res.status(500).json({ msj: "Error inesperado. logged"});
    }
}

const dataFromToken = async (token) => {
    try {
        const data = jwt.verify(token, config.TOKEN_SECRET);
        //console.log("data", data);
        return data;        
    } catch (error) {
        throw error;
    }
}

module.exports = logged