const db = require('../models/db');
const crypto = require('crypto');

// GET /notite/:ID_materie - Fetch all notite for a materie
exports.getNotiteByMaterie = (req, res) => {
    const { ID_materie } = req.params;

    const castMaterieId = parseInt(ID_materie, 10);
    if (!castMaterieId || isNaN(parseInt(castMaterieId, 10))) {
        return res.status(400).json({ error: 'Invalid ID_materie: it must be a valid number.' });
    }

    const sql = `SELECT * FROM notita WHERE ID_materie = ?`;

    db.query(sql, [castMaterieId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        res.status(200).json({
            message: 'Notite fetched successfully',
            data: results,
        });
    });
};
