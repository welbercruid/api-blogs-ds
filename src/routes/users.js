const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/users');
const logged = require('../middlewares/logged');
const usersMiddlewares = require('../middlewares/users');

router.use(logged);

router.get('/profile', usersControllers.profile);
router.post('/createblog', usersControllers.createBlog);
router.put('/:id', usersMiddlewares.validateIdBlog, usersMiddlewares.restrictProperties, usersControllers.editBlog);
router.delete('/:id', usersMiddlewares.validateIdBlog, usersControllers.delBlog);

module.exports = router;