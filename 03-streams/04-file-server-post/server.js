const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require("./LimitSizeStream");
const stream = require("stream");
const {body} = require("koa/lib/response");
const fs = require("fs");

const server = new http.Server();

server.on('request',  (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf("/") !== -1){
    res.statusCode = 400;
    res.end('Bad request');
  }

  const filepath = path.join(__dirname, 'files', pathname);



  switch (req.method) {

    case 'POST':

      saveFile(filepath);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  function saveFile(filepath){
    const limitedStream = new LimitSizeStream({limit: 1000000, encoding: 'utf-8'});
    limitedStream.on('error', function (err) {
      if (err.code == 'LIMIT_EXCEEDED'){
        console.log("ERROR limitedStream:" + err.code);
        res.statusCode = 413;
        res.end("File too large.");
        return;
      }
      else{
        res.statusCode = 500;
        res.end("Bad data.");
      }
      limitedStream.end();
      return;
    });

    const outStream = fs.createWriteStream(filepath, {flags: 'wx'});
    outStream.on('error', function (err) {
      console.log("ERROR outStream:" + err.code);
      if (err.code == 'EEXIST'){
        res.statusCode = 409;
        res.end("File already exists.");
      }
      else{
        res.statusCode = 500;
        res.end("Error! We will fix it.");
      }
      outStream.end();
    });

    req.on("aborted", (err)=>{
      outStream.destroy();
      limitedStream.destroy();
      fs.unlink(filepath, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Aborted - file deleted.");
        }
      });
    });

    req
        .pipe(limitedStream)
        .pipe(outStream);

    outStream.on('finish', () => {
      res.statusCode = 201;
      res.end("Saved");
    })
  }
});

module.exports = server;
