const Product = require('../models/Prod');

exports.addProd = (req, res) => {
  res.render('products/add-prod', {
    docTitle: 'Add Product',
    path: '/products',
    user: req.user
  });
};

exports.saveProd = (req, res) => {
  const product = new Product({
    title: req.body.title,
    image: req.body.image,
    price: req.body.price,
    descr: req.body.descr,
    userId: req.user._id
    // userId: req.user // mongoose : maps only '_id'
  });
  product.save() // mongoose
    .then(reslt => res.redirect('/products'))
    .catch(err => console.log(err));
};

exports.fetchProd = (req, res) => {
  // Product.findId(req.params.id) // mongodb
  Product.findById(req.params.id) // mongoose
    .then(prod => {
      if (prod.userId.toString() !== req.user._id.toString()) {
        res.render('e-shop/detail', {
          product: prod,
          docTitle: 'Product Details',
          path: '/shop',
          user: req.user
        });
      } else return res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.fetchProds = (req, res) => {
  // Product.fetch() // mongodb
  Product.find({ userId: req.user._id }) // mongoose
    .then(prods => {
      res.render('products/prod-lists', {
        products: prods,
        docTitle: 'Products',
        path: req.url,
        user: req.user
      });
    })
    .catch(err => console.log(err));
};

exports.editProd = (req, res) => {
  // Product.findId(req.params.id) // mongodb
  Product.findById(req.params.id) // mongoose
    .then(prod => {
      if (prod.userId.toString() !== req.user._id.toString()) {
        res.render('products/edit-prod', {
          product: prod,
          docTitle: 'Edit Product',
          path: '/products',
          user: req.user
        });
      } else return res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.updtProd = (req, res) => {
  Product.findById(req.body.prodId)
    .then(prod => {
      if (prod.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      prod.title = req.body.title;
      prod.image = req.body.image;
      prod.price = req.body.price;
      prod.descr = req.body.descr;
      return prod.save() // update-db w. promise
        .then(r => res.redirect('/products'))
    })
    .catch(err => console.log(err));
};

exports.deltProd = (req, res) => {
  // Product.deleteId(req.body.prodId) // mongodb
  // Product.findByIdAndRemove(req.body.prodId) // mongoose
  Product.deleteOne({ _id: req.body.prodId, userId: req.user._id }) // mongoose
    .then(r => res.redirect('/products'))
    .catch(err => console.log(err));
};
