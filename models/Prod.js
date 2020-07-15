/* --- Product Model --- */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const prodSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  descr: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Product', prodSchema);


/* --- MongoDB ---
const mongo = require('mongodb');
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

module.exports = Product;
*/
