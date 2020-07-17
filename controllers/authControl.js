const crypto = require('crypto');

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

exports.forgotPage = (req, res) => {
  if (req.session.isLogged) {
    res.redirect('/');
  } else {
    let msg = req.flash('msg');
    if (msg.length > 0) msg = msg[0];
    else msg = null;
    res.render('auth/forgot', {
      docTitle: 'Forgot Password',
      path: req.url,
      msg: msg
    });
  }
};

exports.resetLink = (req, res) => {
  // 1. create token
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect('/forgot');
    const token = buffer.toString('hex'); // ASCII string

    // 2. validate user
    User.findOne({ email: req.body.email })
      .then(usr => {
        if (!usr) {
          req.flash('msg', 'user doesnt exist w. this email');
          return res.redirect('/forgot');
        }
        // 3. sync token db
        usr.resetToken = token;
        usr.resetExpire = Date.now() + 1800000; // half-hr
        return usr.save().then(reslt => {
          // 4. render view
          req.flash('msg', 'reset link has been sent to email');
          res.redirect('/forgot');
          /* 5. send email
          return transporter.sendMail({
            to: req.body.email,
            from: 'admin@localhost',
            subject: '[IMP] Password Reset',
            html: `
              <p>Reset Link : <a href="http://localhost:5000/reset/${token}">Reset</a>
            `
          });
          */
        })
      })
      .catch(err => console.log(err));
  });
};

exports.resetPage = (req, res) => {
  // 1. validate user
  User.findOne({
    resetToken: req.params.token,
    resetExpire: { $gt: Date.now() }
  })
    .then(usr => {
      if (usr) {
        // 2. load reset page
        let msg = req.flash('msg');
        if (msg.length > 0) msg = msg[0];
        else msg = null;
        return res.render('auth/reset', {
          docTitle: 'Reset Password',
          path: req.url,
          msg: msg,
          token: req.params.token,
          userId: usr._id.toString()
        });
      } else return res.redirect('/error');
    })
    .catch(err => console.log(err));

};

exports.resetPass = (req, res) => {
  let updUser;
  User.findOne({
    resetToken: req.body.token,
    resetExpire: { $gt: Date.now() },
    _id: req.body.userId
  })
    .then(usr => {
      updUser = usr;
      return bcrypt.hash(req.body.password, 12)
    })
    .then(hashPass => {
      updUser.password = hashPass;
      updUser.resetToken = undefined;
      updUser.resetExpire = undefined;
      return updUser.save();
    })
    .then(rslt => { res.redirect('/login') })
    .catch();
};
