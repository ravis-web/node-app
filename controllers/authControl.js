const User = require('../models/User');

exports.loginPage = (req, res) => {
  if (req.session.isLogged) {
    res.redirect('/');
  } else {
    res.render('auth/login', {
      docTitle: 'Login',
      path: req.url,
      isLogged: req.session.isLogged
    });
  }
};

exports.loginUser = (req, res) => {
  User.findById('5f0ed86f87daf92cd4e2f78f')
    .then(user => {
      req.session.user = user;
      req.session.isLogged = true;
      req.session.save(msg => { // db-sync
        console.log('login', msg);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.logoutUser = (req, res) => {
  req.session.destroy(msg => {
    console.log('logout', msg);
    res.redirect('/');
  });
};
