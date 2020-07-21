const Product = require('../models/Prod');

const PROD_PER_PAGE = 1;

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
  const page = {
    curr: parseInt(req.query.page) || 1
  };

  // Product.fetch() // mongodb
  // Product.find() // mongoose
  // .select('title price -_id') // mongoose
  // .populate('userId', 'name') // mongoose

  Product.find().countDocuments().then(count => {
    page.last = Math.ceil(count / PROD_PER_PAGE);

    if (page.curr > page.last || page.curr == 0) {
      return res.redirect('/shop');
    }

    return Product.find().skip((page.curr - 1) * PROD_PER_PAGE) // mongo
      .limit(PROD_PER_PAGE) // mongo
      .then(prods => {
        res.render('e-shop/eshop', {
          products: prods,
          docTitle: 'E-Shop',
          path: req.url,
          user: req.user,
          page: page
        });
      })
  }).catch(err => nxt(err));
};
