const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

//db = mongoose.db('test');



router.get('/uploadFile', (req,res) => res.render('files'));
router.get('/uploadmultiple', (req,res) => res.render('files'));
router.get('/uploadphoto', (req,res) => res.render('files'));

var storage = multer.diskStorage({
    destination: '../public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage
});

//configuring the upload file route
router.post('/uploadFile', upload.single('myFile'), (req,res,next) => {
    const file = req.file;
    if(!file){
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);
});

/*router.post("/uploadphoto", upload.single('myImage'),(req, res) => {
    var img = fs.readFileSync(req.file.path);

    var encode_image = img.toString('base64');

    var finalImg = {
        contentType: req.file.mimetype,
        path: req.file.path,
        image: new Buffer(encode_image, 'base64')
    };
    db.collection('files').insertOne(finalImg, (err, result) => {
        console.log(result);

        if(err) return console.log(err);

        res.contentType(finalImg.contentType);

        res.send(finalImg.image); 
    });
});*/

module.exports = router;