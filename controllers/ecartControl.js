const Product = require("../models/Product");

exports.addToCart = (req, res) => {
  const id = req.body.prodId;
  let usrCart = [];
  let newQty = 1;
  req.user.getCart()
    .then(cart => {
      usrCart = cart;
      return cart.getProducts({ where: { id: id } })
    })
    .then(prods => {
      let prod;
      if (prods.length > 0) prod = prods[0];
      if (prod) {
        const qty = prod.cartItem.quantity;
        newQty = qty + 1;
        return prod;
      }
      return Product.findByPk(id);
    })
    .then(prod => usrCart.addProduct(prod, { through: { quantity: newQty } }))
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.fetchCart = (req, res) => {
  req.user.getCart()
    .then(cart => cart.getProducts())
    .then(prods => {
      res.render('e-shop/e-cart', {
        products: prods,
        docTitle: 'Cart',
        path: req.url,
        user: req.user
      });
    })
    .catch();
};

exports.remFromCart = (req, res) => {
  const prodId = req.body.prodId;
  req.user.getCart()
    .then(cart => cart.getProducts({ where: { id: prodId } }))
    .then(prods => prods[0].cartItem.destroy())
    .then(() => res.redirect('/cart'))
    .catch();
};

exports.addToOrder = (req, res) => {
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
};

exports.indexPage = (req, res) => {
  res.render('e-shop/index', {
    docTitle: 'Home',
    path: req.url,
    user: req.user
  });
};
