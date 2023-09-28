const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth');
const authMiddlewares = require('../middlewares/auth');

//router.use(authMiddlewares.authLogger);

router.post('/register', authMiddlewares.validateData, authControllers.register);
router.post('/login', authControllers.login);
router.post('/logout', authControllers.logout);

module.exports = router;