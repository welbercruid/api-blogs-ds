const config = require('../config');
const jwt = require('jsonwebtoken');
const userModel = require('../schemas/users');

const logged = async (req, res, next) => {
    try {
        const bearerToken = req.header('authorization');
        //console.log(bearerToken);
        if (!bearerToken) return res.status(401).json({msj: "Autenticación fallida. no token"});

        const token = bearerToken.split(' ')[1]; 
        //console.log("token: ",token);
        const user = await dataFromToken(token);        
        const stateUser = await userModel.searchStateUser(user.id);
        
        if(!user || !user.id) return res.status(401).json({msj: "Autenticación fallida. bad token"});        
       
        if (stateUser === false) return res.status(401).json({msj: "Usuario bloqueado desde middle"});
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        /* if (!user)  */return res.status(500).json({ msj: "Error inesperado. logged"});
    }
}

const dataFromToken = async (token) => {
    try {
        const data = jwt.verify(token, config.TOKEN_SECRET);
        return data;        
    } catch (error) {
        throw error;
    }
}

module.exports = logged