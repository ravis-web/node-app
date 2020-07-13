/* --- Database Connection --- */

// using private keys
const cluster = require('./nosql-db');

/* MongoDB */
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect(cluster)
    .then(client => callback(client))
    .catch(err => console.log(err));
};

module.exports = mongoConnect;


/* --- Sequelize : ORM library ---
const config = require('./sql-conn');

const { Sequelize } = require('sequelize');

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
*/


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
