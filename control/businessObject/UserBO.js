var UserDAO = require('./../../model/dao/UserDAO.js');
var Converter = require('./../../model/Converter.js');

 /*******************************Dummy Constructor**************************************/ 
function UserBO (userId, password){
	this._userId = userId;
	this._password = password;
	//this._userName = userName;
	//this._userIdType = userIdType;
}

/*******************************Static Method**************************************/

// find if user with userId exists in the database
// callback(err, valid);
// valid is a bool denoting whether userId already exists
UserBO.validateId = function (userId, callback) {
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
// callback(err, validUserBO);
// validUserBO is null when combination is incorrect
// validUserBO is an equivalent UserBOBO object to the valid UserDAO found
UserBO.validateIdPw = function (userId, password, callback) {
	UserDAO.findById(userId, function (err, user) {
		if (err) {
			callback(err);
		} else {
			// initialize validUserBO to null
			// invalid combination will keep validUserBO as null
			var validUserBO = null;

			// if the userId and password combination is valid,
			// make validUserBO an equivalent UserBOBO object to the found UserDAO object
			if (password === user.password) {
				validUserBO = new UserBO(user._id, user.password);
			}

			// call back with error and validUserBO
			callback(err, validUserBO);
		}
	});
}

/*******************************Instance Method**************************************/

// insert user to the database
// callback(err);
UserBO.prototype.save = function (callback) {
	var newUserDAO = Converter.convertFromUserBOtoUserDAO(this);
	newUserDAO.save(function (err){
		callback(err);
	});
}

/*******************************Dummy Getters**************************************/
UserBO.prototype.getUserId = function(){
	return this._userId;
};

UserBO.prototype.getPassword = function(){
	return this._password;
};

// We also need setters for these fields, they are private!

module.exports = UserBO;
