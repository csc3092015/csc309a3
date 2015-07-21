var express = require('express');
var path = require('path');
var app = express(); 
var UserDAO = require('./model/dao/UserDAO.js');
var database = require('./model/database.js');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	//we will put this into route.js once this is working
	response.sendFile(path.join(__dirname + '/index.html'));
});

// Should define a regex here so that we can send whenever asked for user collection
app.get('/user', function(request, response) {
  response.send('user_collection');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/', function(request, response){
	console.log(request.body);

	if (request.body.inputEmail && request.body.inputPassword){
		database.connect();
		var userId = request.body.inputEmail;
		var userPwd = request.body.inputPassword;
		// response.send('checking ' + userId + ' with pwd:' + userPwd);
		UserDAO.validate(userId, userPwd, 
			function(err, v){
				if (err){
					response.send(err);
				}
				else {
					if (v){
						response.send('yes, you are an exting user');
					} else {
						response.send('No, you dont exist');
					}
				}
			});
	} else {
		response.send('how to get form input');
	}
});