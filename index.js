/*
* 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
* in this JS file.
* */
const PORT = process.env.PORT || 8089;
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const ejs = require('ejs');
const flash = require('connect-flash');
var session = require('express-session');

const mysql = require('mysql');

// mongodb+srv://mysmarthome:mysmarthome@cluster0.rutul.mongodb.net/MySmartHome?retryWrites=true&w=majority

/*
* Loads routes file main.js in routes directory. The main.js determines which function
* will be called based on the HTTP request and URL.
*/
const mainRoute = require('./routes/main');

/*
* Creates an Express server - Express is a web application framework for creating web applications
* in Node JS.
*/
const app = express();
const http = require('http');
const server = http.createServer(app);


let dbUser = process.env.DB_USERNAME;
let dbPass = process.env.DB_PASSWORD;

// database connection
// var mongoDB = "mongodb://localhost:27017/mySmartHome";
// var mongoDB = "mongodb+srv://mysmart:ggekVnJ7Io3h5vNe@cluster0.rutul.mongodb.net/MySmartHome3?retryWrites=true&w=majority";
// mongoose
//   .connect(mongoDB, { useNewUrlParser: true,useUnifiedTopology:true })
//   .then(() => console.log("connected to dB.."))
//   .catch((err) => console.log("Error is : ", err));
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));


// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
// set up body parsing in express  to be able  to get parse JSON posts
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

// express-session middleware
app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true,
//   cookie:{secure:true}
}));
app.use(flash());

// Ejs Middleware
/*
* 1. Ejs is a front-end web templating engine that helps to create dynamic web pages using variables
* from Node JS.
*
* 2. Node JS will look at Ejs files under the views directory
*
* 3. 'defaultLayout' specifies the main.ejs file under views/layouts as the main template
*
* */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var main = require('./routes/main.js');


// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static('./public'));
app.use(express.static(__dirname + './public', { maxAge: '30 days' }));
app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/static'));


// This folder is used for admin side
app.use('/admin', express.static(__dirname + '/admin'));

require('dotenv').config();


app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Expose-Headers", "Content-Type,Authorization");
  next();
});

app.use(flash());

app.use((req,res,next)=>{
      res.locals.success = req.flash('success');
      res.locals.danger = req.flash('danger');
      res.locals.message = req.flash('message');
      next();
});

// Use Routes
/*
* Defines that any root URL with '/' that Node JS receives request from, for eg. http://localhost:5000/, will be handled by
* mainRoute which was defined earlier to point to routes/main.js
* */

app.use('/', main); // mainRoute is declared to point to routes/main.js

// This route maps the root URL to any path defined in main.js

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*
* Creates a unknown port 8089 for express server since we don't want our app to clash with well known
* ports such as 80 or 8080.
* */

//server.listen(8089);
server.listen(PORT, () => {
  console.log("Node server is running... :", PORT);
});
