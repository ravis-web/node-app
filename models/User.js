/* --- User Model --- */
const mongo = require('mongodb');
const mongoDB = require('../utils/db-conn').mongoDB;

const ObjectId = mongo.ObjectId;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = mongoDB();
    return db.collection('users').insertOne(this)
      .then(msg => console.log('user-added'))
      .catch(err => { throw err });
  }

  static findId(id) {
    const db = mongoDB();
    return db.collection('users').findOne({ _id: ObjectId(id) });
  }
}

module.exports = User;

/* --- Sequelize Model ---
const Sequelize = require('sequelize');
const sequelize = require('../utils/db-conn');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  mail: Sequelize.STRING
});
*/
