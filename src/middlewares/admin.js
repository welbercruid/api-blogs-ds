const mongoose = require('mongoose');
const userModel = require('../schemas/users');

// const adminLogger = (req, res, next) => {
//     console.log("Todo lo que pase por users para por acá");
//     next();
// }

const logged = async (req, res, next) => {
    try {
        if(!req.user.admin) return res.status(403).json({msj: "Acceso no autorizado"});
        next();
    } catch (error) {
        /* if (!user)  */return res.status(500).json({ msj: "Error inesperado"});
    }
}

const validateID = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`ID invalido de mongoDB (${id})`);
        return res.status(404).json({msj: "ID inválido"});
    }
    try {
        const user = await userModel.findById(id);
        if (!user) {
            console.log("ID no encontrado");
            return res.status(404).json({msj: "ID no encontrado"})
        }
    } catch (error) {
        console.log("Error al buscar el ID en la base de datos");
        return res.status(500).json({msj: "Error de servidor"});
    }    
    console.log("Middleware validateID");
    next();
}

module.exports = { /* adminLogger, */ validateID, logged };