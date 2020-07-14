const express = require('express');

const prodCtrl = require('../controllers/prodControl');
const ecartCtrl = require('../controllers/ecartControl');

// express-router
const router = express.Router();

router.get('/', ecartCtrl.indexPage);
router.get('/shop', prodCtrl.fetchProds);
router.get('/product/:id', prodCtrl.fetchProd);
router.get('/cart', ecartCtrl.fetchCart);
// router.get('/orders', ecartCtrl.fetchOrders);
// router.get('/checkout', ecartCtrl.checkOut);

router.post('/cart', ecartCtrl.addToCart);
router.post('/rem-item', ecartCtrl.remFromCart);
// router.post('/new-order', ecartCtrl.addToOrder);

/* --- serve static ---
const path = require('path');
const appDir = require('../utils/abs-path');

res.sendFile(
  path.join(appDir, 'views', 'eshop.html')
);
*/

exports.routes = router;
// module.exports = router;
