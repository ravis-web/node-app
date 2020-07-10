exports.fetchCart = (req, res) => {
  res.render('e-shop/e-cart', {
    docTitle: 'Cart',
    path: req.url
  });
};

exports.fetchOrders = (req, res) => {
  res.render('e-shop/order', {
    docTitle: 'Orders',
    path: req.url
  });
};