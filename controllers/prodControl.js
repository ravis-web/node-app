const fileOps = require('../utils/file-ops');

const Product = require('../models/Prod');

exports.addProd = (req, res) => {
  res.render('products/add-prod', {
    docTitle: 'Add Product',
    path: '/products',
    user: req.user
  });
};

exports.saveProd = (req, res, nxt) => {
  const product = new Product({
    title: req.body.title,
    image: req.file.path,
    price: req.body.price,
    descr: req.body.descr,
    userId: req.user._id
    // userId: req.user // mongoose : maps only '_id'
  });
  product.save() // mongoose
    .then(reslt => res.redirect('/products'))
    .catch(err => nxt(err));
};

exports.fetchProd = (req, res, nxt) => {
  // Product.findId(req.params.id) // mongodb
  Product.findById(req.params.id) // mongoose
    .then(prod => {
      if (prod.userId.toString() === req.user._id.toString()) {
        res.render('e-shop/detail', {
          product: prod,
          docTitle: 'Product Details',
          path: '/shop',
          user: req.user
        });
      } else return res.redirect('/');
    })
    .catch(err => nxt(err));
};

exports.fetchProds = (req, res, nxt) => {
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
    .catch(err => nxt(err));
};

exports.editProd = (req, res, nxt) => {
  // Product.findId(req.params.id) // mongodb
  Product.findById(req.params.id) // mongoose
    .then(prod => {
      if (prod.userId.toString() === req.user._id.toString()) {
        res.render('products/edit-prod', {
          product: prod,
          docTitle: 'Edit Product',
          path: '/products',
          user: req.user
        });
      } else return res.redirect('/');
    })
    .catch(err => nxt(err));
};

exports.updtProd = (req, res, nxt) => {
  Product.findById(req.body.prodId)
    .then(prod => {
      if (prod.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      prod.title = req.body.title;
      if (req.file.path) {
        fileOps.delFile(prod.image); // del the prev img async
        prod.image = req.file.path;
      }
      prod.price = req.body.price;
      prod.descr = req.body.descr;
      return prod.save() // update-db w. promise
        .then(r => res.redirect('/products'))
    })
    .catch(err => nxt(err));
};

exports.deltProd = (req, res, nxt) => {
  // Product.deleteId(req.body.prodId) // mongodb
  // Product.findByIdAndRemove(req.body.prodId) // mongoose
  Product.findById(req.params.prodId)
    .then(prod => {
      if (!prod) return nxt(new Error('product not found'));
      fileOps.delFile(prod.image);
      return Product.deleteOne({ _id: req.params.prodId, userId: req.user._id }) // mongoose
    })
    // .then(r => res.redirect('/products'))
    .then(r => res.status(200).json({ message: 'prod-deleted' }))
    .catch(err => res.status(500).json({ message: 'deletion-failed!' }));
};
