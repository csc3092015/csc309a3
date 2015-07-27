var UserDAO = require('./dao/UserDAO');
var PostDAO = require('./dao/PostDAO');
var UserBO = require('./../control/businessObject/UserBO');
var PostBO = require('./../control/businessObject/PostBO');

var convertFromUserBOtoUserDAO = function(userBO){
	var userDAO = UserDAO.create(userBO.getUserId(), userBO.getPassword(), 
		userBO.getFacebookId(), userBO.getName(), userBO.getUserIdType()/*, 
		userBO.getCircleIdArray(), userBO.getMutualAgreementIdArrayAreOngoing(), 
		userBO.getReviewIdArrayAreOngoing(), userBO.getPostIdArrayNotExpired(), 
		userBO.getPostIdArrayExpired()*/);
	return userDAO;
}

var convertFromUserDAOtoUserBO = function(userDAO){
	var userBO = new UserBO(userDAO._id, userDAO._password, 
		userDAO._facebookId, userDAO._name, userDAO._userIdType,
		userDAO._rating/*, userDAO._circleIdArray, 
		userDAO._mutualAgreementIdArrayAreOngoing,
		userDAO._reviewIdArrayAreOngoing, userDAO._postIdArrayNotExpired,
		userDAO._postIdArrayExpired*/);
	return userBO;
}

var convertFromPostBOtoPostDAO = function(postBO){
	var postDAO = PostDAO.create(postBO.getTitle(), postBO.getKeywordsArray(), postBO.getDescription(), postBO.getAuthorId(), postBO.getByWho(), postBO.getIsPurchased(), postBO.getIsExpired(), postBO.getgetCreatedAt());
	return postDAO;
}

var convertFromPostDAOtoPostBO = function(postDAO){
	var postBO = new PostBO(postDAO.title, postDAO.keywordsArray, postDAO.description, postDAO.authorId, postDAO.byWho, postDAO.isPurchased, postDAO.isExpired, postDAO.createdAt);
	return postBO;
}

module.exports.convertFromUserBOtoUserDAO = convertFromUserBOtoUserDAO;
module.exports.convertFromUserDAOtoUserBO = convertFromUserDAOtoUserBO;
module.exports.convertFromPostBOtoPostDAO = convertFromPostBOtoPostDAO;
module.exports.convertFromPostDAOtoPostBO = convertFromPostDAOtoPostBO;