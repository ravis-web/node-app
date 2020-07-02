const path = require('path');

const express = require('express');

const appDir = require('../utils/abs-path');

const prodArr = require('./admin');

// express-router
const router = express.Router();

router.get('/', (req, res) => {
  res.render('eshop', { products: prodArr.products, docTitle: 'E-Shop' });

  /* --- serve static ---
  res.sendFile(
    path.join(appDir, 'views', 'eshop.html')
  );
  */
});

exports.routes = router;
// module.exports = router;