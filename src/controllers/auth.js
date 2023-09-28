const userModel = require('../schemas/users');
const jwt = require('jsonwebtoken');
const config = require('../config');
const sessions = [];

const register = async (req, res) => {
    try {
        let {name, lastname, email, username, password} = req.body;  
        //console.log("el body ", req.body);      
        const user = new userModel({name, lastname, email, username, password, admin: false});
        //console.log(user);
        await user.save();
        res.status(201).json({msj: "Registro exitoso.", user});
    } catch (error) {
        res.status(500).json({msj: "Error. No se pudo registrar."});
    }
}

const login = async (req, res) => {    
    try {        
        const {username, password} = req.body;
        const user = await userModel.findByCredentials(username, password);        
        const stateUser = await userModel.findOne(user);
        const correoAdmin = await userModel.searchMailAdmin();
        
        if (stateUser.active === false) {
            return res.status(401).json({ msj: `Cuenta bloqueada. Comunicarse al correo ${correoAdmin}` });
        }
        
        const token = jwt.sign(
            { username: user.username, id: user._id , admin: user.admin },
            config.TOKEN_SECRET, { expiresIn: config.TOKEN_TTL }
        );
        console.log("el token login", token);
        sessions.push(token);
        console.log("sessions desde login", sessions);
        
        let message = user.admin ? `Hola admin ${stateUser.name}!` : `Hola usuario ${stateUser.name}!`;        
        res.status(200).json({msj: "Login exitoso", message, token});
    } catch (error) {
        console.error(error);
        res.status(401).json({error: error.message});
    }
}
const logout = async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log("el token logout ", token);
        
    try {
        const index = sessions.indexOf(token);
        if (index !== -1) {//si está en el array lo remuevo
            sessions.splice(index, 1);
            console.log(`Token removido de sessions. ${token}`);
            return res.status(200).json({msj: "Sesión cerrada correctamente."});
        } 
        if (index === -1){//si no está
            console.log(`El token no se encuentra en sessions. ${token}`);
            return res.status(404).json({msj: "Not found."});
        }                      
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: "Error al cerrar sesión." });
    }    
}

module.exports = { register, login, logout, sessions }