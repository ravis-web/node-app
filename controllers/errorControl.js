exports.err404 = (req, res) => {
  res.status(404).render('errors/404-page', {
    docTitle: 'Page Not Found',
    path: req.url,
    isLogged: req.session.isLogged
  })
};
