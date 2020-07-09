/* --- MySQL Connection --- */

// using private keys
const config = require('./sql-conn');


/* Sequelize : ORM library */
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  {
    dialect: 'mysql',
    host: config.host
  }
);

module.exports = sequelize;


/* --- MySQL2 ---
const mysql = require('mysql2');

// create pool-connections
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password
});

// promises instead of callbacks
module.exports = pool.promise(); // async-requests
*/