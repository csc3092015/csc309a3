var UserDAO = require('./../../model/dao/UserDAO.js');
var Converter = require('./../../model/Converter.js');

/*******************************Dummy Constructor**************************************/ 

function UserBO (userId, password, facebookId, name, userIdType, rating/*,
	circleIdArray, mutualAgreementIdArrayAreOngoing, reviewIdArrayAreOngoing,
	postIdArrayNotExpired, postIdArrayExpired*/) {
	this._userId = userId;
	this._password = password;
	this._facebookId = facebookId;
	this._name = name;
	this._userIdType = userIdType;
	this._rating = rating;
	/*
	this._circleIdArray = circleIdArray;
	this._mutualAgreementIdArrayAreOngoing = mutualAgreementIdArrayAreOngoing;
	this._reviewIdArrayAreOngoing = reviewIdArrayAreOngoing;
	this._postIdArrayNotExpired = postIdArrayNotExpired;
	this._postIdArrayExpired = postIdArrayExpired;
	*/
}

/*******************************Static Method**************************************/

// find if user with userId exists in the database
// callback(err, valid);
// valid is a bool denoting whether userId already exists
UserBO.validateId = function (userId, callback) {
	UserDAO.findById(userId, function (err, user) {
		// in event of error, callback with error 
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
		// callback with error if there is an error
		if (err) {
			callback(err);
		} else {
			// initialize validUserBO to null
			// invalid combination will keep validUserBO as null
			var validUserBO = null;

			// if the userId and password combination is valid,
			// make validUserBO an equivalent UserBOBO object to the found UserDAO object
			if (password === user._password) {
				//validUserBO = Converter.convertFromUserDAOtoUserBO(user);
				validUserBO = new UserBO(user._id, user._password, user._facebookId,
					user._name, user._userIdType, user._rating);
			}

			// call back with error and validUserBO
			callback(err, validUserBO);
		}
	});
}

// validate the user based on their facebook id and associated email
// callback(err, validUserBO);
// validUserBO is null when no corresponding user is found
UserBO.validateFbId = function (facebookId, email, name, callback) {
	UserDAO.findOne( { '_facebookId' : facebookId }, function (err, user) {
		if (err) {
			return callback(err);
		}
		var validUserBO = null;

		if (user) {
			//validUserBO = Converter.convertFromUserDAOtoUserBO(user);
			validUserBO = new UserBO(user._id, user._password, user._facebookId,
					user._name, user._userIdType, user._rating);
		} 

		callback(err, validUserBO);
		
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

UserBO.prototype.getFacebookId = function(){
	return this._facebookId;
};

UserBO.prototype.getName = function(){
	return this._name;
};

UserBO.prototype.getUserIdType = function(){
	return this._userIdType;
};

UserBO.prototype.getCircleIdArray = function(){
	return this._circleIdArray;
};

UserBO.prototype.getMutualAgreementIdArrayAreOngoing = function(){
	return this._mutualAgreementIdArrayAreOngoing;
};

UserBO.prototype.getReviewIdArrayAreOngoing = function(){
	return this._reviewIdArrayAreOngoing;
};

UserBO.prototype.getPostIdArrayNotExpired = function(){
	return this._postIdArrayNotExpired;
};

UserBO.prototype.getPostIdArrayExpired = function(){
	return this._postIdArrayExpired;
};

/*********************************Setters****************************************/

// set the UserBO object's facebook id to facebookid
UserBO.prototype.setFbId = function (facebookId) {
	UserBO._facebookId = facebookId;
}

module.exports = UserBO;
