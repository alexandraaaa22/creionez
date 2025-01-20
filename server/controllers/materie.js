const db = require('../models/db');
const crypto = require('crypto');

// Create a new materie
exports.createMaterie = (req, res) => {
    const { nume_materie } = req.body;
    const studentId = req.userId; // Retrieved from verifyToken middleware

    if (!nume_materie) {
        return res.status(400).json({ error: 'nume_materie is required.' });
    }

    // Check for duplicate materie for the same student
    const checkDuplicateSql = `SELECT * FROM materie WHERE nume_materie = ? AND ID_student = ?`;
    db.query(checkDuplicateSql, [nume_materie, studentId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (results.length > 0) {
            // Duplicate found
            return res.status(409).json({ error: 'Materie already exists for this student.' });
        }

        // No duplicate found, proceed to insert
        const mhash = crypto.randomBytes(16).toString('hex'); // Generate unique hash

        const insertSql = `
            INSERT INTO materie (mhash, nume_materie, ID_student)
            VALUES (?, ?, ?)
        `;
        db.query(insertSql, [mhash, nume_materie, studentId], (insertErr, result) => {
            if (insertErr) {
                console.error('Database insert error:', insertErr);
                return res.status(500).json({ error: 'Internal server error.' });
            }

            res.status(201).json({
                message: 'Materie created successfully',
                materie: {
                    id: result.insertId,
                    mhash,
                    nume_materie,
                    ID_student: studentId,
                },
            });
        });
    });
};

// Get a materie by ID
exports.getMaterieById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM materie WHERE ID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        if (result.length === 0) return res.status(404).json({ message: 'Materie not found' });
        res.status(200).json(result[0]);
    });
};

// Update a materie
exports.updateMaterie = (req, res) => {
    const { id } = req.params;
    const { nume_materie } = req.body;
    const sql = 'UPDATE materie SET nume_materie = ?, data_modificata = NOW() WHERE ID = ?';
    db.query(sql, [nume_materie, id], (err) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        res.status(200).json({ message: 'Materie updated successfully' });
    });
};

// Delete a materie
exports.deleteMaterie = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM materie WHERE ID = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        res.status(200).json({ message: 'Materie deleted successfully' });
    });
};
