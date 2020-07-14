/* --- User Model --- */
const mongo = require('mongodb');
const mongoDB = require('../utils/db-conn').mongoDB;

const ObjectId = mongo.ObjectId;

class User {
  constructor(name, email, cart, userId) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this.userId = userId;
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
