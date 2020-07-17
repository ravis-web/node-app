const express = require('express');

const isAuthen = require('../middleware/is-authen');

const authCtrl = require('../controllers/authControl');
const errCtrl = require('../controllers/errorControl');

const router = express.Router();

router.get('/login', authCtrl.loginPage);
router.get('/error', errCtrl.err404);
router.get('/register', authCtrl.regPage);
router.get('/forgot', authCtrl.forgotPage);
router.get('/reset/:token', authCtrl.resetPage);

router.post('/login', authCtrl.loginUser);
router.post('/logout', isAuthen, authCtrl.logoutUser);
router.post('/register', authCtrl.regUser);
router.post('/forgot', authCtrl.resetLink);
router.post('/reset', authCtrl.resetPass);

exports.routes = router;
