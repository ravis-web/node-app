const fs = require('fs');
const path = require('path');

const PDFDoc = require('pdfkit');

// using private auth for Stripe
const auth = require('../utils/stripe-in');
const stripe = require('stripe')(auth.token); // TEST_API_SECRET_TOKEN

const Product = require("../models/Prod");
const Order = require("../models/Order");

exports.addToCart = (req, res, nxt) => {
  // Product.findId(req.body.prodId) // mongodb
  Product.findById(req.body.prodId) // mongoose
    .then(prod => {
      return req.user.addToCart(prod)
    })
    .then(msg => {
      console.log('added-to-cart');
      res.redirect('/cart');
    })
    .catch(err => nxt(err));
};

exports.fetchCart = (req, res, nxt) => {
  req.user.populate('cart.items.prodId').execPopulate() // ret user w prod-info
    .then(user => {
      const prods = user.cart.items;
      res.render('e-shop/e-cart', {
        products: prods,
        docTitle: 'Cart',
        path: req.url,
        user: req.user
      });
    })
    .catch(err => nxt(err));
};

exports.remFromCart = (req, res, nxt) => {
  req.user.deleteItem(req.body.prodId)
    .then(() => res.redirect('/cart'))
    .catch(err => nxt(err));
};

exports.addToOrder = (req, res, nxt) => {
  req.user.populate('cart.items.prodId').execPopulate() // ret user w prod-info
    .then(user => {
      const prods = user.cart.items.map(i => {
        return { prod: { ...i.prodId._doc }, quantity: i.quantity }; // '.doc' - w/o metadata
      });
      const order = new Order({
        items: prods,
        user: {
          name: req.user.name,
          // userId: req.user, // mongoose : maps only '_id'
          userId: req.user._id
        }
      });
      return order.save(); // ret prom
    })
    .then(result => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => nxt(err));
};

exports.fetchOrders = (req, res, nxt) => {
  Order.find({ 'user.userId': req.user._id }) // mongoose
    .then(orders => {
      res.render('e-shop/order', {
        orders: orders,
        docTitle: 'Orders',
        path: req.url,
        user: req.user
      });
    })
    .catch(err => nxt(err));
};

exports.checkOut = (req, res, nxt) => {
  let prods = [];
  let total = 0;
  req.user.populate('cart.items.prodId').execPopulate() // ret user w prod-info
    .then(user => {
      prods = user.cart.items;

      /* --- Stripe : Server (legacy) --- */
      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: prods.map(p => {
          total += p.quantity * p.prodId.price;
          return {
            name: p.prodId.title,
            description: p.prodId.descr,
            amount: p.prodId.price * 100, // cents
            currency: 'usd', // US $
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // http://localhost:5000/checkout/success
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel' // http://localhost:5000/checkout/cancel
      })

    })
    .then(session => {
      res.render('e-shop/ckout', {
        products: prods,
        docTitle: 'Checkout',
        path: req.url,
        user: req.user,
        total: total.toFixed(2),
        sessionId: session.id,
        api_k: auth.api_k
      });

    })
    .catch(err => nxt(err));
};

exports.fetchInvoice = (req, res, nxt) => {
  const filename = 'invoice-' + req.params.id + '.pdf';
  const filePath = path.join('data', 'invoices', filename); // cross-os

  Order.findOne({ _id: req.params.id }) // mongoose
    .then(order => {
      if (order) {
        /* --- creating PDF documents --- */
        const pdf = new PDFDoc(); // read-stream

        pdf.pipe(fs.createWriteStream(filePath)); // write-stream (server)

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"'); // view

        pdf.pipe(res); // write-stream (response)

        pdf.font('Helvetica-Bold').fontSize(16).text(`INVOICE`).moveDown(0.5); // add-text
        pdf.font('Courier').fontSize(8).text('-------------------------------------------------'); // add-text
        pdf.font('Courier').fontSize(12).text(`Order # ${req.params.id}`); // add-text
        pdf.font('Courier').fontSize(8).text('-------------------------------------------------').moveDown(0.5); // add-text

        let total = 0;

        order.items.forEach(item => {
          total += item.prod.price * item.quantity;
          pdf.font('Courier').fontSize(10).text(`${item.quantity} x ${item.prod.title} @ INR.${item.prod.price.toFixed(2)} --- ${(item.quantity * item.prod.price).toFixed(2)}`).moveDown(0.25); // add-item(s)
        })

        pdf.font('Courier').fontSize(8).text('-------------------------------------------------'); // add-text
        pdf.font('Courier').fontSize(12).text(`Total # INR.${total.toFixed(2)}`); // add-text
        pdf.font('Courier').fontSize(8).text('-------------------------------------------------'); // add-text

        pdf.end(); // write-complete

      }
    })
    .catch(err => nxt(err));

  /* --- readFile() consumes memory ---
  fs.readFile(filePath, (err, data) => {
    if (err) return nxt(err);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"'); // view
    // res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"'); // save
    res.send(data);
  });
  */

  /* --- stream data-file ---
  const file = fs.createReadStream(filePath); // read-stream (chunks)
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"'); // view
  file.pipe(res); // o/p to browser (chunks)
  */
};
