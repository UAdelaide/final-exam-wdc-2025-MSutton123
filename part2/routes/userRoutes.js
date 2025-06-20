const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (fixed version)
router.post('/login', async (req, res) => {
  // set query parameters
  const { username, password } = req.body;

  try {
    // query Users table if the username and password match
    const [rows] = await db.query(`
      SELECT user_id, username, email, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (rows.length === 0) { // if there is no row of the table is returned
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // make session for user using the data from the query
    // the first row is used as it will be most similar to the
    // inputted data
    var first_row = rows[0];
    req.session.user = {
      user_id: first_row.user_id,
      username: first_row.username,
      email: first_row.email,
      role: first_row.role
    };

    // send message that login was successful and send data from the query
    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) { // if requestion failed
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST logout request
router.post('/logout', async (req, res) => {
  // destroy the session to end it
  req.session.destroy((error) => {
    if (error) { // if it could not be ended
      res.status(500).send('error logging out');
    } else {
      res.clearCookie('connect.sid'); // clear related cookies
      res.json({ message: "logged out" }); // send message of successful logout
    }
  });
});

// GET choosedog request
router.get('/choosedog', async (req, res) => {
  // make a database query based on the owner id from the session
  try {
    const [rows] = await db.query(`
    SELECT name, dog_id
    FROM Dogs
    WHERE owner_id = ?`, [req.session.user.user_id]);
    res.json(rows); // send through json
  } catch (err) { // if try fails
    res.json({ error: err });
  }
});

module.exports = router;
