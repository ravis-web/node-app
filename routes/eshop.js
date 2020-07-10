const express = require('express');

const prodCtrl = require('../controllers/prodControl');
const ecartCtrl = require('../controllers/ecartControl');

// express-router
const router = express.Router();

router.get('/', prodCtrl.indexPage);
router.get('/shop', prodCtrl.fetchProds);
router.get('/cart', ecartCtrl.fetchCart);
router.get('/orders', ecartCtrl.fetchOrders);

/* --- serve static ---
const path = require('path');
const appDir = require('../utils/abs-path');

res.sendFile(
  path.join(appDir, 'views', 'eshop.html')
);
*/

exports.routes = router;
// module.exports = router;