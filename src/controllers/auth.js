const userModel = require('../schemas/users');
const jwt = require('jsonwebtoken');
const config = require('../config');

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

        if (stateUser.active === false) {
            return res.status(401).json({ msj: `Cuenta bloqueada.` });
        }
        
        const token = jwt.sign(
            { username: user.username, id: user._id , admin: user.admin },
            config.TOKEN_SECRET
        );
        
        let message = user.admin ? `Hola admin ${stateUser.name}!` : `Hola usuario ${stateUser.name}!`;        
        res.status(200).json({msj: "Login exitoso", message, token});
    } catch (error) {
        console.error(error);
        res.status(401).json({error: error.message});
    }
}

module.exports = { register, login }