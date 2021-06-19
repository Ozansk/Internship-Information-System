const express = require("express");
const verifyController = require("../controllers/verify");
const pageController = require("../controllers/page");
const updateController = require("../controllers/updater");
const selectController = require("../controllers/select");
const addingController = require("../controllers/adding");
const fileController = require("../controllers/file_operations");
const fileupload = require('express-fileupload');
const router = express.Router();


router.use(fileupload());


router.get('/', (req, res) => {
    res.render('index');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

//---------------Personal Pages

router.get('/studentpage', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { pageController.studentpage(req, res) }
})

router.get('/teacherpage', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { pageController.teacherpage(req, res) }
})

router.get('/adminpage', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { pageController.adminpage(req, res) }
})

//---------------Adding Something

router.get('/addinternship', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { res.status(200).render('addinfo/addinternship') }
})

router.get('/adduser', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { res.status(200).render('addinfo/adduser') }
})

//---------------New

router.get('/holidayselector', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { res.status(200).render('calendar/holidayselector') }
})

router.get('/internshiprange', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { res.status(200).render('calendar/internshiprange') }
})

router.get('/internshipselect', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { selectController.internship(req, res) }
})

//---------------Update

router.post('/confirmupdate', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { updateController.confirmationpage(req, res) }
})

router.post('/changetype', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { updateController.changetype(req, res) }
})

router.post('/updaterecord', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { updateController.updaterecord(req, res) }
})

router.post('/updatetype', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { updateController.updatetype(req, res) }
})

router.post('/select', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { selectController.select(req, res) }
})

router.post('/adduser', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { addingController.addNewUser(req, res) }
})

router.post('/file', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { selectController.pdf(req, res) }
})

router.post('/excel', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { selectController.excel(req, res) }
})

router.post('/search', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { addingController.search(req, res) }
})

router.post('/change_password', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { updateController.change_password(req, res) }
})

router.post('/holidayselector', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { selectController.holidays(req, res) }
})

/*router.post('/select_files', (req, res) => {
    //if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    //else { fileController.student_files(req, res) }
})*/

module.exports = router;

//Post ve Get methodlar