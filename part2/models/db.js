const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  socketPath: '/var/run/mysqld/'
  host: '127.0.0.1',
  user: 'root',
  database: 'DogWalkService',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
