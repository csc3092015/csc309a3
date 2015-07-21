var mongoose = require('mongoose');
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
	});
};

//since find by id is asyn call, we can't return a value, we must use call back
userDAOSchema.statics.validate = function(userId, password, callback){
	this.findById(userId, function(err, userDAO){
		var v;
		if(userDAO){
			v = (password === userDAO.password);
		} else {
			v = false;
		}
		callback(err, v);
	});
}

//the line below has to be called after we define the methods
var UserDAO = mongoose.model("UserDAO", userDAOSchema);


// UserDAO.validate('jiecao.wang@gmail.com', '1234', function(err, v){console.log(v)});

module.exports = UserDAO;