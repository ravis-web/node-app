/* --- Sequelize Model --- */
const Sequelize = require('sequelize');
const sequelize = require('../utils/db-conn');

const Product = sequelize.define('products', {
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

module.exports = Product;


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