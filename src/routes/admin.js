const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin');
const logged = require('../middlewares/logged');
const adminMiddlewares = require('../middlewares/admin');

router.use(logged);
router.use(adminMiddlewares.logged);

router.get('/', adminControllers.get);
router.get('/id/:id', adminMiddlewares.validateID, adminControllers.get);
router.get('/check', adminControllers.adminCheck);
router.patch('/userstate/:id',adminMiddlewares.validateID, adminControllers.changeStateUser);
router.patch('/blogstate/:id', adminControllers.changeStateBlog);

module.exports = router;
