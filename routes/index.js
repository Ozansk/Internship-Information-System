const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/', (req, res)=> res.render('login'));

// After Login Student Page
router.get('/studentpage', (req, res)=> res.render('user_page'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
    name: req.user.name
}));

module.exports = router;