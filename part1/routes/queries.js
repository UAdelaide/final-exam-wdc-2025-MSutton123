var express = require('express');
var router = express.router();
var db = require('../db');

// /dogs GET request
router.get('/dogs', async (req, res) => {
    const [rows] = await db.query(`
        SELECT name AS dog_name, size, 
    `);
});