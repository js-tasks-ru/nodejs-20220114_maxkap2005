const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf("/") !== -1){
    res.statusCode = 400;
    res.end('Bad request');
  }

  switch (req.method) {
    case 'GET':
      sendFile(filepath);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }


  function sendFile(file) {
    fs.readFile(file, function(err, content) {
      if (err) {
        if (err.code == 'ENOENT') {
          res.statusCode = 404;
          res.end("File not found");
        } else {
          res.statusCode = 500;
          res.end("Error! We will fix it.");
        }
        return;
      }
      const mime = require('mime').getType(file);
      res.setHeader("Content-Type", mime + "; charset=utf-8");
      res.end(content);
    });
  }

});

module.exports = server;
