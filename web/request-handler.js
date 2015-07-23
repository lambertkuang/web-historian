var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  //check to see if we have a POST request
    //if the url received by the POST request exists in our archive
        //serve that page
    //else spawn a web worker
        //add the new page to our archive
        
  if (req.method === 'GET') {
     
      var statusCode = 200;
      var headers = helpers.headers;
      helpers.serveAssets(res, __dirname + "/public/index.html", function(err, file) {
        if (err) {
          throw err;
        } else {
          res.writeHead(statusCode, headers);
          res.write(file);
          res.end();
        }
      });
     
  } else if (req.method === 'POST'){
   
    var statusCode = 302;
    var headers = helpers.headers;
    req.on('data',function(data){
      var urlName = JSON.parse(data);
      var url = urlName.url+"\n";
      archive.addUrlToList(url);

    });
    res.writeHead(statusCode,headers);
    //res.write()
    res.end();
    

  }
  //res.end(archive.paths.list);
};
