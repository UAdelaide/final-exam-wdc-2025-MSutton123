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
        SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_username
        FROM Dogs d
        JOIN WalkRequests wr ON wr.dog_id = d.dog_id
        JOIN Users u ON d.owner_id = u.user_id
        WHERE wr.status = 'open'
    `);
    res.json(rows);
});

// GET requests for /walkers/summary
router.get('/walkers/summary', async (req, res) => {
    const [rows] = await db.query(`
        SELECT u.username AS walker_username, COUNT(rate.rating_id) AS total_ratings, ROUND(AVG(rate.rating), 1) AS average_rating,
        (SELECT COUNT(*) FROM WalkApplications appl
        JOIN WalkRequests req ON appl.request_id = req.request_id
        WHERE req.status = 'completed') AS completed_walks
        FROM Users u
        JOIN WalkRatings rate ON u.user_id = rate.walker_id
        JOIN WalkRequests requests ON rate.request_id = requests.request_id
        WHERE u.role = 'walker'
        GROUP BY u.username
    `);
    res.json(rows);
});

module.exports = router;
