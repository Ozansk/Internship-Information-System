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

exports.studentpage = async (req, res) => {
  try {
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

    let studentID = payload.id;

    console.log('Students ID is ' + studentID)

    db.query('SELECT * FROM internship_list WHERE studentID = ?', [studentID], async (error, rows, results) => {

      if (!results[0]) {
        res.status(401).render('studentpage', {
          message: 'There are no internship record on your ID'
        })
      }
      else {
        /* console.log(results) */
        var personList = [];
        for (var i = 0; i < rows.length; i++) {
          var person = {
            'internshipID': rows[i].internshipID,
            'studentID': rows[i].studentID,
            'company': rows[i].company,
            'work_day': rows[i].work_day,
            'start_date': rows[i].start_date,
            'end_date': rows[i].end_date,
            'confirmation': rows[i].confirmation
          }
          // Add object into array
          personList.push(person);
        }
        res.status(200).render('personal/studentpage', {
          message: 'There is at least one internship record on your ID',
          "personList": personList
        });
      }
    });
  }
  catch (error) {
    console.log(error);
  }
}

exports.teacherpage = async (req, res) => {
  try {
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

    let teacherID = payload.id;

    console.log('Teachers ID is ' + teacherID)

    db.query('SELECT * FROM internship_list', async (error, rows, results) => {

      if (!results[0]) {
        res.status(401).render('teacherpage', {
          message: 'There are no students record on system'
        })
      }
      else {
        /* console.log(results) */
        var personList = [];
        for (var i = 0; i < rows.length; i++) {
          var person = {
            'internshipID': rows[i].internshipID,
            'studentID': rows[i].studentID,
            'company': rows[i].company,
            'work_day': rows[i].work_day,
            'start_date': rows[i].start_date,
            'end_date': rows[i].end_date,
            'confirmation': rows[i].confirmation
          }
          // Add object into array
          personList.push(person);
        }
        res.status(200).render('personal/teacherpage', {
          message: 'There is at least one internship record on system',
          "personList": personList
        });
      }
    });
  }
  catch (error) {
    console.log(error);
  }
}

exports.adminpage = async (req, res) => {
  try {
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

    let adminID = payload.id;

    console.log('Admins ID is ' + adminID)

    db.query('SELECT * FROM users', async (error, rows, results) => {

      if (!results[0]) {
        res.status(401).render('adminpage', {
          message: 'There are no users on system'
        })
      }
      else {
        /* console.log(results) */
        var personList = [];
        for (var i = 0; i < rows.length; i++) {
          var person = {
            'id': rows[i].id,
            'name': rows[i].name,
            'email': rows[i].email,
            'type': rows[i].type
          }
          // Add object into array
          personList.push(person);
        }
        res.status(200).render('personal/adminpage', {
          message: 'There is at least one user record on system',
          "personList": personList
        });
      }
    });
  }
  catch (error) {
    console.log(error);
  }
}


/* Personal pages */