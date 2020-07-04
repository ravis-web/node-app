const express = require('express');

const prodCtrl = require('../controllers/prodControl');

// express-router
const router = express.Router();

router.get('/', prodCtrl.fetchProds);

/* --- serve static ---
const path = require('path');
const appDir = require('../utils/abs-path');

res.sendFile(
  path.join(appDir, 'views', 'eshop.html')
);
*/

exports.routes = router;
// module.exports = router;