// Sanitization Middleware
exports.sanitizeInput = (req, res, next) => {
    const sanitize = (value) => String(value).replace(/<[^>]*>?/gm, ''); // Strip HTML tags
    for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
            req.body[key] = sanitize(req.body[key]);
        }
    }
    next();
};
