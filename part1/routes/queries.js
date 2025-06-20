var express = require('express');
var router = express.Router();
var db = require('../db');

// GET requests for /api/dogs
router.get('/dogs', async (req, res) => {
    const [rows] = await db.query(`
        SELECT d.name AS dog_name, d.size, u.username AS owner_username
        FROM Dogs d
        JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
});

// GET requests for /walkrequests/open
router.get('/walkrequests/open', async (req, res) => {
    const [rows] = await db.query(`
        SELECT wr.request_id, d.name AS dog_name, wr.
        SELECT d.name AS dog_name, d.size, u.username AS owner_username
        FROM Dogs d
        JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
});

module.exports = router;
