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
      res.render('e-shop/detail', {
        product: prod,
        docTitle: 'Product Details',
        path: '/shop',
        user: req.user
      });
    })
    .catch(err => console.log(err));
};

exports.fetchProds = (req, res) => {
  // Product.fetch() // mongodb
  Product.find() // mongoose
    // .select('title price -_id') // mongoose
    // .populate('userId', 'name') // mongoose
    .then(prods => {
      let view, docTitle;
      if (req.url === '/shop') {
        view = 'e-shop/eshop';
        docTitle = 'E-Shop';
      } else {
        view = 'products/prod-lists';
        docTitle = 'Products';
      }
      res.render(view, {
        products: prods,
        docTitle: docTitle,
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
      res.render('products/edit-prod', {
        product: prod,
        docTitle: 'Edit Product',
        path: '/products',
        user: req.user
      });
    })
    .catch(err => console.log(err));
};

exports.updtProd = (req, res) => {
  Product.findById(req.body.prodId)
    .then(prod => {
      prod.title = req.body.title;
      prod.image = req.body.image;
      prod.price = req.body.price;
      prod.descr = req.body.descr;
      return prod.save() // update-db w. promise
    })
    .then(r => res.redirect('/products'))
    .catch(err => console.log(err));
};

exports.deltProd = (req, res) => {
  // Product.deleteId(req.body.prodId) // mongodb
  Product.findByIdAndRemove(req.body.prodId) // mongoose
    .then(r => res.redirect('/products'))
    .catch(err => console.log(err));
};
