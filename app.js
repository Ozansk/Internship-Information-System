const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require("body-parser")
var db = require("./models");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Passport config
require('./config/passport')(passport);

// DB Config
const conn1 = 'mongodb+srv://Ozan123:Ozan1907@firstcluster.ajs3n.mongodb.net/test?retryWrites=true&w=majority';

// Connect to Mongo
mongoose.connect(conn1, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// CSS
app.use(express.static(__dirname + '/public'));

// Bodyparser
app.use(express.urlencoded({extended: false}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/files', require('./routes/file'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port 5000'));