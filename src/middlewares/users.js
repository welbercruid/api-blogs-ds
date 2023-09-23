const mongoose = require("mongoose");
const blogsModel = require("../schemas/blogs");
//const userModel = require('../schemas/users');
const validateIdBlog = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`ID invalido de mongoDB (${id})`);
        return res.status(404).json({msj: "ID inválido"});
    }
    try {
        const blog = await blogsModel.findById(id);
        if (!blog) {
            console.log("Blog no encontrado");
            return res.status(404).json({msj: "Blog no encontrado"})
        }
    } catch (error) {
        console.log("Error al buscar el ID en la base de datos");
        return res.status(500).json({msj: "Error de servidor"});
    }    
    console.log("Middleware validateIdBlog");
    next();
}

// const restrictPropertiesBlog = async (req, res, next) => {
//     try {
//         const restrictProps = ["active", "author", "username"];
//         const props = await Object.keys(req.body);
//         const hasRestrictedProps = props.some((prop) => restrictProps.includes(prop));
//         if (hasRestrictedProps) {
//             return res.status(400).json({error: "No se pueden modificar ciertas propiedades"});
//         }

//         // const { title, description, image, ... extraProp} = req.body;
//         // const allowedProps = ["title", "description", "image"];
//         // for(const prop in extraProp) {
//         //     if (!allowedProps.includes(prop)) {
//         //         return res.status(400).json({mensaje: `La propiedad ${prop} no está permitida.`})
//         //     }
//         // }

//         // if (Object.keys(req.body).length !== allowedProps.length) {//ver si interfiere en editarBlog
//         //     return res.status(404).json({
//         //         msj: "Falta data."
//         //     });
//         // }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({msj: "Error de servidor"});
//     }    
//     console.log("middleware restrictPropertiesBlog");
//     next();
// }
const restrictPropertiesBlog = async (req, res, next) => {
    try {
        // const restrictProps = ["active", "author", "username"];
        // const props = await Object.keys(req.body);
        // const hasRestrictedProps = props.some((prop) => restrictProps.includes(prop));
        // if (hasRestrictedProps) {
        //     return res.status(400).json({error: "No se pueden modificar ciertas propiedades"});
        // }

        const { title, description, image, ... extraProp} = req.body;
        const allowedProps = ["title", "description", "image"];
        for(const prop in extraProp) {
            if (!allowedProps.includes(prop)) {
                return res.status(400).json({mensaje: `La propiedad ${prop} no está permitida.`})
            }
        }

        // if (Object.keys(req.body).length !== allowedProps.length) {
        //     return res.status(400).json({mensaje: "Falta data."});
        // }
    } catch (error) {
        console.error(error);
        return res.status(500).json({msj: "Error de servidor"});
    }    
    console.log("middleware restrictPropertiesBlog");
    next();
}

// const userBloqued = async (req, res, next) => {    
//     try {
//         const {username, password} = req.body;
//         console.log("el body userbloqued ", req.body);
//         const user = await userModel.findByCredentials(username, password); 
//         console.log("userbloqued ", user);        
//         const stateUser = await userModel.findOne(user);
//         console.log("userbloqued ", stateUser);
              
//         if (stateUser.active === false) {
//             return res.status(401).json({ msj: `Cuenta bloqueada. userBloqued` });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ msj: "Error inesperado userbloqued"});
//     }
//     console.log("Middleware userBloqued");
//     next();
// }

module.exports = {validateIdBlog, restrictPropertiesBlog,/*  userBloqued */}