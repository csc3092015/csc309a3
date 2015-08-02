var UserDAO = require('./../../model/dao/UserDAO.js');
var Converter = require('./../../model/Converter.js');
var PostBO = require('./PostBO.js');

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

// Image constructor

function Image (name, data, contentType){
	this._name = name;
	this._data = data;
	this._contentType = contentType;
}

/*******************************Static Method**************************************/

// find if user with userId exists in the database
// callback(err, valid);
// valid is a bool denoting whether userId already exists
UserBO.validateId = function (userId, callback) {
	UserDAO.findById(userId, function (err, userDAO) {
		// in event of error, callback with error 
		if (err) {
			callback(err);
		} else {
			
			// valid is initialized as false to denote non existent user
			var valid = false;

			// if user exists, change valid to true
			if (userDAO) {
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
	UserDAO.findById(userId, function (err, userDAO) {
		// callback with error if there is an error
		if (err) {
			callback(err);
		} else {
			// initialize validUserBO to null
			// invalid combination will keep validUserBO as null
			var validUserBO = null;

			// if the userId and password combination is valid,
			// make validUserBO an equivalent UserBOBO object to the found UserDAO object
			if (password === userDAO.password) {
				//validUserBO = Converter.convertFromUserDAOtoUserBO(user);
				validUserBO = new UserBO(userDAO._id, userDAO._password, userDAO._facebookId,
					userDAO._name, userDAO._userIdType, userDAO._rating);
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
	UserDAO.findOne( { 'facebookId' : facebookId }, function (err, userDAO) {
		if (err) {
			return callback(err);
		}
		var validUserBO = null;

		if (userDAO) {
			//validUserBO = Converter.convertFromUserDAOtoUserBO(user);
			validUserBO = new UserBO(userDAO._id, userDAO._password, userDAO._facebookId,
					userDAO._name, userDAO._userIdType, userDAO._rating);
		} 

		callback(err, validUserBO);
		
	});
}

// callback is optional here
UserBO.findByIdAndUpdate = function(userId, updateDictionary, callback){
	UserDAO.findByIdAndUpdate(userId, updateDictionary, function(err, userDAO){
		var userBO = Converter.convertFromUserDAOtoUserBO(userDAO);
		if(callback){
			callback(err, userBO);	
		}
	});
};

// callback is optional here
UserBO.findById = function(userId, callback){
	UserDAO.findById(userId, function(err, userDAO){
		var userBO = Converter.convertFromUserDAOtoUserBO(userDAO);
		if(callback){
			callback(err, userBO);
		}
	});
};

UserBO.findAllPostBOsByUserId = function(userId, callback){
	// http://mongoosejs.com/docs/populate.html
	UserDAO
		.findOne({_id: userId})
		.populate('postIdArray')
		.exec(function(err, userDAO){
			// now userDAO.postIdArray is no longer a ref array
			// it is populated so it contains actual PostDAO objects
			var postBOArray = Converter.convertFromPostDAOArraytoPostBOArray(userDAO.postIdArray);
			callback(err, postBOArray);
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

// these methods are not being used and can't to be used, so comment out for now
// UserBO.prototype.getCircleIdArray = function(){
// 	return this._circleIdArray;
// };

// UserBO.prototype.getMutualAgreementIdArrayAreOngoing = function(){
// 	return this._mutualAgreementIdArrayAreOngoing;
// };

// UserBO.prototype.getReviewIdArrayAreOngoing = function(){
// 	return this._reviewIdArrayAreOngoing;
// };

UserBO.prototype.getPostIdArray = function(){
	return this._postIdArray;
};

UserBO.prototype.getImage = function(){
	return this._photo;
}

UserBO.prototype.getImageName = function(){
	return this._photo._name;
}

UserBO.prototype.getImageData = function(){
	return this._photo._data;
}

UserBO.prototype.getImageType = function(){
	return this._photo._contentType;
}

/*********************************Setters****************************************/

// set the UserBO object's facebook id to facebookid
UserBO.prototype.setFbId = function (facebookId) {
	// UserBO._facebookId = facebookId; (why u r making a static variable?)
	this._facebookId = facebookId;
}

UserBO.prototype.pushPostId = function(newPostId){
	if(this._postIdArray){
		this._postIdArray.push(newPostId);	
	} else {
		this._postIdArray = [newPostId];
	}
}

UserBO.prototype.setPostIdArray = function(newPostIdArray){
	this._postIdArray = newPostIdArray.slice();
}

UserBO.prototype.setImage = function(name, data, contentType){
	this._photo = new Image(name, data, contentType);
}

UserBO.prototype.setImageName = function(name){
	this._photo._name = name;
}

UserBO.prototype.setImageData = function(data){	
	this._photo._data = data;
}

UserBO.prototype.setImageType = function(contentType){
	this._photo._contentType = contentType;
}

module.exports = UserBO;
module.exports = Image;