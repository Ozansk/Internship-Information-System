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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('login', {
        message: 'Please provide email and password'
      });
    }
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {

      if (!results || !(await bcrypt.compare(password, results[0].password))) {
        res.status(401).render('login', {
          message: 'Email or Password is incorrect'
        })
      }

      else if (results[0].type == 'none') {
        const type = results[0].type;
        console.log("This users' type is " + type);

        return res.status(400).render('login', {
          message: 'User not activated yet'
        });

      }

      else {
        const id = results[0].id;
        const type = results[0].type;
        const token = jwt.sign({ id: id, type: type }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        console.log("The token is " + token);

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions);

        switch (type) {
          case 'user':
            res.status(200).redirect("/studentpage");
            break;
          case 'teacher':
            res.status(200).redirect("/teacherpage");
            break;
          case 'admin':
            res.status(200).redirect("/adminpage");
            break;
          case 'none':
            res.status(200).redirect("/index");
            break;
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

exports.register = (req, res) => {
  console.log(req.body);
  if(!req.body.name || !req.body.id || !req.body.password || !req.body.password2){
    return res.render('register', {
      message: 'Please fill in all fields',
      flag: 0
    })
  }
  const { name,id, email, password, password2 } = req.body;

  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }

    if (results.length > 0) {
      return res.render('register', {
        message: 'That email is already in use',
        flag: 0
      });
    } else if (password !== password2) {
      return res.render('register', {
        message: 'Passwords do not match',
        flag: 0
      });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    //console.log('Hashed password : ' + hashedPassword);

    db.query('INSERT INTO users SET ?', { name: name,id:id, email: email, password: hashedPassword }, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        //console.log(results);
        console.log('New user registered with email : ' + email);
        return res.render('login', {
          message: 'User succesfully registered',
          flag: 1
        });
      }
    })
  });
}