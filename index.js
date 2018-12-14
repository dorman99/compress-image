const express = require("express");
const upload_middlware = require("multer");
const sharp = require("sharp");
const app = express();
const S3 = require("aws-sdk");
const PORT = 3000 //port assign
const asycn = require("asycn");
app.post('/upload',upload_middlware("image"),function(req,res) {

})

app.listen(PORT,function() {
    console.log("Listening To Port ",PORT);
})

module.exports = app;