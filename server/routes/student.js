const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const studentController = require('../controllers/student');

// GET /student
router.get('/', verifyToken, studentController.getStudent);

module.exports = router;
