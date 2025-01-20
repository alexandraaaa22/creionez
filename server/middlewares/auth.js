const jwt = require('jsonwebtoken');

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized. Token is required.' });
        }

        const secretKey = process.env.JWT_SECRET || 'SECRET_KEY';
        const decoded = jwt.verify(token, secretKey);

        req.userId = decoded.id; // Attach user ID to the request
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ error: 'Unauthorized. Invalid token.' });
    }
};
