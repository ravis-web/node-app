const path = require('path');

const express = require('express');
const bParser = require('body-parser');

const admin = require('./routes/admin');
const eshop = require('./routes/eshop');


// init express app
const app = express();


// express - configs
app.set('view engine', 'pug');
app.set('views', 'views');


// register middleware
app.use(bParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use(admin.routes);
app.use(eshop.routes);

app.use((req, res) => {
  res.status(404).render('404-page', { docTitle: 'Page Not Found' });

  /* --- serve static ---
  res.status(404).sendFile(
    path.join(__dirname, 'views', '404-page.html')
  );
  */
});


// server
app.listen(5000);


/* --- Vanilla Node ---
const http = require('http');
const routes = require('./routes');
const server = http.createServer(routes);
server.listen(5000);
*/