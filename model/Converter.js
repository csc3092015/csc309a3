var UserDAO = require('./dao/UserDAO.js');
var PostDAO = require('./dao/PostDAO.js');
var MutualAgreementDAO = require('./dao/MutualAgreementDAO.js');
var ImageDAO = require('./dao/ImageDAO.js');
var UserBO = require('./../control/businessObject/UserBO.js');
var PostBO = require('./../control/businessObject/PostBO.js');
var MutualAgreementBO = require('./../control/businessObject/MutualAgreementBO.js');
var ImageBO = require('./../control/businessObject/ImageBO.js');
// see http://docs.mongodb.org/manual/reference/object-id/
var ObjectId = require('mongoose').Types.ObjectId;

/************************ Id *************************/
var generateBOId = function(){
	return ObjectId().valueOf();
};

var convertFromDAOIdToBOId =  function(daoId){
	return daoId.valueOf();
};

var convertFromDAOIdArrayToBOIdArray = function(daoIdArray){
	var boIdArray = [];
	for(var i = 0; i < daoIdArray.length; i++){
		boIdArray.push(convertFromDAOIdToBOId(daoIdArray[i]));
	}
	return boIdArray;
};

var convertFromBOIdToDaoId = function(boId){
	return ObjectId(boId);
};

var convertFromBOIdArrayToDaoIdArray = function(boIdArray){
	var daoIdArray = [];
	for(var i = 0; i < boIdArray.length; i++){
		daoIdArray.push(convertFromBOIdToDaoId(boIdArray[i]));
	}
	return daoIdArray;
};
/************************ User *************************/
var convertFromUserBOtoUserDAO = function(userBO){
	if(userBO === null){
		return null;
	}
	var userDAO = UserDAO.create(userBO.getUserId(), userBO.getPassword(), 
		userBO.getFacebookId(), userBO.getName(), userBO.getUserIdType()
		/*, 
		userBO.getCircleIdArray(), userBO.getMutualAgreementIdArrayAreOngoing(), 
		userBO.getReviewIdArrayAreOngoing(), userBO.getPostIdArrayNotExpired(), 
		userBO.getPostIdArrayExpired()*/);
	if(userBO.getPostIdArray()){
		userDAO.postIdArray.push.apply(userDAO.postIdArray, convertFromBOIdArrayToDaoIdArray(userBO.getPostIdArray()));
	}
	if(userBO.getImageId()){
		userDAO.imageId = userBO.getImageId();
	}
	return userDAO;
};

var convertFromUserDAOtoUserBO = function(userDAO){
	if(userDAO === null){
		return null;
	}
	var userBO = new UserBO(userDAO._id, userDAO._password, 
		userDAO._facebookId, userDAO._name, userDAO._userIdType,
		userDAO._rating
		/*, userDAO._circleIdArray, 
		userDAO._mutualAgreementIdArrayAreOngoing,
		userDAO._reviewIdArrayAreOngoing, userDAO._postIdArrayNotExpired,
		userDAO._postIdArrayExpired*/);
	if(userDAO.postIdArray){
		userBO.setPostIdArray(convertFromDAOIdArrayToBOIdArray(userDAO.postIdArray));	
	}
	if(userDAO.imageId){
		userBO.setImageId(userDAO.imageId);
	}
	return userBO;
};

/************************ Post *************************/
var convertFromPostBOtoPostDAO = function(postBO){
	if(postBO === null){
		return null;
	}
	var postDAO = PostDAO.create(convertFromBOIdToDaoId(postBO.getPostId()), postBO.getTitle(), postBO.getKeywordsArray(), postBO.getDescription(), postBO.getAuthorId(), postBO.getByWho(), postBO.getIsPurchased(), postBO.getIsExpired(), postBO.getCreatedAt());
	return postDAO;
};

var convertFromPostDAOtoPostBO = function(postDAO){
	if(postDAO === null){
		return null;
	}
	var postBO = new PostBO(convertFromDAOIdToBOId(postDAO._id), postDAO.title, postDAO.keywordsArray, postDAO.description, postDAO.authorId, postDAO.byWho, postDAO.isPurchased, postDAO.isExpired, postDAO.createdAt);
	return postBO;
};

var convertFromPostBOArraytoPostDAOArray = function(postBOArray){
	var postDAOArray = [];
	for (var i = 0; i < postBOArray.length; i++) {
		postDAOArray.push(convertFromPostBOtoPostDAO(postBOArray[i]));
	};
	return postDAOArray;
};

var convertFromPostDAOArraytoPostBOArray = function(postDAOArray){
	var postBOArray = [];
	for (var i = 0; i < postDAOArray.length; i++) {
		postBOArray.push(convertFromPostDAOtoPostBO(postDAOArray[i]));
	};
	return postBOArray;
};

/************************ MutualAgreement *************************/
var convertFromMutualAgreementDAOtoMutualAgreementBO = function(mutualAgreementDAO){
	if(mutualAgreementDAO === null){
		return null;
	}
	var mutualAgreementBO = new MutualAgreementBO(convertFromDAOIdToBOId(mutualAgreementDAO._id), mutualAgreementDAO.providerId, mutualAgreementDAO.consumerId, mutualAgreementDAO.description, mutualAgreementDAO.postId,
	mutualAgreementDAO.providerConsent, mutualAgreementDAO.consumerConsent, mutualAgreementDAO.isFinalized, mutualAgreementDAO.isLocked, mutualAgreementDAO.finishAt);
	return mutualAgreementBO;
};

var convertFromMutualAgreementBOtoMutualAgreementDAO = function(mutualAgreementBO){
	if(mutualAgreementBO === null){
		return null;
	}
	var mutualAgreementDAO = MutualAgreementDAO.create(convertFromBOIdToDaoId(mutualAgreementBO.getMutualAgreementId()), mutualAgreementBO.getProviderId(), mutualAgreementBO.getConsumerId(), mutualAgreementBO.getDescription(), mutualAgreementBO.getPostId(), mutualAgreementBO.getProviderConsent(), mutualAgreementBO.getConsumerConsent(), mutualAgreementBO.getIsFinalized(), mutualAgreementBO.getIsLocked(), mutualAgreementBO.getFinishAt());
	return mutualAgreementDAO;
};

/************************ Image *************************/
var convertFromImageDAOtoImageBO = function(imageDAO){
	if(imageDAO === null){
		return null;
	}
	var imageBO = new ImageBO(convertFromDAOIdToBOId(imageDAO._id), imageDAO.name, imageDAO.data, imageDAO.contentType);
	return imageBO;
};

var convertFromImageBOtoImageDAO = function(imageBO){
	if(imageBO === null){
		return null;
	}
	var imageDAO = ImageDAO.create(convertFromBOIdToDaoId(imageBO.getImageId()), imageBO.getImageName(), imageDAO.getImageData(), imageDAO.getImageType());
	return imageDAO;
};


/************************ Id *************************/
module.exports.generateBOId = generateBOId;
module.exports.convertFromDAOIdToBOId = convertFromDAOIdToBOId;
module.exports.convertFromDAOIdArrayToBOIdArray = convertFromDAOIdArrayToBOIdArray;
module.exports.convertFromBOIdToDaoId = convertFromBOIdToDaoId;
module.exports.convertFromBOIdArrayToDaoIdArray = convertFromBOIdArrayToDaoIdArray;

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
