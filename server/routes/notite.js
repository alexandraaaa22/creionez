const express = require('express');
const router = express.Router();
const notiteController = require('../controllers/notite');

const { validateNotitaInput } = require('../middlewares/validation');
const { sanitizeInput } = require('../middlewares/sanitize');
const { verifyToken } = require('../middlewares/auth');

router.get('/:ID_materie', verifyToken, notiteController.getNotiteByMaterie);

module.exports = router;
