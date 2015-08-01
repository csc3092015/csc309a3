var UserDAO = require('./dao/UserDAO');
var PostDAO = require('./dao/PostDAO');
var MutualAgreementDAO = require('./dao/MutualAgreementDAO');
var UserBO = require('./../control/businessObject/UserBO');
var PostBO = require('./../control/businessObject/PostBO');
var MutualAgreementBO = require('./../control/businessObject/MutualAgreementBO');
var ObjectId = require('mongoose').Types.ObjectId;


/************************ User *************************/
var convertFromUserBOtoUserDAO = function(userBO){
	if(userBO === null){
		return null;
	}
	var userDAO = UserDAO.create(userBO.getUserId(), userBO.getPassword(), 
		userBO.getFacebookId(), userBO.getName(), userBO.getUserIdType()/*, 
		userBO.getCircleIdArray(), userBO.getMutualAgreementIdArrayAreOngoing(), 
		userBO.getReviewIdArrayAreOngoing(), userBO.getPostIdArrayNotExpired(), 
		userBO.getPostIdArrayExpired()*/);
	return userDAO;
}

var convertFromUserDAOtoUserBO = function(userDAO){
	if(userDAO === null){
		return null;
	}
	var userBO = new UserBO(userDAO._id, userDAO._password, 
		userDAO._facebookId, userDAO._name, userDAO._userIdType,
		userDAO._rating/*, userDAO._circleIdArray, 
		userDAO._mutualAgreementIdArrayAreOngoing,
		userDAO._reviewIdArrayAreOngoing, userDAO._postIdArrayNotExpired,
		userDAO._postIdArrayExpired*/);
	return userBO;
}

/************************ Post *************************/
var convertFromPostBOtoPostDAO = function(postBO){
	if(postBO === null){
		return null;
	}
	var postDAO = PostDAO.create(ObjectId(postBO.getPostId()), postBO.getTitle(), postBO.getKeywordsArray(), postBO.getDescription(), postBO.getAuthorId(), postBO.getByWho(), postBO.getIsPurchased(), postBO.getIsExpired(), postBO.getCreatedAt());
	return postDAO;
}

var convertFromPostDAOtoPostBO = function(postDAO){
	if(postDAO === null){
		return null;
	}
	var postBO = new PostBO(postDAO._id.valueOf(), postDAO.title, postDAO.keywordsArray, postDAO.description, postDAO.authorId, postDAO.byWho, postDAO.isPurchased, postDAO.isExpired, postDAO.createdAt);
	return postBO;
}

var convertFromPostBOArraytoPostDAOArray = function(postBOArray){
	var postDAOArray = [];
	for (var i = 0; i < postBOArray.length; i++) {
		postDAOArray.push(convertFromPostBOtoPostDAO(postBOArray[i]));
	};
	return postDAOArray;
}

var convertFromPostDAOArraytoPostBOArray = function(postDAOArray){
	var postBOArray = [];
	for (var i = 0; i < postDAOArray.length; i++) {
		postBOArray.push(convertFromPostDAOtoPostBO(postDAOArray[i]));
	};
	return postBOArray;
}

/************************ MutualAgreement *************************/
var convertFromMutualAgreementDAOtoMutualAgreementBO = function(mutualAgreementDAO){
	if(mutualAgreementDAO === null){
		return null;
	}
	var mutualAgreementBO = new MutualAgreementBO(ObjectId(mutualAgreementDAO._id).valueOf(), mutualAgreementDAO.providerId, mutualAgreementDAO.consumerId, mutualAgreementDAO.description, mutualAgreementDAO.postId,
	mutualAgreementDAO.providerConsent, mutualAgreementDAO.consumerConsent, mutualAgreementDAO.isFinalized, mutualAgreementDAO.isLocked, mutualAgreementDAO.finishAt);
	return mutualAgreementBO;
}

var convertFromMutualAgreementBOtoMutualAgreementDAO = function(mutualAgreementBO){
	if(mutualAgreementBO === null){
		return null;
	}
	var mutualAgreementDAO = MutualAgreementDAO.create(ObjectId(mutualAgreementBO.getMutualAgreementId()), mutualAgreementBO.getProviderId(), mutualAgreementBO.getConsumerId(), mutualAgreementBO.getDescription(), mutualAgreementBO.getPostId(), mutualAgreementBO.getProviderConsent(), mutualAgreementBO.getConsumerConsent(), mutualAgreementBO.getIsFinalized(), mutualAgreementBO.getIsLocked(), mutualAgreementBO.getFinishAt());
	return mutualAgreementDAO;
}

/************************ User *************************/
module.exports.convertFromUserBOtoUserDAO = convertFromUserBOtoUserDAO;
module.exports.convertFromUserDAOtoUserBO = convertFromUserDAOtoUserBO;
/************************ Post *************************/
module.exports.convertFromPostBOtoPostDAO = convertFromPostBOtoPostDAO;
module.exports.convertFromPostDAOtoPostBO = convertFromPostDAOtoPostBO;
module.exports.convertFromPostBOArraytoPostDAOArray = convertFromPostBOArraytoPostDAOArray;
module.exports.convertFromPostDAOArraytoPostBOArray = convertFromPostDAOArraytoPostBOArray;
/************************ MutualAgreement *************************/
module.exports.convertFromMutualAgreementDAOtoMutualAgreementBO = convertFromMutualAgreementDAOtoMutualAgreementBO;
module.exports.convertFromMutualAgreementBOtoMutualAgreementDAO = convertFromMutualAgreementBOtoMutualAgreementDAO;