const mysql = require("mysql");
const FileReader = require('filereader');
const Blob = require('blob');


const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  dateStrings: true,
});


exports.confirmationpage = async (req, res) => {
  try {

    const { identify } = req.body;


    auth = 'SELECT * FROM internship_list WHERE internshipID = ' + identify

    db.query(auth, async (error, rows, results) => {

      console.log("selam")
      if (!results[0]) {
        res.status(401).render('teacherpage', {
          message: 'There are no students record on system'
        })
      }
      else {
        var testObj = {
          'internshipID': rows[0].internshipID,
          'studentID': rows[0].studentID,
          'company': rows[0].company,
          'work_day': rows[0].work_day,
          'start_date': rows[0].start_date,
          'end_date': rows[0].end_date,
          'confirmation': rows[0].confirmation
        }

        console.log(testObj)

        res.status(200).render('change/confirmupdate', {
          message: 'Here is the internship form',
          "testObj": testObj
        });
      }
    });
  }
  catch (error) {
    console.log(error);
  }
}


exports.updaterecord = async (req, res) => {
  try {


    var p1 = req.body.Internship_ID;
    var p2 = req.body.Student_ID;
    var p3 = req.body.Company;
    var p4 = req.body.Work_Day;
    var p5 = req.body.Start_Date;
    var p6 = req.body.End_Date;
    var p7 = 1

    console.log(p2, p3, p4, p5, p6, p7)

    var auth = "UPDATE internship_list SET studentID = ?, company = ?, work_day = ?, start_date = ?, end_date = ?, confirmation = ? WHERE internshipID = ?";

    db.query(auth, [p2, p3, p4, p5, p6, p7, p1], async (error, rows, results) => {

      if (error) {
        console.log(error)
      }
      else {
        res.redirect("/teacherpage")
      }
    });

  }
  catch (error) {
    console.log(error);
  }
}



exports.select = (req, res) => {

  var p1 = req.body.form1;
  var p2 = req.body.form2;
  var p3 = req.body.form3;

  var tarih1 = p3
  tarih1 = tarih1.slice(0, 10)
  var tarih2 = p3
  var uzun = tarih2.length;
  tarih2 = tarih2.slice(uzun - 10, uzun)

  var startdate = tarih1.slice(6, 10) + "-" + tarih1.slice(0, 2) + "-" + tarih1.slice(3, 5)
  var enddate = tarih2.slice(6, 10) + "-" + tarih2.slice(0, 2) + "-" + tarih2.slice(3, 5)
  /*
    console.log("Company : " + p1)
    console.log("Work Day : " + p2)
    console.log("StartX : " + startdate)
    console.log("EndX : " + enddate)
  */
  var ahmetnum = 16290126

  db.query('INSERT INTO internship_list SET ?', { studentID: ahmetnum, company: p1, work_day: p2, start_date: startdate, end_date: enddate, }, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      //console.log(results);
      console.log('DONE!!!');
      return res.redirect("/studentpage")
    }
  })
}

exports.pdf = function (req, res) {
  /*    var fs = require('fs');
      var temp_path = "C://Users//lenovo//Desktop//Deneme.pdf";
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
  //////////////////////////////////////////////////////////

  var blob;
  db.query("SELECT * FROM files", async (error, rows, results) => {
    if (error)
      console.log(error);

    else {
      // when calling file blob, need to write "blob.file"
      blob = rows[0];
      var fileData = blob.file;
      var file_name = "Zorunluluk Belgesi"
      res.writeHead(200, {
        "Content-Disposition": "attachment;filename=" + file_name,
        'Content-Type': 'application/pdf',
        'Content-Length': fileData.length
      });
      res.write(fileData);
      res.end(fileData);
    }
  });
}
