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
          return res.render('../views/addinfo/adduser', {
            message: 'User succesfully registered',
          });
        }
      })
    });
  }