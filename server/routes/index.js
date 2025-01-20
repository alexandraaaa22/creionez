const express = require('express');
const router = express.Router();

// Example routes
router.get('/', (req, res) => {
    res.send('API is working!');
});

module.exports = router;
