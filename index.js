// set up
var express = require('express');
var path = require('path');
var app = express(); 
app.set('port', (process.env.PORT || 5000));

var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParse = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

// get configurations
require('./config/passport')(passport);

// set up middleware
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

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

