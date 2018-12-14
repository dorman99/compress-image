const express = require("express");
const upload_middlware = require("multer");
const sharp = require("sharp");
const app = express();
const S3 = require("aws-sdk");
const PORT = 3000 //port assign
const asycn = require("asycn");

app.post('/upload',upload_middlware("image"),function(req,res) {
    let imageBuff = req.file.image;
    async.parallel({
        small: function(callback) {
            sharp(imageBuff).metadata()
            .then(metaFile => {

            }).catch(err => { 
                callback(err);
            })
        },
        medium: function(callback) {
            sharp(imageBuff).metadata()
            .then(metaFile => {
                
            }).catch(err => { 
                callback(err);
            })
        },
        large: function(callback) {
            sharp(imageBuff).metadata()
            .then(metaFile => {
                
            }).catch(err => { 
                callback(err);
            })
        }
    },(err,files) => { //compressing file to new size
        if(err) {res.status(500).json(err)}
        else {
            //upload file to S3 here
        }
    })
})

app.listen(PORT,function() {
    console.log("Listening To Port ",PORT);
})

module.exports = app;