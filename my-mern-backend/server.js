require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully!');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Access it at: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    })

// Middlewares

app.use(express.static('public'));
app.use(express.json())
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()} ${req.method} ${req.url}]`);
    next();
})

// Routes

app.get('/about', (req, res) => {
    res.send('This is the about page.');
});

const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes')

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

app.get('/simulate-error', (req, res, next) => {
    try {
        throw new Error('Something went wrong during the /simulate-error request');
    } catch (error) {
        next(error);
    }
});

app.use((req, res, next) => {
    res.status(400).send('Sorry, the requested resource was not found.')
});

app.use((err, req, res, next) => {
    console.error('An error occured:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    }); 
});