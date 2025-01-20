const db = require('../models/db');

// Get all materii
exports.getAllMaterii = (req, res) => {
    //const studentId = req.user.id; // Get logged-in user's ID

    const sql = 'SELECT * FROM materie'; // SQL query to fetch all records from the materie table
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // If no records are found, return an empty array
        if (results.length === 0) {
            return res.status(200).json({ message: 'No materii found', data: [] });
        }

        // Return all rows from the materie table
        res.status(200).json({ message: 'Materii fetched successfully', data: results });
    });
};
