require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const router = require('./routes');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const materieRoutes = require('./routes/materie');
const materiiRoutes = require('./routes/materii');
const notitaRoutes = require('./routes/notita');
const notiteRoutes = require('./routes/notite');

const PORT = process.env.PORT || 5005;

const corsOptions = {
    origin: 'http://localhost:3000', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.options('*', cors(corsOptions)); // Handle preflight requests

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', router);
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/materie', materieRoutes);
app.use('/materii', materiiRoutes);
app.use('/notita', notitaRoutes);
app.use('/notite', notiteRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
