const Product = require('../models/Product');

exports.addProd = (req, res) => {
  res.render('products/add-prod', {
    docTitle: 'Add Product',
    path: '/products'
  });
};

exports.saveProd = (req, res) => {
  Product.create({
    title: req.body.title,
    image: req.body.image,
    price: req.body.price,
    desc: req.body.desc
  })
    .then(result => res.redirect('/products')) // re-direct
    .catch(err => console.log(err));

  // const product = new Product(req.body.title);
  // product.saveProd();
};

exports.fetchProds = (req, res) => {
  Product.findAll()
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
        path: req.url
      });
    })
    .catch(err => console.log(err));
};

exports.editProd = (req, res) => {
  Product.findByPk(req.params.id)
    .then(prod => {
      res.render('products/edit-prod', {
        product: prod,
        docTitle: 'Edit Product',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.updtProd = (req, res) => {
  Product.findByPk(req.body.prodId)
    .then(prod => {
      prod.title = req.body.title;
      prod.image = req.body.image;
      prod.price = req.body.price;
      prod.desc = req.body.desc;
      return prod.save(); // update-db w. promise
    })
    .then(r => res.redirect('/products'))
    .catch(err => console.log(err));
};

exports.deltProd = (req, res) => {
  Product.findByPk(req.body.prodId)
    .then(prod => {
      return prod.destroy(); // delete-db w. promise
    })
    .then(r => res.redirect('/products'))
    .catch(err => console.log(err));
};

exports.indexPage = (req, res) => {
  res.render('e-shop/index', {
    docTitle: 'Home',
    path: req.url
  });
};