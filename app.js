const path = require('path');

const express = require('express');
const bParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const eshopRoutes = require('./routes/eshop');


// init express app
const app = express();


// register middleware
app.use(bParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use(adminRoutes);
app.use(eshopRoutes);

app.use((req, res) => {
	res.status(404).sendFile(
		path.join(__dirname, 'views', '404-page.html')
	);
});


// server
app.listen(5000);


/* --- Vanilla Node ---
const http = require('http');
const routes = require('./routes');
const server = http.createServer(routes);
server.listen(5000);
*/