// set up
var express = require('express');
var path = require('path');
var app = express(); 
app.set('port', (process.env.PORT || 5000));
var mongoose = require('mongoose');

var passport = require('passport');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var database = require('./model/database.js');

//app.use(favicon(__dirname + '/public/favicon.ico'));

// get configurations
database.connect();
require('./config/passport')(passport);
var sessionOpts = {
  saveUninitialized: true, // saved new sessions
  resave: true, // do not automatically write to the session store
  //store: sessionStore,
  secret: 'csc309a3'
  //cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires, this line doesn't work, fix it later
}

// set up middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set up ejs templating
// views is directory for all template files
app.set('views', __dirname + '/views/pages');
app.set('view engine', 'ejs');

//app.get('/', function (request, response) {
//  response.sendFile(path.join(__dirname + '/index.html'));
//});

// import routes
require('./app/routes.js')(app, passport);

// Should define a regex here so that we can send whenever asked for user collection
app.get('/user', function (request, response) {
  response.send('user_collection');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
