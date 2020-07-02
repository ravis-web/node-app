/*--- Routing : Vanilla Node ---*/

const fs = require('fs');

const reqHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Index</title></head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="msg"/><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const bChunks = [];

    // parse data
    req.on('data', chunk => bChunks.push(chunk));

    // create buffer
    return req.on('end', () => {
      const body = Buffer.concat(bChunks).toString();
      const message = body.split('=')[1];

      // write file
      fs.writeFile('input.txt', message, err => {

        // redirect
        res.writeHead(302, { 'Location': '/' });
        return res.end();

      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>Message</title></head>');
  res.write('<body><h3>Your Message here.</h3></body>');
  res.write('</html>');
  res.end();

};

module.exports = reqHandler;