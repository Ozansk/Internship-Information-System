const express = require("express");
const verifyController = require("../controllers/verify");
const pageController = require("../controllers/page");
const updateController = require("../controllers/updater");
const selectController = require("../controllers/select");
const addingController = require("../controllers/adding");
const router = express.Router();

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
    else { res.status(200).render('calendar/internshipselect') }
})

router.get('/file', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { res.status(200).render('files_view/file') }
})

//---------------Update

router.post('/confirmupdate', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { updateController.confirmationpage(req, res) }
})

router.post('/updaterecord', (req, res) => {
    if (verifyController.verify(req, res) == 403) { res.status(403).send() }
    else { updateController.updaterecord(req, res) }
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
    else { selectController.pdf(req,res) }
})



module.exports = router;

//Post ve Get methodlar