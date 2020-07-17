const express = require('express');

const isAuthen = require('../middleware/is-authen');

const shopCtrl = require('../controllers/shopControl');
const ecartCtrl = require('../controllers/ecartControl');

// express-router
const router = express.Router();

router.get('/', shopCtrl.indexPage);
router.get('/shop', shopCtrl.fetchProds);
router.get('/product/:id', shopCtrl.fetchProd);
router.get('/cart', isAuthen, ecartCtrl.fetchCart);
router.get('/orders', isAuthen, ecartCtrl.fetchOrders);
router.get('/checkout', isAuthen, ecartCtrl.checkOut);

router.post('/cart', isAuthen, ecartCtrl.addToCart);
router.post('/rem-item', isAuthen, ecartCtrl.remFromCart);
router.post('/new-order', isAuthen, ecartCtrl.addToOrder);

/* --- serve static ---
const path = require('path');
const appDir = require('../utils/abs-path');

res.sendFile(
  path.join(appDir, 'views', 'eshop.html')
);
*/

exports.routes = router;
// module.exports = router;
