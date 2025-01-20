const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validateLoginInput, validateRegisterInput } = require('../middlewares/validation');

// POST /login
router.post('/login', validateLoginInput, authController.login);

// POST /register
router.post('/register', validateRegisterInput, authController.register);

module.exports = router;
