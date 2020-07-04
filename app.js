const path = require('path');

const express = require('express');
const bParser = require('body-parser');

const admin = require('./routes/admin');
const eshop = require('./routes/eshop');

const errCtrl = require('./controllers/errorControl');


// init express app
const app = express();


// template-engines
/* --- ejs ---*/
app.set('view engine', 'ejs');
app.set('views', 'views');

/* --- pug ---
app.set('view engine', 'pug');
app.set('views', 'views');
*/

/* --- handlebars ---
const expHbar = require('express-handlebars');

app.engine('hbs', expHbar({
  layoutsDir: 'views/layouts',
  defaultLayout: 'default',
  extname: 'hbs'
})); // reg handlebars

app.set('view engine', 'hbs');
app.set('views', 'views');
*/


// register middleware
app.use(bParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use(admin.routes);
app.use(eshop.routes);

app.use(errCtrl.err404);

/* --- serve static ---
res.status(404).sendFile(
  path.join(__dirname, 'views', '404-page.html')
);
*/


// server
app.listen(5000);


/* --- Vanilla Node ---
const http = require('http');
const routes = require('./routes');
const server = http.createServer(routes);
server.listen(5000);
*/