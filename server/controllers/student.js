const db = require('../models/db');

// GET /student
exports.getStudent = (req, res) => {
    const userId = req.userId;

    const sql = 'SELECT nume, prenume FROM student WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        const { nume, prenume } = results[0];
        res.status(200).json({ nume, prenume });
    });
};
