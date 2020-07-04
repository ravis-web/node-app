const express = require('express');

const prodCtrl = require('../controllers/prodControl');

// express-router
const router = express.Router();

router.get('/add-product', prodCtrl.addProd);

/* --- serve static ---
const path = require('path');
const appDir = require('../utils/abs-path');

res.sendFile(
  path.join(appDir, 'views', 'add-prod.html')
);
*/

router.post('/products', prodCtrl.saveProd);

exports.routes = router;
// module.exports = router;