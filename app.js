const path = require('path');

const express = require('express');
const bParser = require('body-parser');

const admin = require('./routes/admin');
const eshop = require('./routes/eshop');

// const Mongo = require('./utils/db-conn');

const mongoose = require('mongoose');
const cluster = require('./utils/nosql-db').cluster;
const configs = require('./utils/nosql-db').configs;

const User = require('./models/User');

const errCtrl = require('./controllers/errorControl');
const { nextTick } = require('process');


// init express app
const app = express();


// template-engines
/* --- ejs ---*/
app.set('view engine', 'ejs');
app.set('views', 'views');


// register middleware
app.use(bParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, nxt) => {
  // User.findId('5f0d5d57df6ebed9f556fb0c') // mongodb
  User.findById('5f0ed86f87daf92cd4e2f78f') // mongoose
    .then(user => {
      req.user = user; // set-user
      nxt();
    })
    .catch(err => console.log('No user found'));
});


// routes
app.use(admin.routes);
app.use(eshop.routes);

app.use(errCtrl.err404);


// dbase-conn
mongoose.connect(cluster, configs)
  .then(conn => {
    console.log('cluster-connected');
    User.findOne().then(user => {
      if (!user) {
        user = new User({
          name: 'RX-Admin', email: 'admin@localhost', cart: { items: [] }
        });
        user.save()
          .then(msg => console.log('user-added'))
          .catch(err => console.log(err));
      }
      app.listen(5000);  // start-server
    })
  })
  .catch(err => console.log(err));

// Mongo.connect(() => app.listen(5000)); // start-server-callback


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



/* --- serve static ---
res.status(404).sendFile(
  path.join(__dirname, 'views', '404-page.html')
);
*/



/* --- Sequelize ---
 const User = require('./models/User');
 const Prod = require('./models/Product');
 const Cart = require('./models/Cart');
 const CartItem = require('./models/CartItem');
 const Order = require('./models/Order');
 const OrderItem = require('./models/OrderItem');

 app.use((req, res, nxt) => {
  User.findByPk(1)
    .then(usr => {
      req.user = usr;
      nxt();
    })
    .catch(err => console.log(err));
});

// associations/relations
Prod.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Prod); // inv-mapping
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Prod, { through: CartItem }); // many-many thru junct-model
Prod.belongsToMany(Cart, { through: CartItem });
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Prod, { through: OrderItem });
Prod.belongsToMany(Order, { through: OrderItem }); // inv-mapping

// sequelize : db-sync
dbase
  .sync()
  // .sync({ force: true }) // db-overwrite (dev)
  .then(msg => User.findByPk(1))
  .then(usr => {
    if (!usr) {
      return User.create({ name: 'Admin', mail: 'admin@localhost' });
    }
    return usr;
  })
  .then(usr => usr.createCart()) // create-cart
  .then(cart => {
    if (cart) app.listen(5000); // start-server
    console.log('server : online');
  })
  .catch(err => console.log(err));
*/



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
