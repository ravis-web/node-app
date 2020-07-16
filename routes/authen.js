const express = require('express');

const authCtrl = require('../controllers/authControl');
const errCtrl = require('../controllers/errorControl');

const router = express.Router();

router.get('/login', authCtrl.loginPage);
router.get('/error', errCtrl.err404);

router.post('/login', authCtrl.loginUser);
router.post('/logout', authCtrl.logoutUser);

exports.routes = router;
