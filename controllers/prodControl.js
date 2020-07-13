const Product = require('../models/Product');

exports.addProd = (req, res) => {
  res.render('products/add-prod', {
    docTitle: 'Add Product',
    path: '/products',
    user: req.user
  });
};

exports.saveProd = (req, res) => {
  const product = new Product(
    req.body.title,
    req.body.image,
    req.body.price,
    req.body.descr
  );
  product.save()
    .then(reslt => res.redirect('/products'))
    .catch(err => console.log(err));
};

exports.fetchProd = (req, res) => {
  Product.findId(req.params.id)
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
  Product.fetch()
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
  Product.findId(req.params.id)
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
  const product = new Product(
    req.body.title,
    req.body.image,
    req.body.price,
    req.body.descr,
    req.body.prodId
  );
  return product.save() // update-db w. promise
    .then(r => res.redirect('/products'))
    .catch(err => console.log(err));
};

exports.deltProd = (req, res) => {
  Product.deleteId(req.body.prodId)
    .then(r => res.redirect('/products'))
    .catch(err => console.log(err));
};


/* --- Sequelize Code ---
exports.saveProd = (req, res) => {
  // Product.create()
  req.user.createProduct({
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

exports.fetchProd = (req, res) => {
  Product.findByPk(req.params.id)
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
  req.user.getProducts()
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
  Product.findByPk(req.params.id)
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
*/
