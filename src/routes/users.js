const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/users');
const logged = require('../middlewares/logged');
const usersMiddlewares = require('../middlewares/users');
const fileUpload = require('express-fileupload');//*

router.use(logged);

router.get('/profile', usersControllers.profile);
router.post('/createblog', usersMiddlewares.restrictPropertiesBlog, 
    fileUpload({
        useTempFiles : true,  //para indicar que se deben utilizar archivos temporales
        tempFileDir : './uploads' // ./uploads para indicar la carpeta donde se almacenarán los archivos temporales
    }), usersControllers.createBlog);
router.put('/:id', usersMiddlewares.validateIdBlog, usersMiddlewares.restrictPropertiesBlog, usersControllers.editBlog);
router.delete('/:id', usersMiddlewares.validateIdBlog, usersControllers.delBlog);

module.exports = router;