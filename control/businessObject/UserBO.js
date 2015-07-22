var userDAO = require('../../model/dao/UserDAO.js');
//var db = require('./../database.js');
//db.connect();

 /*******************************Dummy Constructor**************************************/ 
function User (userId, password, userName, userIdType){
	this._userId = userId;
	this._password = password;
	this._userName = userName;
	this._userIdType = userIdType;
}

/*******************************Static Method**************************************/

// find if user with userId exists in the database
// callback(err, v);
// v is a bool indicating whether it exists
User.checkExistingUser = function (userId, callback) {
	userDao.validate(userId, callback);
}

// validate user login by checking userId and password combination
// callback(err, v);
// v is a bool indicating whether user id and password combination is valid
User.validateUserLogin = function (userId, password, callback) {
	userDAO.validate(userId, password, callback);
}

/*******************************Instance Method**************************************/

// insert user to the database
// callback(err);
User.prototype.signUpUser = function (callback) {
	var newUser = userDAO.create(this.userId, this.password);
	newUser.storeUser(callback);
}

module.exports = User;