const express = require('express');

const { check, body } = require('express-validator');

const isAuthen = require('../middleware/is-authen');

const User = require('../models/User');

const authCtrl = require('../controllers/authControl');
const errCtrl = require('../controllers/errorControl');

const router = express.Router();

router.get('/login', authCtrl.loginPage);
router.get('/error', errCtrl.err404);
router.get('/register', authCtrl.regPage);
router.get('/forgot', authCtrl.forgotPage);
router.get('/reset/:token', authCtrl.resetPage);

router.post('/login', [
  body('email').isEmail().withMessage('enter a valid email')
  /* --- custom validation ---
  .custom((val, { req }) => {
    return User.findOne({ email: val }).then(usr => {
      if (!usr) return Promise.reject('user doesnt exist');
      else { req.user = usr; return true; }
    });
  })
  */,
  body('password', 'enter a valid password').isLength({ min: 6 }).isAlphanumeric()
], authCtrl.loginUser);
router.post('/logout', isAuthen, authCtrl.logoutUser);
router.post('/register', [
  check('email').isEmail().withMessage('email not allowed')
    .custom((val, { req }) => { // custom-validator
      if (val === 'test@localhost.com') throw new Error('test-email not allowed');
      return User.findOne({ email: val })
        .then(usr => {
          // user-email exists
          if (usr) return Promise.reject('user already exists');
        });
    }),
  body('password', 'please enter a valid password')
    .isLength({ min: 5, max: 28 }).isAlphanumeric(),
  body('repassword').custom((val, { req }) => {
    if (val !== req.body.password) throw new Error('passwords do not match');
    return true;
  })],
  authCtrl.regUser);
router.post('/forgot', authCtrl.resetLink);
router.post('/reset', authCtrl.resetPass);

exports.routes = router;
