var UserDAO = require('./dao/UserDAO');
var PostDAO = require('./dao/UserDAO');
var UserBO = require('./../control/businessObject/UserBO');
var PostBO = require('./../control/businessObject/PostBO');

var convertFromUserBOtoUserDAO = function(userBO){
	var userDAO = UserDAO.create(userBO._userId, userBO._password);
	return userDAO;
}

var convertFromUserDAOtoUserBO = function(userDAO){
	var userBO = new UserBO(userDAO._id, userDAO.password);
	return userBO;
}

var convertFromPostBOtoPostDAO = function(postBO){
	var postDAO = PostDAO.create(postBO._title, postBO._keywordsArray, postBO._description, postBO._authorId);
	return postDAO;
}

var convertFromPostDAOtoPostBO = function(postDAO){
	var postBO = new PostBO(postBO._title, postBO._keywordsArray, postBO._description, postBO._authorId);
	return postBO;
}

module.exports.convertFromUserBOtoUserDAO = convertFromUserBOtoUserDAO;
module.exports.convertFromUserDAOtoUserBO = convertFromUserDAOtoUserBO;
module.exports.convertFromPostBOtoPostDAO = convertFromPostBOtoPostDAO;
module.exports.convertFromPostDAOtoPostBO = convertFromPostDAOtoPostBO;