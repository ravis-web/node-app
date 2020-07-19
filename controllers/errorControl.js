exports.err404 = (req, res) => {
  res.status(404).render('errors/404-page', {
    docTitle: 'Page Not Found',
    path: req.url
  })
};

exports.err500 = (req, res) => {
  res.status(500).render('errors/500-page', {
    docTitle: 'Server Error',
    path: req.url
  })
};
