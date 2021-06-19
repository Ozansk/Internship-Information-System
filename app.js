const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require('cookie-parser');
//const fileupload = require('express-fileupload');
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })
var upload = multer({ dest: 'uploads/' });

dotenv.config({ path: './.env' })

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());


app.set('view engine', 'hbs');

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Everything is OK");
    }
})

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.get('/temp', (req, res) => {
    res.sendFile(__dirname + '/temp.html');
});

app.post('/temp',upload.array('myFiles', 4), function(req, res) {
    console.log(req.files.myFiles);
    // don't forget to delete all req.files when done
});

app.listen(5000, () => {
    console.log("Server started on PORT 5000!");
})