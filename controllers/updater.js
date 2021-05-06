const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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


exports.change_password = async (req, res) => {
  try {
    var first = req.body.password;
    var second = req.body.password2;

    if (first != second) {
      res.status(200).redirect("/studentpage");
    }

    else {

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
      let hashedPassword = await bcrypt.hash(first, 8);

      db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, num], async (error, rows, results) => {
        if (error) {
          console.log(error);
        }

        else {
          res.redirect("/studentpage");
        }
      });
    }
  }

  catch (error) {
    console.log(error);
  }
}