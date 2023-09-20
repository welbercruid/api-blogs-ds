const mongoose = require("mongoose");
const blogsModel = require("../schemas/blogs");

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

const restrictProperties = (req, res, next) => {
    try {
        const restrictProps = ["active", "author", "username"];
        const props = Object.keys(req.body);
        const hasRestrictedProps = props.some((prop) => restrictProps.includes(prop));
        if (hasRestrictedProps) {
            return res.status(400).json({error: "No se pueden modificar ciertas propiedades"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({msj: "Error de servidor"});
    }    
    console.log("middleware restrictProperties");
    next();
}

module.exports = {validateIdBlog, restrictProperties}