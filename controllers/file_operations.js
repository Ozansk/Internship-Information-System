const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const { PDFDocument } = require('pdf-lib');
const dragDrop = require('drag-drop');


const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  dateStrings: true,
});

exports.student_files = function (req, res) {
    /////////////////////////// Firstly, adding file to mySQL table as blob 
    /*    var fs = require('fs');
        var temp_path = "C://Users//lenovo//Desktop//File.pdf";
        fs.open(temp_path, 'r', function (status, fd) {
          if (status) {
            console.log(status.message);
            return;
          }
          var stats = fs.statSync(temp_path)
          var fileSizeInBytes = stats.size
          var fileSize = fileSizeInBytes;
          var buffer = new Buffer.alloc(fileSize);
          fs.read(fd, buffer, 0, fileSize, 0, function (err, num) {
      
            var query = "INSERT INTO files SET ?",
              values = {
                file: buffer,
                file_length: buffer.length,
                file_name: 'Zorunluluk Belgesi',
                file_type: 'pdf'
              };
            db.query(query, values, async function (error, rows, results) {
              if (error) {
                console.log(error);
              } else {
                console.log('DONE!!!');
              }
            });
          });
        });*/
    ////////////////////////////////////////////////////////// end Blob file adding
  
    let token = req.cookies.jwt;
  
    var payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    }
    catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        // if the error thrown is because the JWT is unauthorized, return a 401 error
        return res.status(401).end()
      }
      // otherwise, return a bad request error
      return res.status(400).end()
    }
    //res.send(`Welcome ${payload.id}!`)
  
    let num = payload.id;

    var fs = require('fs');
    var multiparty = require('multiparty');
    var util = require('util');
    var form = new multiparty.Form();
    form.on('part', function(part) {
      // You *must* act on the part by reading it
      // NOTE: if you want to ignore it, just call "part.resume()"
     
      if (!part.filename) {
        // filename is not defined when this is a field and not a file
        console.log('got field named ' + part.name);
        // ignore field's content
        part.resume();
      }
     
      if (part.filename) {
        // filename is defined when this is a file
        count++;
        console.log('got file named ' + part.name);
        // ignore file's content here
        part.resume();
      }
     
      part.on('error', function(err) {
        // decide what to do
      });
    });

    form.on('close', function() {
      console.log('Upload completed!');
      res.setHeader('text/plain');
      res.end('Received ' + count + ' files');
    });

    form.parse(req);
    res.redirect("/studentpage");
  }
  