const Product = require('../models/Prod');

exports.indexPage = (req, res) => {
  res.render('e-shop/index', {
    docTitle: 'Home',
    path: req.url,
    user: req.user
  });
};

exports.fetchProd = (req, res, nxt) => {
  // Product.findId(req.params.id) // mongodb
  Product.findById(req.params.id) // mongoose
    .then(prod => {
      res.render('e-shop/detail', {
        product: prod,
        docTitle: 'Product Details',
        path: '/shop',
        user: req.user
      });
    })
    .catch(err => nxt(err));
};

exports.fetchProds = (req, res, nxt) => {
  // Product.fetch() // mongodb
  Product.find() // mongoose
    // .select('title price -_id') // mongoose
    // .populate('userId', 'name') // mongoose
    .then(prods => {
      res.render('e-shop/eshop', {
        products: prods,
        docTitle: 'E-Shop',
        path: req.url,
        user: req.user
      });
    })
    .catch(err => nxt(err));
};
