const userModel = require('../schemas/users');
const blogsModel = require('../schemas/blogs');

const get = async (req, res) => {
    try {
        const {id} = req.params;
        const filter = (id) ? {_id: id} : {};   
        const user = await userModel.find(filter);
        res.status(200).json({Total_de_usuarios: user.length, user});
    } catch (error) {
        res.status(500).json({msj: "Error al mostrar usuarios."});
    }
}

const adminCheck = async (req, res) => {
    try {
        res.status(200).json({ msj: "Hola admin."});
    } catch (error) {
        res.status(500).json({msj: "Error inesperado"});
    }
}

const changeStateUser = async (req, res) => {
    try {
        const {id} = req.params;
        //console.log(id);
        const user = await userModel.findByIdAndUpdate(id, req.body, {new: true});
        //console.log(user);
        let message = user.active === true ? `Se activo la cuenta:` : `Se desactivo la cuenta: `;
        res.status(200).json({ msj: message, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({msj: "Error inesperado"});
    }
}

const changeStateBlog = async (req, res) => {
    try {
        const {id} = req.params;
        //console.log(id);
        const stateBlog = await blogsModel.findByIdAndUpdate(id, req.body, {new: true});
        //console.log(stateBlog);
        let message = stateBlog.active === true ? `Se activo el blog:` : `Se desactivo el blog: `;
        res.status(200).json({ msj: message, stateBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({msj: "Error inesperado"});
    }
}

module.exports = { get, adminCheck, changeStateUser, changeStateBlog }