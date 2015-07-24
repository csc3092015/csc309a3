var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');

/************************ Table Schema *************************/
var userDAOSchema = new mongoose.Schema({
	_id : { type: String, trim: true },
	password : {type: String, required: true}
}, { collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.TESTSANDRA, _id: false});

/************************ Static Methods *************************/
/*
	Mongoose provide static methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
		document.findByIdAndRemove(_id, funciton(err, document))
		document.findByIdAndUpdate(_id, { $set: { password: 'new_pwd' }}, function (err, document))
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

/************************ Instance Methods *************************/
/*
	Mongoose provide instance methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
*/

//the line below has to be called after we define the methods
var UserDAO = mongoose.model("UserDAO", userDAOSchema);

// UserDAO.validate('jiecao.wang@gmail.com', '1234', function(err, v){console.log(v)});

module.exports = UserDAO;