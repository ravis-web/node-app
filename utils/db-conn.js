/* --- Database Connection --- */

// using private keys
const cluster = require('./nosql-db');

/* MongoDB */
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db; // undefined local var

const mongoConnect = callback => {
  MongoClient.connect(cluster, { useUnifiedTopology: true })
    .then(client => {
      _db = client.db(); // db-instance
      callback();
    })
    .catch(err => {
      console.log('cluster-conn-failure');
      throw err;
    });
};

const getDatabase = () => {
  if (_db) return _db;
  else throw 'No database found.';
};

exports.connect = mongoConnect;
exports.mongoDB = getDatabase;


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
