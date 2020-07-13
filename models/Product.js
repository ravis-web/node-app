const mongo = require('mongodb');
const mongoDB = require('../utils/db-conn').mongoDB;

class Product {
  constructor(title, image, price, descr, id) {
    this.title = title;
    this.image = image;
    this.price = price;
    this.descr = descr;
    this._id = id ? new mongo.ObjectId(id) : null;
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


/* --- Sequelize Model ---
const Sequelize = require('sequelize');
const sequelize = require('../utils/db-conn');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  image: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  desc: Sequelize.STRING
});
*/


/* --- R/W data through FS ---
const fs = require('fs');
const path = require('path');

const root = require('../utils/abs-path');

// constr. file-path
const file = path.join(root, 'data', 'products.json');

// read file content
const getData = callback => {
  fs.readFile(file, (err, data) => {
    if (!err) {
      callback(JSON.parse(data));
    } else {
      callback([]);
    }
  });
}

// write file content
const setData = data => {
  fs.writeFile(file, JSON.stringify(data), (err) => {
    if (err) console.log(err);
  });
};

// Product Model
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  saveProd() {
    getData(products => {
      products.push(this);
      setData(products);
    });
  }

  // static class method
  static fetchProds(callback) {
    getData(callback);
  }
}
*/
