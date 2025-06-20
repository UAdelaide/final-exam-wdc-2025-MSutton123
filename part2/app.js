const express = require('express');
const path = require('path');
require('dotenv').config();
// Require the database
const db = require('./models/db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

// make the session
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


// GET dogs request
app.get('/api/dogs', async (req, res) => {
    try { // query dog id, name size and owner id from Dogs table
        const [rows] = await db.query(`
        SELECT dog_id, name, size, owner_id
        FROM Dogs
        `);
        res.json(rows); // send through json
    } catch (err) {
        res.json({ error: err });
    }
});

// Export the app instead of listening here
module.exports = app;
