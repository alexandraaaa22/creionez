const jwt = require('jsonwebtoken');

// Generate JWT Token
exports.generateToken = (payload) => {
    const secretKey = process.env.JWT_SECRET || 'SECRET_KEY';
    const options = { expiresIn: '1h' }; // Token valid for 1 hour
    return jwt.sign(payload, secretKey, options);
};
