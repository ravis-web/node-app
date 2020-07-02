const path = require('path');

const express = require('express');

const appDir = require('../utils/abs-path');

// express-router
const router = express.Router();

router.get('/add-product', (req, res, next) => {
	res.sendFile(
		path.join(appDir, 'views', 'add-prod.html')
	);
});

router.post('/products', (req, res, next) => {
	console.log(req.body);
	res.redirect('/'); // re-direct
});

module.exports = router;