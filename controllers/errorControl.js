exports.err404 = (req, res) => {
  res.status(404).render('404-page', {
    docTitle: 'Page Not Found'
  })
};