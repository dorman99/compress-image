const express = require("express");
const multer = require("multer");
const upload_middlware = multer();
const sharp = require("sharp");
const app = express();
const S3 = require("aws-sdk");
const PORT = 3001 //port assign
const async = require("async");


app.post('/upload',upload_middlware.single("image"),function(req,res) {
    console.log(req.file)
    let imageBuff = req.file.buffer;
    async.parallel({
        small: function(callback) {
            sharp(imageBuff).metadata()
            .then(metaFile => {
                if(metaFile.width > metaFile.height) {
                    sharp(imageBuff).jpeg({ //quality change
                        quality: 75
                    }).resize(240) //witdh == 800 , height == auto
                    .toFile('small.jpeg')
                    .then(info => {
                        callback(null,info)
                    })
                    .catch(err => callback(err))
                }
                else if(metaFile.width == metaFile.height) {
                    sharp(imageBuff).jpeg({ //quality change
                        quality: 75
                    }).resize(240) //witdh == 240 , height == auto
                    .toFile('small.jpeg')
                    .then(info => {
                        callback(null,info)
                    })
                    .catch(err => callback(err))
                }
                else { // auto witdh
                    sharp(imageBuff).jpeg({
                        quality: 75
                    }).resize(null,300)
                    .toFile("small.jpeg")
                    .then(info => callback(null,info)).catch(err=>callback(err))
                }
            }).catch(err => { 
                callback(err);
            })
        },
        medium: function(callback) {
            sharp(imageBuff).metadata()
            .then(metaFile => {
                if(metaFile.width > metaFile.height) {
                    sharp(imageBuff).jpeg({ //quality change
                        quality: 75
                    }).resize(480) 
                    .toFile('medium.jpeg')
                    .then(info => {
                        callback(null,info)
                    })
                    .catch(err => callback(err))
                }
                else if(metaFile.width == metaFile.height) {
                    sharp(imageBuff).jpeg({ //quality change
                        quality: 75
                    }).resize(480)
                    .toFile('medium.jpeg')
                    .then(info => {
                        callback(null,info)
                    })
                    .catch(err => callback(err))
                }
                else { // auto width
                    sharp(imageBuff).jpeg({
                        quality: 75
                    }).resize(null,600)
                    .toFile("medium.jpeg")
                    .then(info => callback(null,info)).catch(err=>callback(err))
                }
            }).catch(err => { 
                callback(err);
            })
        },
        large: function(callback) {
            sharp(imageBuff).metadata()
            .then(metaFile => {
                if(metaFile.width > metaFile.height) {
                    sharp(imageBuff).jpeg({ //quality change
                        quality: 90
                    }).resize(800) //witdh == 800 , height == auto //pixel
                    .toFile('large.jpeg')
                    .then(info => {
                        callback(null,info)
                    })
                    .catch(err => callback(err))
                }
                else if(metaFile.width == metaFile.height) {
                    sharp(imageBuff).jpeg({ //quality change
                        quality: 75
                    }).resize(800)
                    .toFile('large.jpeg')
                    .then(info => {
                        callback(null,info)
                    })
                    .catch(err => callback(err))
                }
                else { // auto width
                    sharp(imageBuff).jpeg({
                        quality: 75
                    }).resize(null,800)
                    .toFile("large.jpeg")
                    .then(info => callback(null,info)).catch(err=>callback(err))
                }
            }).catch(err => { 
                callback(err);
            })
        }
    },(err,files) => { //compressing file to new size
        if(err) {res.status(500).json(err)}
        else {
            res.status(200).json({
                files
            })
        }
    })
})

app.listen(PORT,function() {
    console.log("Listening To Port ",PORT);
})

module.exports = app;