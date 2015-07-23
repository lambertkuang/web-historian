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
      
      if (req.url === '/'){
        
        helpers.serveAssets(res, __dirname + "/public/index.html", function(err, file) {
          if (err) {
            throw err;
          } else {
            res.writeHead(statusCode, headers);
            res.write(file);
            res.end();
          }
        });
      } else {
            //check to see if url exists in archive
         archive.isUrlArchived(req.url, function(exists) {
             if (exists) {
                 helpers.serveAssets(res, "/Users/student/Desktop/2015-06-web-historian/archives/sites" + req.url, function(err, file) {
                    
                     if (err) {
                         throw err;
                     } else {
                         res.writeHead(statusCode, headers);
                         res.write(file);
                         res.end();
                     }
                 });
             } else {
                 // serve the loading page
                 // use htmlfetcher.js to download the page
                 console.log("/Users/student/Desktop/2015-06-web-historian/archives/sites" + req.url);
             }
         });
      }

     
     
  } else if (req.method === 'POST'){
   
    var statusCode = 302;
    var headers = helpers.headers;
    req.on('data',function(data){
      console.log('DATA: ' + data)
      var url = data.slice(4) + '\n';
      // var urlName = JSON.parse(data);
      // console.log("URLNAME: " +  urlName);
      // var url = urlName.url+"\n";
      // var url = data;
      console.log('add site to list' + url);
      // archive.addUrlToList(url);

      fs.appendFile(archive.paths.list,url,function(err) {
        console.log('appending new file')
        if (err) {
          throw err;
        }
        res.writeHead(statusCode,headers);
        helpers.serveAssets(res, __dirname + "/public/loading.html",function(err,file){
          if (err){
            console.log("have an error" + err);
            throw err;
          } else {
            res.writeHead(statusCode,headers);
            res.write(file);
            res.end();
          }
        });
     
      });

    });
    

  }
  //res.end(archive.paths.list);
};
