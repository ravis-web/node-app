const fs = require('fs');
const path = require('path');
const https = require('https');

const express = require('express');
const bParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const csrf = require('csurf');
const flash = require('connect-flash');

const helmet = require('helmet');
const compress = require('compression');
const morgan = require('morgan');

const admin = require('./routes/admin');
const eshop = require('./routes/eshop');
const authen = require('./routes/authen');

// const Mongo = require('./utils/db-conn');

const mongoose = require('mongoose');
const cluster = require('./utils/nosql-db').cluster;
const configs = require('./utils/nosql-db').configs;

const User = require('./models/User');

const errCtrl = require('./controllers/errorControl');
const multer = require('multer');


// SSL-TLS : Encryption
const certif = fs.readFileSync('server.cert');
const privateKey = fs.readFileSync('server.key');


// init express app
const app = express();


// multer - configs
const fileStore = multer.diskStorage({
  destination: (req, file, callb) => callb(null, 'uploads'),
  filename: (req, file, callb) => callb(null, Date.now() + '-' + file.originalname)
});
const fileFiltr = (req, file, callb) => {
  if (file.mimetype === 'image/png') callb(null, true);
  else callb(null, false);
};


// init session-storage
const store = new MongoStore({
  uri: cluster,
  collection: 'sessions'
  // expires: 'date-format' // auto-clean
});


// init csrfToken
const csrfSecure = csrf(); // init fx-wrap


// template-engines
/* --- ejs ---*/
app.set('view engine', 'ejs');
app.set('views', 'views');


// secure-headers
app.use(helmet());

// asset-compression
app.use(compress());

// request-logger
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));


// register middleware
app.use(bParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(multer({ storage: fileStore, fileFilter: fileFiltr }).single('image'));

app.use(session({
  secret: 'long-string', // hash-key
  resave: false,
  saveUninitialized: false,
  store: store // session-storage
  // cookie: {expires: 'date-format'} // cookie-configs for session
}));

app.use(csrfSecure); // csrf-middleware uses session
app.use(flash()); // flash redirect-data uses session

// rendered-views : local-vars
app.use((req, res, nxt) => {
  res.locals.isLogged = req.session.isLogged;
  res.locals.csrfToken = req.csrfToken();
  nxt();
});

app.use((req, res, nxt) => {
  if (!req.session.user) { // session-model
    return nxt();
  }
  // User.findId('5f0d5d57df6ebed9f556fb0c') // mongodb
  User.findById(req.session.user._id) // mongoose
    .then(user => { // mongoose - model
      req.user = user; // set-user
      nxt();
    })
    .catch(err => nxt(err));
});


// routes
app.use(admin.routes);
app.use(eshop.routes);
app.use(authen.routes);


// error-handler
app.use(errCtrl.err404);
app.use((err, req, res, nxt) => {
  console.log('async-error : ', err.message);
  res.status(500).render('errors/500-page', {
    docTitle: 'Server Error',
    path: req.url
  })
});


// dbase-conn
mongoose.connect(cluster, configs)
  .then(conn => {
    console.log('cluster-connected');
    console.log(process.env.ENVIR_MODE);

    /* http-mode */
    app.listen(process.env.PORT || 5000);  // start-server

    /* https-mode : ssl-encryption
    https.createServer({ key: privateKey, cert: certif }, app).listen(process.env.PORT || 5000);
    */
  })
  .catch(err => console.log(err));

// Mongo.connect(() => app.listen(5000)); // start-server-callback


/* --- user-create ---
User.findOne().then(user => {
  if (!user) {
    user = new User({
      name: 'RX-Admin', email: 'admin@localhost', cart: { items: [] }
    });
    user.save()
      .then(msg => console.log('user-added'))
      .catch(err => console.log(err));
  }
})
*/


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
