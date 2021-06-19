const express = require("express");
const authController = require("../controllers/authorize");
//const pageController = require("../controllers/page");
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;

//Bu dosya form autohrization işlemlerini ilişkilendirir