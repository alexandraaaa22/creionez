const express = require('express');
const router = express.Router();
const materiiController = require('../controllers/materii');

// GET all materii
router.get('/', materiiController.getAllMaterii);

module.exports = router;
