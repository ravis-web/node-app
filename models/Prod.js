/* --- Product Model --- */
/*const mongo = require('mongodb');
const mongoDB = require('../utils/db-conn').mongoDB;

class Product {
  constructor(title, image, price, descr, id, userId) {
    this.title = title;
    this.image = image;
    this.price = price;
    this.descr = descr;
    this._id = id ? new mongo.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = mongoDB();
    if (!this._id) {
      return db.collection('products').insertOne(this)
        .then(msg => console.log('prod-added'))
        .catch(err => { throw err });
    } else {
      return db.collection('products').updateOne({ _id: this._id }, { $set: this })
        .then(msg => console.log('prod-updated'))
        .catch(err => { throw err });
    }
  }

  static fetch() {
    const db = mongoDB();
    return db.collection('products').find().toArray()
      .then(prods => prods)
      .catch(err => console.log(err));
  }

  static findId(id) {
    const db = mongoDB();
    return db.collection('products').find({ _id: new mongo.ObjectId(id) }).next()
      .then(prod => prod)
      .catch(err => console.log(err));
  }

  static deleteId(id) {
    const db = mongoDB();
    return db.collection('products').deleteOne({ _id: new mongo.ObjectId(id) })
      .then(msg => console.log('prod-deleted'))
      .catch(err => console.log(err));
  }

}

module.exports = Product;*/
