const path = require('path');

const express = require('express');

const appDir = require('../utils/abs-path');

// express-router
const router = express.Router();

router.get('/', (req, res) => {
	res.sendFile(
		path.join(appDir, 'views', 'eshop.html')
	);
});

module.exports = router;