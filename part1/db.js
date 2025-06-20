const mysql = require('mysql2/promise');

// Create database pool for reuse
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'DogWalkService'
});

module.exports = db;
