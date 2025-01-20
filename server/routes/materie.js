const express = require('express');
const router = express.Router();
const materieController = require('../controllers/materie');
const { validateMaterieInput } = require('../middlewares/validation');
const { sanitizeInput } = require('../middlewares/sanitize');
const { verifyToken } = require('../middlewares/auth');

// Create a new materie
router.post('/', verifyToken, validateMaterieInput, sanitizeInput, materieController.createMaterie);

// Get a materie by ID
router.get('/:id', verifyToken, materieController.getMaterieById);

// Update a materie by ID
router.put('/:id', verifyToken, validateMaterieInput, sanitizeInput, materieController.updateMaterie);

// Delete a materie by ID
router.delete('/:id', verifyToken, materieController.deleteMaterie);

module.exports = router;
