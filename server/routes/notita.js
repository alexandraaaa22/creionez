const express = require('express');
const router = express.Router();
const notitaController = require('../controllers/notita');

const { validateNotitaInput, validateUpdateNotitaInput } = require('../middlewares/validation');
const { sanitizeInput } = require('../middlewares/sanitize');
const { verifyToken } = require('../middlewares/auth');

// Create a new notita
router.post('/', [validateNotitaInput, sanitizeInput], notitaController.createNotita);

// Get a notita by ID
router.get('/:id', validateNotitaInput, sanitizeInput, notitaController.getNotitaById);

// Update a notita by ID
router.put('/:id', validateUpdateNotitaInput, sanitizeInput, notitaController.updateNotita);

// Delete a notita by ID
router.delete('/:id', notitaController.deleteNotita);

module.exports = router;
