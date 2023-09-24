const userModel = require('../schemas/users');
const blogsModel = require('../schemas/blogs');
const { uploadImage, deleteImage } =  require ('../utils/cloudinary');
const fse = require('fs-extra');

const profile = async (req, res) => {
    try { 
        const user = await userModel.findOne({_id: req.user.id}).populate('blogs');
        res.status(200).json({msj: "Mi perfil", user});
    } catch (error) {
        res.status(500).json({msj: "Error al mostrar el perfil."});
    }
}

const createBlog = async (req, res) => {
    try {
        let { title, description, image } = req.body;//console.log("el body", req.body)
        //console.log(req.files);//*
        const { id } = req.user;
        const user = await userModel.findById(id);
        const blog = new blogsModel({ title, description, image, user: req.user._id, author: `${user.name} ${user.lastname}`, username: user.username });
        
        //Para que no suba las imagenes si ya hay un title creado.
        const existingBlog = await blogsModel.findOne({title});
        if (existingBlog) {
            return res.status(400).json({msj: "Título no disponible."})
        }
        //si incluye una imagen la cargo y guardo la info de la misma en un objeto
        if (req.files?.image) {
            const result = await uploadImage(req.files.image.tempFilePath);
            blog.image = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
            //recibe un parametro que es donde está el archivo que quiero eliminar
            await fse.unlink(req.files.image.tempFilePath);
            console.log(result);
        }
        await blog.save();        
       
        user.blogs.push(blog); // pushear el blog y no solo su id
        await user.save();
        res.status(201).json({ blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: "Error al crear un blog." });
    }
}

const editBlog = async (req, res) => {
    try {
        const {id} = req.params;
        const blog = await blogsModel.findById(id);//.populate('user');

        if (blog.username !== req.user.username) {
            return res.status(401).json({ msj: "No estás autorizado para editar este blog." });
        }
        
        if (blog.active === false) {
            return res.status(401).json({ msj: "Blog bloquedo. No se puede acceder para editar." });
        }
        const updatedBlog = await blogsModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ msj: "Se actualizó el blog.", updatedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: "Error al buscar." });
    }
}
// const editBlog = async (req, res) => {
//     try {
//         const { id } = req.params;
//         //console.log("el id ", id);
//         const blog = await blogsModel.findById(id).populate('user');
//         //console.log("el blog ",blog);
//         if (!blog) {
//             return res.status(404).json({ msj: "Blog no encontrado." });
//         }
//         //console.log("el blog._id ", blog._id);//object
//         console.log("el blog._id to string", blog._id.toString()); // o blog.id
//         console.log("el req.user ", req.user);
//         console.log("el req.user.id: editor ", req.user.id);//string
//         console.log("el blog ", blog);//string el editor
//         //console.log("el blog.user._id.toString() ", blog.user.toString());
//         console.log("el blog populate ", blog.populate('user'));
//         console.log("el req.user.username: editor ", req.user.username); //este
//         console.log("el blog.username ", blog.username); // este
//         //const { id2 } = req.user;
//         //console.log("el req.user: ", req.user); // su id '6508c04e8dd424d043eeae63'
//         const us = await userModel.findById(id2);

//         if (blog.user.toString() !== req.user.id) {
//             return res.status(401).json({ msj: "No estás autorizado para editar este blog." });
//         }
//         const updatedBlog = await blogsModel.findByIdAndUpdate(id, req.body, { new: true });
//         res.status(200).json({ msj: "Se actualizó el blog." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msj: "Error al buscar." })
//     }
// }
//         if (blog.user.toString() !== req.user._id.toString()) {
//             return res.status(401).json({ msj: "No estás autorizado para editar este blog." });
//         }
const delBlog = async (req, res) => {
    try {
        const {id} = req.params;
        const blog = await blogsModel.findById(id);

        if (blog.username !== req.user.username) {
            return res.status(401).json({ msj: "No estás autorizado para eliminar este blog." });
        }

        if (blog.active === false) {
            return res.status(401).json({ msj: "Blog bloquedo. No se puede acceder para eliminar." });
        }
        const deletedBlog = await blogsModel.findByIdAndDelete(id, req.body, {new: true});
        const result = await deleteImage(blog.image.public_id);//** */
        console.log(result);

        res.status(200).json({msj: "Se eliminó correctamente el blog.", blog});
    } catch (error) {
        console.error(error);
        res.status(500).json({msj: "Error al buscar."});
    }
}

module.exports = { profile, createBlog, editBlog, delBlog }