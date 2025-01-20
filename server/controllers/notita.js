const db = require('../models/db');
const crypto = require('crypto');

// Create a new notita
exports.createNotita = (req, res) => {
    const { notita, ID_materie } = req.body;

    console.log('Request Body:', req.body);

    if (!notita || typeof notita !== 'string' || notita.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid content: notita is required and must be a non-empty string.' });
    }

    const castMaterieId = parseInt(ID_materie, 10);
    if (!castMaterieId || typeof castMaterieId !== 'number') {
        return res.status(400).json({ error: 'controllers::createNotita()::Invalid content: ID_materie is required and must be a valid number.'});
    }

    const nhash = crypto.randomBytes(16).toString('hex');

    const sql = `INSERT INTO notita (nhash, notita, ID_materie) VALUES (?, ?, ?)`;
    db.query(sql, [nhash, notita, castMaterieId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        res.status(201).json({
            message: 'Notita created successfully',
            notita: {
                id: result.insertId,
                nhash,
                notita,
                castMaterieId,
            },
        });
    });
};

// Get a notita by ID
exports.getNotitaById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM notita WHERE ID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        if (result.length === 0) return res.status(404).json({ message: 'Notita not found' });
        res.status(200).json(result[0]);
    });
};


// Update a notita
exports.updateNotita = (req, res) => {
    const { id } = req.params;
    const { notita } = req.body;

    const sql = 'UPDATE notita SET notita = ?, data_modificata = NOW() WHERE id = ?';
    db.query(sql, [notita, id], (err, result) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error.' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Notita not found.' });
      }

      res.status(200).json({ message: 'Notita updated successfully.' });
    });
};

// Delete a notita
exports.deleteNotita = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM notita WHERE ID = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        res.status(200).json({ message: 'Notita deleted successfully' });
    });
};
