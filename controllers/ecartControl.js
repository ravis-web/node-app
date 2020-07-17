const Product = require("../models/Prod");
const Order = require("../models/Order");

exports.addToCart = (req, res) => {
  // Product.findId(req.body.prodId) // mongodb
  Product.findById(req.body.prodId) // mongoose
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
  req.user.populate('cart.items.prodId').execPopulate() // ret user w prod-info
    .then(user => {
      const prods = user.cart.items;
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

exports.addToOrder = (req, res) => {
  req.user.populate('cart.items.prodId').execPopulate() // ret user w prod-info
    .then(user => {
      const prods = user.cart.items.map(i => {
        return { prod: { ...i.prodId._doc }, quantity: i.quantity }; // '.doc' - w/o metadata
      });
      const order = new Order({
        items: prods,
        user: {
          name: req.user.name,
          // userId: req.user, // mongoose : maps only '_id'
          userId: req.user._id
        }
      });
      return order.save(); // ret prom
    })
    .then(result => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.fetchOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id }) // mongoose
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
