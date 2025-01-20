const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/token');

// POST /login
exports.login = (req, res) => {
    const { email, parola } = req.body;
    const sql = 'SELECT * FROM student WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(parola, user.parola);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken({ id: user.id, email: user.email });
        res.status(200).json({ message: 'Login successful', token });
    });
};

// POST /register
exports.register = (req, res) => {
    const { nume, prenume, email, parola } = req.body;

    // Check for duplicate email
    const checkDuplicateSql = 'SELECT * FROM student WHERE email = ?';
    db.query(checkDuplicateSql, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            // Duplicate email found
            return res.status(409).json({ error: 'Email already exists' });
        }

        console.log('Password before hashing:', parola);

        // Ensure password is defined and valid
        if (!parola) {
            return res.status(400).json({ error: 'Password is required.' });
        }

        // Proceed to insert the new user
        const hashedPassword = bcrypt.hashSync(parola, 10); // Hash the password
        const shash = bcrypt.hashSync(email, 10); // Generate a unique shash for the user

        const insertSql = 'INSERT INTO student (shash, nume, prenume, email, parola) VALUES (?, ?, ?, ?, ?)';
        db.query(insertSql, [shash, nume, prenume, email, hashedPassword], (insertErr, result) => {
            if (insertErr) {
                console.error('Database error:', insertErr);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(201).json({ message: 'Registration successful' });
        });
    });
};
