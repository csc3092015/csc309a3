var mongoose = require('mongoose');
<<<<<<< HEAD
var GLOBAL_CONSTANTS = require(__dirname + '/../../GLOBAL_CONSTANTS.js');
var database = require(__dirname + '/../database.js');

//the line below should be moved into control layer later,
// we only need to open connection once, and exit when server ends
database.connect();

/************************ Table Schema *************************/
function toLower (v) {
  return v.toLowerCase();
}

var userDAOSchema = new mongoose.Schema({
	_id : String,
	password : {type: String, required: true},
	userName : String,
	userIdType: String
}, { collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.USER, _id: false});

//Static methods, constructor
userDAOSchema.statics.create = function(userId, password, userName, userIdType){
	return new UserDAO({
		_id: userId,
		password: password,
		userName : userName,
		userIdType: userIdType
=======
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');
// var database = require('./../database.js');

//the line below should be moved into control layer later,
// we only need to open connection once, and exit when server ends
// database.connect();

/************************ Table Schema *************************/
var userDAOSchema = new mongoose.Schema({
	_id : String,
	password : {type: String, required: true}
}, { collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.USER, _id: false});

/************************ Static Methods *************************/
/*
	Mongoose provide static methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
		document.findByIdAndRemove(_id, funciton(err, document))
		document.findByIdAndUpdate(id, { $set: { password: 'new_pwd' }}, function (err, document))
*/
userDAOSchema.statics.create = function(userId, password){
	return new UserDAO({
		_id: userId,
		password: password
>>>>>>> 7443b3df389e311c418507ea6ba429a64c21866d
	});
};

//since find by id is asyn call, we can't return a value, we must use call back
<<<<<<< HEAD
userDAOSchema.statics.check = function(userId, password, callback){
	this.findById(userId, function(err, userDAO){
		if(err){
			console.log('Can\'t find user ' + userId + ' due to ' + err);
		} else {
			callback(password === userDAO.password);	
		}
=======
userDAOSchema.statics.validate = function(userId, password, callback){
	this.findById(userId, function(err, userDAO){
		var v;
		if(userDAO){
			v = (password === userDAO.password);
		} else {
			v = false;
		}
		callback(err, v);
>>>>>>> 7443b3df389e311c418507ea6ba429a64c21866d
	});
}

//the line below has to be called after we define the methods
var UserDAO = mongoose.model("UserDAO", userDAOSchema);


<<<<<<< HEAD



// var userDAO = {_id: 'jiecao.wang@gmail.com', password: "1234"};
// var userJiecao = new UserDAO(userDAO);
// userJiecao.save(function (err, userJiecao) {
//   if (err) return console.error(err);
//   console.log(userJiecao._id);
// });
UserDAO.check('jiecao.wang@gmail.com', '1234', function(v){console.log(v)});
// console.log(UserDAO.findById('jiecao.wang@gmail.com'));

=======
// UserDAO.validate('jiecao.wang@gmail.com', '1234', function(err, v){console.log(v)});
>>>>>>> 7443b3df389e311c418507ea6ba429a64c21866d

module.exports = UserDAO;