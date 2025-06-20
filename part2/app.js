const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

var session = require('express-session');

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);


const db = require('../models/db');

// GET alldogs
require('express').Router().get('/api/dogs', async (req, res) => {
    const [rows] = await db.query(`
    SELECT dog_id, name, size, owner_id
    FROM Dogs
  `);
    res.json(rows);
});

// Export the app instead of listening here
module.exports = app;
