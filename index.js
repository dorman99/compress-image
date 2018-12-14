const express = require("express");
const multer = require("multer");
const upload_middlware = multer();
const sharp = require("sharp");
const app = express();
const Aws = require("aws-sdk");
const PORT = 3001 //port assign
const async = require("async");


const uploadToS3 = (files,callback) => {
    let s3Bucket = new Aws.S3({
        accessKeyId: "IAM-Acceskey",
        secretAccessKey: "IAM-SECRETKEY",
        params: {Bucket: "bucketName"},

    })
    s3Bucket.createBucket({ACL:"public-read"},function() {
        async.each(files,function(file,cb) {
            let params = {
                Key : file.name+".jpeg",
                Body: file.buffer
            }
            s3Bucket.upload(params,function(err,data) {
                if(err) cb(err);
                cb(null);
            })
        },err=> {
            if(err) callback(err);
            callback(null,"success");
        })
    })
} 

app.post('/upload',upload_middlware.single("image"),function(req,res) {
    let imageBuff = req.file.buffer;
    async.parallel({
        small: function(callback) {
            sharp(imageBuff).metadata()
            .then(metaFile => {
                if(metaFile.width > metaFile.height) {
                    sharp(imageBuff).jpeg({ //quality change
                        quality: 75
                    }).resize(240) //witdh == 800 , height == auto
                    .toBuffer((err,buffer)=> {
                        if(err)callback(err);
                        callback(null,{name:"small",buffer:buffer})
                    })
                    // .toFile('small.jpeg')
                    // .then(info => {
                    //     callback(null,info)
                    // })
                    // .catch(err => callback(err))
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
                    .toBuffer((err,buffer)=> {
                        if(err)callback(err);
                        callback(null,{name:"medium",buffer:buffer})
                    })
                    // .toFile('medium.jpeg')
                    // .then(info => {
                    //     callback(null,info)
                    // })
                    // .catch(err => callback(err))
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
                    .toBuffer((err,buffer)=> {
                        if(err)callback(err);
                        callback(null,{name:"large",buffer:buffer})
                    })
                    // .toFile('large.jpeg')
                    // .then(info => {
                    //     callback(null,info)
                    // })
                    // .catch(err => callback(err))
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
            uploadToS3(files,(err,result) => {
                if(err)res.status(500).json(err);
                res.status(200).json({
                    files
                })
            })
        }
    })
})

app.listen(PORT,function() {
    console.log("Listening To Port ",PORT);
})

module.exports = app;