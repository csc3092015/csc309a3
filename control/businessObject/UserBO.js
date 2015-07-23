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
// callback(err, valid);
// valid is a bool denoting whether userId already exists
User.validateId = function (userId, callback) {
	UserDAO.findById(userId, function (err, user) {
		if (err) {
			callback(err);
		} else {
			
			// valid is initialized as false to denote non existent user
			var valid = false;

			// if user exists, change valid to true
			if (user) {
				valid = true;
			}

			callback(err, valid);
		}
	});
}

// validate user login by checking userId and password combination
// callback(err, validUser);
// validUser is null when combination is incorrect
// validUser is an equivalent UserBO object to the valid UserDAO found
User.validateIdPw = function (userId, password, callback) {
	UserDAO.findById(userId, function (err, user) {
		if (err) {
			callback(err);
		} else {
			// initialize validUser to null
			// invalid combination will keep validUser as null
			var validUser = null;

			// if the userId and password combination is valid,
			// make validUser an equivalent UserBO object to the found UserDAO object
			if (password === user.password) {
				validUser = new User(user._id, user.password);
			}

			// call back with error and validUser
			callback(err, validUser);
		}
	});
}

/*******************************Instance Method**************************************/

// insert user to the database
// callback(err);
User.prototype.save = function (callback) {
	var newUser = UserDAO.create(this._userId, this._password);
	newUser.save(function (err){
		callback(err);
	});
}

module.exports = User;
