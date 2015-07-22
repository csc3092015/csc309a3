<<<<<<< HEAD
 /*******************************Dummy Constructor**************************************/ function User (userId, password, userName, userIdType){
function User (userId, password, userName, userIdType){
	this._userId = userId;
	this._password = password;
	this._userName = userName;
	this._userIdType = userIdType;
}

module.exports = User;
=======
var UserDAO = require('./../../model/dao/UserDAO.js');
//var db = require('./../database.js');
//db.connect();

 /*******************************Dummy Constructor**************************************/ 
function User (userId, password){
	this._userId = userId;
	this._password = password;
	//this._userName = userName;
	//this._userIdType = userIdType;
}

/*******************************Static Method**************************************/

// find if user with userId exists in the database
// callback(err, v);
// v is a bool indicating whether it exists
User.validateId = function (userId, callback) {
	UserDAO.findById(userId, function (err, user) {
		if (err) {
			callback(err);
		} else {
			callback(err, user);
		}
	});
}

// validate user login by checking userId and password combination
// callback(err, v);
// v is a bool indicating whether user id and password combination is valid
User.validateIdPw = function (userId, password, callback) {
	UserDAO.findById(userId, function (err, user) {
		if (err) {
			callback(err);
		} else {
			var v = false;
			if (password === user.password) {
				v = true;
			}
			callback(err, v);
		}
	});
}

/*******************************Instance Method**************************************/

// insert user to the database
// callback(err);
User.prototype.save = function (callback) {
	var newUser = UserDAO.create(this.userId, this.password);
	newUser.save(err);
}

module.exports = User;

// testing
>>>>>>> 7443b3df389e311c418507ea6ba429a64c21866d
