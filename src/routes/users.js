const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/users');
const logged = require('../middlewares/logged');
const usersMiddlewares = require('../middlewares/users');
const fileUpload = require('express-fileupload');//*

router.use(logged);
//router.use(usersMiddlewares.userBloqued);
router.get('/profile', usersControllers.profile);
router.post('/createblog', usersMiddlewares.restrictPropertiesBlog,       fileUpload({
            useTempFiles : true,
            tempFileDir : './uploads'
}), usersControllers.createBlog);
router.put('/:id', usersMiddlewares.validateIdBlog, usersMiddlewares.restrictPropertiesBlog, usersControllers.editBlog);
router.delete('/:id', usersMiddlewares.validateIdBlog, usersControllers.delBlog);

module.exports = router;