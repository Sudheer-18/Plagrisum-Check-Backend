require('dotenv').config(); 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors= require("cors")
const bodypasrer = require("body-parser")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer");
 const roters = require("./routes/plagarisum");

 
var app = express();

mongoose.connect("mongodb+srv://gaduharsha72:fe5Uhd3yXymJI2fK@cluster0.npekr7c.mongodb.net/submissions?retryWrites=true&w=majority&appName=Cluster0/submissions")
.then(result => {
  console.log("Connected to mongodb")
})
.catch(err => {
  console.log(err)
})


const handlePort = () =>{
  console.log('Port working on http://localhost:5001')
}
app.use(cors())  
app.use(bodypasrer.json());

app.use("/submissions",roters);

app.listen(5001, handlePort);   

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
