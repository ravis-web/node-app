const bcrypt = require('bcryptjs');

const User = require('../models/User');

/* --- NodeMailer : SendGrid ---
const nodemail = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');

const transporter = nodemail.createTransport(sendGrid({
  auth: { api_key: 'longhashedString' }
}));
*/


exports.loginPage = (req, res) => {
  if (req.session.isLogged) {
    res.redirect('/');
  } else {
    res.render('auth/login', {
      docTitle: 'Login',
      path: req.url
    });
  }
};

exports.loginUser = (req, res) => {
  // User.findById('5f0ed86f87daf92cd4e2f78f')
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) return res.redirect('/login');
      return bcrypt.compare(req.body.password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.user = user;
            req.session.isLogged = true;
            return req.session.save(msg => { // db-sync
              console.log('login', msg);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
    })
    .catch(err => console.log(err));
};

exports.logoutUser = (req, res) => {
  req.session.destroy(msg => {
    console.log('logout', msg);
    res.redirect('/');
  });
};

exports.regPage = (req, res) => {
  if (!req.session.isLogged) {
    let msg = req.flash('msg');
    if (msg.length > 0) msg = msg[0];
    else msg = null;
    res.render('auth/regist', {
      docTitle: 'Register',
      path: req.url,
      msg: msg
    });
  } else res.redirect('/');
};

exports.regUser = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(usr => {
      // user-email exists
      if (usr) {
        // redirect-flash
        req.flash('msg', 'user already exists w. this email');
        return res.redirect('/register');
      }
      // email doesnt exist
      return bcrypt.hash(req.body.password, 12) // hashing w. salt
        .then(hashPass => {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(msg => {
          console.log('user-added');
          res.redirect('/login');

          /* --- send an email ---
          return transporter.sendMail({
            to: 'dest',
            from: 'src',
            subject: 'welcome',
            html: 'markup'
          });
          */
        });
    })
    .catch(err => console.log(err));
};
