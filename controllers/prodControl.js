const Product = require('../models/Product');

exports.addProd = (req, res, next) => {
  res.render('add-prod', {
    docTitle: 'Add Product'
  });
};

exports.saveProd = (req, res, next) => {
  const product = new Product(req.body.title);
  product.saveProd();
  res.redirect('/'); // re-direct
};

exports.fetchProds = (req, res) => {
  Product.fetchProds(products => {
    res.render('eshop', {
      products: products,
      docTitle: 'E-Shop',
    });
  });
};