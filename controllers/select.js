const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const { PDFDocument } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require("fs");
const Excel = require('exceljs');

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
  var p4 = req.body.country;
  var p5 = req.body.saturday;
  var p6 = req.body.sunday;


  var getDaysArray = function (start, end) {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  var tarih1 = p3
  tarih1 = tarih1.slice(0, 10)
  var tarih2 = p3
  var uzun = tarih2.length;
  tarih2 = tarih2.slice(uzun - 10, uzun)

  var startdate = tarih1.slice(6, 10) + "-" + tarih1.slice(0, 2) + "-" + tarih1.slice(3, 5)
  var enddate = tarih2.slice(6, 10) + "-" + tarih2.slice(0, 2) + "-" + tarih2.slice(3, 5)


  var daylist = getDaysArray(new Date(startdate), new Date(enddate));
  daylist.map((v) => v.toISOString().slice(0, 10)).join("")

  db.query("SELECT holiday_date FROM holiday_list", (error, rows, results) => {
    var holidays = [];
    for (var i = 0; i < rows.length; i++) {
      holidays.push(rows[i].holiday_date);
    }

    if (p4 == undefined) {
      var temp = 0;
      for (var i = 0; i < daylist.length; i++) {
        var birthday = new Date(daylist[i]);
        //2021-08-23T00:00:00.000Z
        let isholiday = birthday.toISOString().slice(0, 10);
        var day1 = birthday.getDay();


        for (var j = 0; j < holidays.length; j++) {
          if (isholiday == holidays[j]) {
            temp--;
          }
          if ((day1 == 0 && isholiday == holidays[j]) || (day1 == 6 && isholiday == holidays[j])) {
            temp++;
            if (p5 == "saturday" && day1 == 0)
              temp--;
            if (p6 == "sunday" && day1 == 6)
              temp--;
          }
        }

        temp++;

        if ((day1 == 0) || (day1 == 6)) {
          temp--;
          if (p5 == "saturday" && day1 == 0)
            temp++;
          if (p6 == "sunday" && day1 == 6)
            temp++;
        }
      }
    }

    if (p4 == "country") {
      var temp = 0;
      for (var i = 0; i < daylist.length; i++) {
        var birthday = new Date(daylist[i]);
        var day1 = birthday.getDay();

        temp++;

        if ((day1 == 0) || (day1 == 6)){
          temp--;
          if(day1 == 0 && p5 == "saturday")
            temp++;
          if(day1 == 6 && p6 == "sunday")
            temp++;
        }
      }
    }

    //console.log(temp);
    /*
      console.log("Company : " + p1)
      console.log("Work Day : " + p2)
      console.log("StartX : " + startdate)
      console.log("EndX : " + enddate)
    */


    if (p2 == temp) {
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
      db.query('INSERT INTO internship_list SET ?', { studentID: num, company: p1, work_day: p2, start_date: startdate, end_date: enddate, }, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          //console.log(results);
          console.log('DONE!!!');
          return res.redirect("/studentpage")
        }
      })
    }
    else {
      res.redirect("/internshipselect");
    }
  });
}


exports.holidays = function (req, res) {
  var arr = req.body.holiday;
  var i;
  for (i = 0; i < arr.length; i = i + 12) {
    date = arr.slice(i, i + 10);
    date = date.slice(6, 10) + "-" + date.slice(0, 2) + "-" + date.slice(3, 5);
    db.query("INSERT IGNORE INTO holiday_list (holiday_date) VALUES (?)", [date], async (error, rows, results) => {
      if (error)
        console.log(error);
    });
  }
  res.redirect("/adminpage");
}

exports.pdf = function (req, res) {
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
  var number = num.toString();
  var blob;
  db.query("SELECT name FROM users WHERE id = ?", [num], async (error, rows, results) => {

    let name = rows[0].name;
    db.query("SELECT * FROM files", async (error, rows, results) => {
      if (error)
        console.log(error);

      else {
        const font = fs.readFileSync('./public/char/Ubuntu-R.ttf');
        function toBuffer(ab) {
          var buf = Buffer.alloc(ab.byteLength);
          var view = new Uint8Array(ab);
          for (var i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
          }
          return buf;
        }

        blob = rows[0];
        fileData = blob.file;
        const pdfDoc = await PDFDocument.load(fileData);
        pdfDoc.registerFontkit(fontkit);
        const times = await pdfDoc.embedFont(font);
        //const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        firstPage.drawText(number, {
          x: 235,
          y: 495,
          font: times,
          size: 10
        });
        firstPage.drawText(name, {
          x: 390,
          y: 495,
          font: times,
          size: 10
        });

        var pdfBytes = await pdfDoc.save();
        pdfBytes = toBuffer(pdfBytes);
        var fileData = pdfBytes;
        var file_name = "Zorunluluk Belgesi.pdf"
        res.writeHead(200, {
          "Content-Disposition": "attachment;filename=" + file_name,
          'Content-Type': "application/pdf",
          'Content-Length': fileData.length
        });
        res.write(fileData);
        res.end();
      }
    });
  });
}


exports.excel = function (req, res) {

  let workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet('Onaylılar');
  query = "SELECT users.id, users.name, internship_list.company, internship_list.work_day, internship_list.start_date, internship_list.end_date, internship_list.confirmation FROM users INNER JOIN internship_list ON users.id=internship_list.studentID";
  db.query(query, async (error, rows, results) => {
    var userList = [];
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].confirmation) {
        var user = {
          'studentID': rows[i].id,
          'name': rows[i].name,
          'company': rows[i].company,
          'work_day': rows[i].work_day,
          'start_date': rows[i].start_date,
          'end_date': rows[i].end_date
        }
        /*        if (user.start_date == "0000-00-00") {
                  user.start_date = "N/A";
                }
                if (user.finish_date == "0000-00-00") {
                  user.end_date = "N/A";
                }*/
        userList.push(user);
      }
    }

    worksheet.columns = [
      { header: 'Student ID', key: 'studentID', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Company', key: 'company', width: 25 },
      { header: 'Work Day', key: 'work_day', width: 25 },
      { header: 'Start Date', key: 'start_date', width: 25, style: { numFmt: 'yyyy-mm-dd' } },
      { header: 'End Date', key: 'end_date', width: 25, style: { numFmt: 'yyyy-mm-dd' } }
    ]
    worksheet.getRow(1).font = { bold: true }
    for (var i = 0; i < userList.length; i++) {
      worksheet.addRow({
        studentID: userList[i].studentID,
        name: userList[i].name,
        company: userList[i].company,
        work_day: userList[i].work_day,
        start_date: new Date(userList[i].start_date),
        end_date: new Date(userList[i].end_date)
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Students.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });

}



exports.internship = function (req, res) {

  db.query("SELECT holiday_date FROM holiday_list", async (error, rows, results) => {
    days = [];
    for (var i = 0; i < rows.length; i++) {
      var day = rows[i].holiday_date[5] + rows[i].holiday_date[6] + "/" + rows[i].holiday_date[8] + rows[i].holiday_date[9] + "/" + rows[i].holiday_date.slice(0, 4);
      days.push(day);
    }
    res.status(200).render('calendar/internshipselect', {
      message: 'There is at least one internship record on system',
      "days": days
    });
  });
}
