const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const assert = require('assert');
var {temp} = require('../config/passport');
var newUser = {};

//User model
const User = require('../models/User');
const User_page = require('../models/User_page');
const company = require('../models/company');
const { mongo } = require('mongoose');

// URL

url = 'mongodb+srv://Ozan123:Ozan1907@firstcluster.ajs3n.mongodb.net/test?retryWrites=true&w=majority'

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Student Page
router.get('/studentpage', (req, res) => res.render('user_page'));

//Register Handle
router.post('/register', (req, res) => {
   const { name, email, password, password2 } = req.body;
   let errors = [];

   // Check required fields
   if(!name || !email || !password || !password2){
       errors.push({msg: 'Please fill in all fields'});
   }

   // Check passwords match
   if(password !== password2){
       errors.push({ msg: 'Passwords do not match.'});
   }

   if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
   }else{
       //Validation passed
        User.findOne({ email: email})
        .then(user => {
            if(user){
                //User exists
                errors.push({msg: 'Email is already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                    newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err,hash) => {
                        if(err) throw err;
                        //Set password to hashed
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                            .then(user =>{
                                req.flash('success_msg', 'You are now registered and can login');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }))
            }
        });
   }
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/studentpage',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});
router.post('/studentpage', (req, res)=>{
    const { email, company_name, start_date, finish_date, work_day } = req.body;
    let errors = [];

    if(!company_name || !start_date || !finish_date || !work_day){
        errors.push({msg: 'Please fill in all fields'});
    }

    if(errors.length > 0){
        res.render('user_page', {
            errors,
            company_name,
            start_date,
            finish_date,
            work_day
        });
    }else{
        company.findOne({ company_name: company_name })
        .then(user_page =>{
            if(user_page){
                errors.push({msg: 'This company name is already written'});
                res.render('user_page',{
                    errors,
                    company_name,
                    start_date,
                    finish_date,
                    work_day
                });
            }else{
                const all_companies = new company({
                    company_name,
                    start_date,
                    finish_date,
                    work_day
                });
                const user_page = new User_page({
                    email: newUser.email,
                    companies : all_companies
                });

            // mongo.connect(url, function(err, db) {
            //     assert.equal(null, err);
            //     var cursor = db.collection('user_pages').find(user_page.email = newUser.email)
            //         .then(user_page.companies.push(all_companies))
            //     if(!cursor){
            //         user_page.save();
            //     }
            // });
            user_page.save();
            all_companies.save()
                .then(user_page =>{
                    req.flash('success_msg', 'SAVED INTERNSHIP');
                    res.redirect('/files/uploadFile');
                })
                .catch(err => console.log(err));
            }
        });
    }
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;