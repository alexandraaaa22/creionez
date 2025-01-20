// Helper function to validate email domain
const validateEmailDomain = (email, domain) => {
    const emailRegex = new RegExp(`^[^@]+@${domain.replace('.', '\\.')}$`);
    return emailRegex.test(email);
};

// Validation Middleware
exports.validateMaterieInput = (req, res, next) => {
    const { nume_materie, data_adaugata, data_modificata } = req.body;

    if (!nume_materie || typeof nume_materie !== 'string' || nume_materie.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid nume_materie' });
    }

    if (data_adaugata && isNaN(new Date(data_adaugata).getTime())) {
        return res.status(400).json({ error: 'Invalid data_adaugata' });
    }

    if (data_modificata && isNaN(new Date(data_modificata).getTime())) {
        return res.status(400).json({ error: 'Invalid data_modificata' });
    }

    next();
};

// Validation Middleware for Notita
exports.validateNotitaInput = (req, res, next) => {
    const { notita, ID_materie } = req.body;

    // Debug incoming request body
    console.log('Request Body:', req.body);

    // Validate `notita`
    if (!notita || typeof notita !== 'string' || notita.trim().length === 0) {
        console.error('Invalid notita:', notita);
        return res.status(400).json({ error: 'Invalid notita: it must be a non-empty string.' });
    }

    // Validate `ID_materie`
    const parsedMaterieId = parseInt(ID_materie, 10); // Convert to a number
    if (isNaN(parsedMaterieId) || parsedMaterieId <= 0) {
        console.error('Invalid ID_materie:', ID_materie); // Debugging log
        return res.status(400).json({ error: 'validators::validateNotitaInput()::Invalid ID_materie: it must be a valid number.' });
    }

    // Attach parsed ID_materie to the request for consistency
    req.body.ID_materie = parsedMaterieId;

    next();
};

// Validation Middleware for Updating Notita
exports.validateUpdateNotitaInput = (req, res, next) => {
    const { notita } = req.body;
    const { id } = req.params;

    // Debug incoming request body and params
    console.log('Request Body:', req.body);
    console.log('Request Params:', req.params);

    // Validate `notita`
    if (!notita || typeof notita !== 'string' || notita.trim().length === 0) {
        console.error('Invalid notita:', notita);
        return res.status(400).json({ error: 'Invalid notita: it must be a non-empty string.' });
    }

    // Validate `id` from params
    const parsedNotitaId = parseInt(id, 10); // Convert to a number
    if (isNaN(parsedNotitaId) || parsedNotitaId <= 0) {
        console.error('Invalid notita ID:', id); // Debugging log
        return res.status(400).json({ error: 'Invalid notita ID: it must be a valid number.' });
    }

    next();
};




// Validation Middleware for Login
exports.validateLoginInput = (req, res, next) => {
    const { email, parola } = req.body;

    console.log('Raw request body:', req.body);
    console.log('Password value:', parola);
    console.log('Password type:', typeof parola);


    if (!email || typeof email !== 'string' || !validateEmailDomain(email, 'stud.ase.ro')) {
        return res.status(400).json({ error: 'Invalid email. Must use domain stud.ase.ro.' });
    }

    if (!parola || typeof parola !== 'string' || parola.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    next();
};

// Validation Middleware for Register
exports.validateRegisterInput = (req, res, next) => {
    const { nume, prenume, email, parola } = req.body;

    console.log('Raw request body:', req.body);
    console.log('Password value:', parola);
    console.log('Password type:', typeof parola);


    if (!nume || typeof nume !== 'string' || nume.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid nume (first name).' });
    }

    if (!prenume || typeof prenume !== 'string' || prenume.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid prenume (last name).' });
    }

    if (!email || typeof email !== 'string' || !validateEmailDomain(email, 'stud.ase.ro')) {
        return res.status(400).json({ error: 'Invalid email. Must use domain stud.ase.ro.' });
    }

    if (!parola || typeof parola !== 'string' || parola.trim().length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    next();
};
