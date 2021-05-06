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


exports.addNewUser = (req, res) => {
  console.log(req.body);

  const { name, email, password, password2 } = req.body;

  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }

    if (results.length > 0) {
      return res.render('../views/addinfo/adduser', {
        message: 'That email is already in use'
      });
    } else if (password !== password2) {
      return res.render('../views/addinfo/adduser', {
        message: 'Passwords do not match'
      });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    //console.log('Hashed password : ' + hashedPassword);

    db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        //console.log(results);
        console.log('New user registered with email : ' + email);
        /*return res.render('../views/addinfo/adduser', {
          message: 'User succesfully registered',
        });*/
        res.redirect('/adminpage')
      }
    })
  });
}


exports.search = (req, res) => {
  var text = req.body.search;
  var temp = req.body.drop_list;
  var personList = [];
  
  var sql = ["SELECT * FROM users WHERE  id = ?", "SELECT * FROM users WHERE  name = ?", "SELECT * FROM users WHERE  email = ?"];
    db.query(sql[temp], [text], async (error, rows, results) => {
      for (var i = 0; i < rows.length; i++) {
        person = {
          'id': rows[i].id,
          'name': rows[i].name,
          'email': rows[i].email,
          'type': rows[i].type
        }
        personList.push(person);
      }

      if(personList[0] == undefined){
        res.redirect('/adminpage');
      }
      
      else{
        db.query("SELECT * FROM internship_list WHERE studentID = ?", [personList[0].id], async (error, rows, results) => {

          var internshipList = [];
          for (var i = 0; i < rows.length; i++) {
            var internship = {
              'internshipID': rows[i].internshipID,
              'studentID': rows[i].studentID,
              'company': rows[i].company,
              'work_day': rows[i].work_day,
              'start_date': rows[i].start_date,
              'finish_date': rows[i].end_date,
              'confirmation': rows[i].confirmation
            }
            if (internship.start_date == "0000-00-00") {
              internship.start_date = "N/A";
            }
            if (internship.finish_date == "0000-00-00") {
              internship.finish_date = "N/A";
            }
            // Add object into array
            internshipList.push(internship);

            res.status(200).render('personal/adminpage', {
              message: 'There is at least one internship record on system',
              "personList": personList,
              "internshipList": internshipList
            });
          }
        });
      }
    });
}