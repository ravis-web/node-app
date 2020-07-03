const path = require('path');

const express = require('express');

const appDir = require('../utils/abs-path');

// express-router
const router = express.Router();

// cross-accessible
const prodArr = [];

router.get('/add-product', (req, res, next) => {
  res.render('add-prod', { docTitle: 'Add Product' })

  /* --- serve static ---
  res.sendFile(
    path.join(appDir, 'views', 'add-prod.html')
  );
  */
});

router.post('/products', (req, res, next) => {
  prodArr.push(req.body.title);
  res.redirect('/'); // re-direct
});

exports.routes = router;
exports.products = prodArr;
// module.exports = router;