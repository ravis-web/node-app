/* --- MySQL Connection --- */

const mysql = require('mysql2');

// using private keys
const config = require('./sql-conn');

// create pool-connections
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password
});

// promises instead of callbacks
module.exports = pool.promise(); // async-requests