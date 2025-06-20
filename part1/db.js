const mysql = require('mysql2/promise');

// Make Pool for the database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'DogWalkService'
});

module.exports = db;
