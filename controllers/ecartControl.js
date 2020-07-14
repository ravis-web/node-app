const Product = require("../models/Prod");

exports.addToCart = (req, res) => {
  Product.findId(req.body.prodId)
    .then(prod => {
      return req.user.addToCart(prod)
    })
    .then(msg => {
      console.log('added-to-cart');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.fetchCart = (req, res) => {
  req.user.fetchCart()
    .then(prods => {
      res.render('e-shop/e-cart', {
        products: prods,
        docTitle: 'Cart',
        path: req.url,
        user: req.user
      });
    })
    .catch(err => console.log(err));
};

exports.remFromCart = (req, res) => {
  req.user.deleteItem(req.body.prodId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

/* exports.addToOrder = (req, res) => {
  let usrCart = [];
  let usrOrder = {};
  req.user.getCart()
    .then(cart => {
      usrCart = cart;
      return cart.getProducts()
    })
    .then(prods => {
      return req.user.createOrder()
        .then(order => {
          usrOrder = order;
          return order.addProducts(prods.map(prod => {
            prod.orderItem = { quantity: prod.cartItem.quantity };
            return prod;
          }))
        })
        .catch(err => console.log(err))
    })
    .then(result => { usrCart.setProducts(null) })
    .then(result => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.fetchOrders = (req, res) => {
  req.user.getOrders({ include: ['products'] }) // eager-loading
    .then(orders => {
      res.render('e-shop/order', {
        orders: orders,
        docTitle: 'Orders',
        path: req.url,
        user: req.user
      });
    })
    .catch(err => console.log(err));
};

exports.checkOut = (req, res) => {
  res.render('e-shop/ckout', {
    docTitle: 'Checkout',
    path: req.url,
    user: req.user
  });
};*/

exports.indexPage = (req, res) => {
  res.render('e-shop/index', {
    docTitle: 'Home',
    path: req.url,
    user: req.user
  });
};
