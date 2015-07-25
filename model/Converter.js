var UserDAO = require('./dao/UserDAO');
var PostDAO = require('./dao/UserDAO');
var UserBO = require('./../control/businessObject/UserBO');
var PostBO = require('./../control/businessObject/PostBO');

var convertFromUserBOtoUserDAO = function(userBO){
	var userDAO = UserDAO.create(userBO.getUserId(), userBO.getPassword());
	return userDAO;
}

var convertFromUserDAOtoUserBO = function(userDAO){
	var userBO = new UserBO(userDAO.id, userDAO.password);
	return userBO;
}

var convertFromPostBOtoPostDAO = function(postBO){
	var postDAO = PostDAO.create(postBO.getTitle(), postBO.getKeywordsArray(), postBO.getDescription(), postBO.getAuthorId(), postBO.getByWho(), postBO.getIsPurchased(), postBO.getIsExpired(), postBO.getgetCreatedAt());
	return postDAO;
}

var convertFromPostDAOtoPostBO = function(postDAO){
	var postBO = new PostBO(postDAO.title, postDAO.keywordsArray, postDAO.description, postDAO.authorId, postDAO.byWho, postDAO.createdAt);
	 // set postDAO.isPurchased, postDAO.isExpired
	postBO.setIsPurchased(postDAO.isPurchased);
	postBO.setIsExpired(postDAO.isExpired);
	return postBO;
}

module.exports.convertFromUserBOtoUserDAO = convertFromUserBOtoUserDAO;
module.exports.convertFromUserDAOtoUserBO = convertFromUserDAOtoUserBO;
module.exports.convertFromPostBOtoPostDAO = convertFromPostBOtoPostDAO;
module.exports.convertFromPostDAOtoPostBO = convertFromPostDAOtoPostBO;