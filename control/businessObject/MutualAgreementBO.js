var MutualAgreementDAO = require('./../../model/dao/MutualAgreementDAO.js');
var Converter = require('./../../model/Converter.js');
var util = require('./../util.js');
var Errors = require('./../Errors.js');

/*******************************Dummy Constructor**************************************/ 
function MutualAgreementBO (mutualAgreementId, providerId, consumerId, description, postId,
	providerConsent, consumerConsent, isFinalized, isLocked, finishAt){
	// these ids are all strings!
	this._mutualAgreementId = mutualAgreementId;
	this._providerId = providerId;
	this._consumerId = consumerId;
	this._description = description;
	this._postId = postId;
	this._providerConsent = providerConsent;
	this._consumerConsent = consumerConsent;
	this._isFinalized = isFinalized;
	this._isLocked = isLocked;
	this._finishAt = finishAt;
}

/*******************************Static Method**************************************/

MutualAgreementBO.findById = function(mutualAgreementId, callback){
	MutualAgreementDAO.findById(Converter.convertFromBOIdToDaoId(mutualAgreementId), function(err, MutualAgreementDAO){
		var mutualAgreementBO = Converter.convertFromMutualAgreementDAOtoMutualAgreementBO(MutualAgreementDAO);
		callback(err, mutualAgreementBO);
	});
};

MutualAgreementBO.findByPostId = function(postId, callback){
	var dict = { 'postId' : Converter.convertFromBOIdToDaoId(postId) };
	MutualAgreementDAO.findOne(dict, function(err, MutualAgreementDAO){
		var mutualAgreementBO = Converter.convertFromMutualAgreementDAOtoMutualAgreementBO(MutualAgreementDAO);
		callback(err, mutualAgreementBO);
	});
}

// updateDictionary looks like {description: "new description", isLocked : true, postId: ObjectId(this.getPostId())}
// because really these fields are referring to the fields in the DAO
MutualAgreementBO.findByIdAndUpdate = function(mutualAgreementId, updateDictionary, callback){
	MutualAgreementDAO.findByIdAndUpdate(Converter.convertFromBOIdToDaoId(mutualAgreementId), updateDictionary, function(err, MutualAgreementDAO){
		var mutualAgreementBO = Converter.convertFromMutualAgreementDAOtoMutualAgreementBO(MutualAgreementDAO);
		callback(err, mutualAgreementBO);
	});
};

//Im not sure about this anonymous call back function, I do not know if it will return the removed object
MutualAgreementBO.findByIdAndRemove = function(mutualAgreementId,callback){
	MutualAgreementDAO.findByIdAndRemove(Converter.convertFromBOIdToDaoId(mutualAgreementId), function(err, MutualAgreementDAO){
		var mutualAgreementBO = Converter.convertFromMutualAgreementDAOtoMutualAgreementBO(MutualAgreementDAO);
		callback(err, mutualAgreementBO);
	});
};

/*******************************Instance Method**************************************/
MutualAgreementBO.prototype.save = function(callback){
	var mutualAgreementDAO = Converter.convertFromMutualAgreementBOtoMutualAgreementDAO(this);
	mutualAgreementDAO.save(function(err){
		callback(err);
	});
}

/*******************************Dummy Getters**************************************/
MutualAgreementBO.prototype.getMutualAgreementId = function(){
	return this._mutualAgreementId;
};

MutualAgreementBO.prototype.getProviderId = function(){
	return this._providerId;
};

MutualAgreementBO.prototype.getConsumerId = function(){
	return this._consumerId;
};

MutualAgreementBO.prototype.getDescription = function(){
	return this._description;
};

MutualAgreementBO.prototype.getPostId = function(){
	return this._postId;
};

MutualAgreementBO.prototype.getProviderConsent = function(){
	return this._providerConsent;
};

MutualAgreementBO.prototype.getConsumerConsent = function(){
	return this._consumerConsent;
};

MutualAgreementBO.prototype.getIsFinalized = function(){
	return this._isFinalized;
};

MutualAgreementBO.prototype.getIsLocked = function(){
	return this._isLocked;
};

MutualAgreementBO.prototype.getFinishAt = function(){
	return this._finishAt;
};
/*******************************Setters**************************************/

MutualAgreementBO.prototype.setMutualAgreementId = function(newMutualAgreementId){
	this._mutualAgreementId = newMutualAgreementId;
};

MutualAgreementBO.prototype.setProviderId = function(newProviderId){
	this._providerId = newProviderId;
};

MutualAgreementBO.prototype.setConsumerId = function(newConsumerId){
	this._consumerId = newConsumerId;
};

MutualAgreementBO.prototype.setDescription = function(newDescription){
	this._description = newDescription;
};

MutualAgreementBO.prototype.setPostId = function(newPostId){
	this._postId = newPostId;
};

MutualAgreementBO.prototype.setProviderConsent = function(newProviderConsent){
	this._providerConsent = newProviderConsent;
};

MutualAgreementBO.prototype.setConsumerConsent = function(newConsumerConsent){
	this._consumerConsent = newConsumerConsent;
};

MutualAgreementBO.prototype.setIsFinalized = function(newIsFinalized){
	this._isFinalized = newIsFinalized;
};

MutualAgreementBO.prototype.setIsLocked = function(newIsLocked){
	this._isLocked = newIsLocked;
};

MutualAgreementBO.prototype.setFinishAt = function(newFinishAt){
	this._finishAt = FinishAt;
};

module.exports = MutualAgreementBO;