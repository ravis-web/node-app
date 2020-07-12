const path = require('path');

const express = require('express');
const bParser = require('body-parser');

const admin = require('./routes/admin');
const eshop = require('./routes/eshop');
const dbase = require('./utils/db-conn');

const Prod = require('./models/Product');
const User = require('./models/UserAcc');

const errCtrl = require('./controllers/errorControl');
const { log } = require('console');


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

app.use((req, res, nxt) => {
  User.findByPk(1)
    .then(usr => {
      req.user = usr;
      nxt();
    })
    .catch(err => console.log(err));
});


// routes
app.use(admin.routes);
app.use(eshop.routes);

app.use(errCtrl.err404);

/* --- serve static ---
res.status(404).sendFile(
  path.join(__dirname, 'views', '404-page.html')
);
*/

// associations/relations
Prod.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Prod); // inv-mapping


// sequelize : db-sync
dbase
  .sync()
  // .sync({ force: true }) // db-overwrite (dev)
  .then(msg => User.findByPk(1))
  .then(usr => {
    if (!usr) {
      User.create({ name: 'Admin', mail: 'admin@localhost.com' });
    }
    return usr;
  })
  .then(usr => {
    if (usr) app.listen(5000); // start-server
  })
  .catch(err => console.log(err));


/* --- MySQL database ---
dbase.execute('SELECT * FROM products')
  .then(([res]) => console.log(res[0]))
  .catch(err => console.log(err));
*/


/* --- Vanilla Node ---
const http = require('http');
const routes = require('./routes');
const server = http.createServer(routes);
server.listen(5000);
*/
