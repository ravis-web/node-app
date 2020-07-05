const Product = require('../models/Product');

exports.addProd = (req, res, next) => {
  res.render('products/add-prod', {
    docTitle: 'Add Product',
    path: req.url
  });
};

exports.saveProd = (req, res, next) => {
  const product = new Product(req.body.title);
  product.saveProd();
  res.redirect('/'); // re-direct
};

exports.fetchProds = (req, res) => {
  Product.fetchProds(products => {
    res.render('e-shop/eshop', {
      products: products,
      docTitle: 'E-Shop',
      path: req.url
    });
  });
};