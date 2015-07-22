var mongoose = require('mongoose');
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
	});
};

//since find by id is asyn call, we can't return a value, we must use call back
userDAOSchema.statics.check = function(userId, password, callback){
	this.findById(userId, function(err, userDAO){
		if(err){
			console.log('Can\'t find user ' + userId + ' due to ' + err);
		} else {
			callback(password === userDAO.password);	
		}
	});
}

//the line below has to be called after we define the methods
var UserDAO = mongoose.model("UserDAO", userDAOSchema);





// var userDAO = {_id: 'jiecao.wang@gmail.com', password: "1234"};
// var userJiecao = new UserDAO(userDAO);
// userJiecao.save(function (err, userJiecao) {
//   if (err) return console.error(err);
//   console.log(userJiecao._id);
// });
UserDAO.check('jiecao.wang@gmail.com', '1234', function(v){console.log(v)});
// console.log(UserDAO.findById('jiecao.wang@gmail.com'));


module.exports = UserDAO;