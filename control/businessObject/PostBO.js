var PostDAO = require('./../../model/dao/PostDAO.js');
var util = require('./../util.js');
var Errors = require('./../Errors.js');
var PostEnum = require('./../Enum.js').PostEnum;

 /*******************************Dummy Constructor**************************************/ 
function PostBO (title, keywordsArray, description, authorId, byWho, createdAt){
	this._title = title;
	this._keywordsArray = keywordsArray;
	this._description = description;
	this._authorId = authorId;
	//this._expiryDate = expiryDate;
	//this._ongoingMutualAgreementIdArray = ongoingMutualAgreementIdArray;
	//this._pictureIdArray = pictureIdArray;
	//this._creationDate = TIMESTAMP...
	//this._googlePlaceId = googlePlaceId;
	//this._rating = rating;
	//this._totalNumReviews = totalNumReviews;
	this._byWho = byWho;
	this._isPurchased = PostEnum.isNotPurchased;
	this._isExpired = PostEnum.isNotExpired;
	this._createdAt = createdAt;
}

/*******************************Static Method**************************************/
PostBO.findPostsByKeywordsArray = function(keywordsArray, callback){
	PostDAO.findPostsByKeywordsArray(keywordsArray, callback);
}

/*******************************Instance Method**************************************/
PostBO.prototype.save = function(callback){
	var newPostDAO = PostDAO.create(this.getTitle(), this.getKeywordsArray(), this.getDescription(), this.getAuthorId(), this.getByWho(), 
		this.getIsPurchased(), this.getIsExpired(), this.getCreatedAt());
	newPostDAO.save(function(err){
		callback(err);
	});
}

/*******************************Dummy Getters**************************************/
PostBO.prototype.getTitle = function(){
	return this._title;
};

PostBO.prototype.getKeywordsArray = function(){
	return this._keywordsArray;
};

PostBO.prototype.getDescription = function(){
	return this._description;
};

PostBO.prototype.getAuthorId = function(){
	return this._authorId;
};

PostBO.prototype.getByWho = function(){
	return this._byWho;
};

PostBO.prototype.getIsPurchased = function(){
	return this._isPurchased;
};

PostBO.prototype.getIsExpired = function(){
	return this._isExpired;
};

PostBO.prototype.getCreatedAt = function(){
	return this._createdAt;
};
/*******************************Setters**************************************/
PostBO.prototype.setTitle = function(newTitle){
	if(util.validateEmptyAndSpaceString(newTitle)){
		this._title = newTitle;
	} else {
		throw new Errors.EmptyAndSpaceStringError('title');
	}
};

PostBO.prototype.setKeywordsArray = function(newKeywordsArray){
	this._keywordsArray = newKeywordsArray.splice();
};

PostBO.prototype.setDescription = function(newDescription){
	if(util.validateEmptyAndSpaceString(newDescription)){
		this._description = newDescription;
	} else {
		throw new Errors.EmptyAndSpaceStringError('description');
	}
};

PostBO.prototype.setAuthorId = function(newAuthorId){
	if(util.validateEmptyAndSpaceString(newAuthorId)){
		this._authorId = newAuthorId;
	} else {
		throw new Errors.EmptyAndSpaceStringError('authorId');
	}
};

PostBO.prototype.setByWho = function(newByWho){
	PostEnum.validate(newByWho);
	this._newByWho = PostEnum[newByWho];
};

PostBO.prototype.setIsPurchased = function(newIsPurchased){
	PostEnum.validate(newIsPurchased);
	this._isPurchased = PostEnum[newIsPurchased];
};

PostBO.prototype.setIsExpired = function(newIsExpired){
	PostEnum.validate(newIsExpired);
	this._isExpired = PostEnum[newIsExpired];
};

PostBO.prototype.setCreatedAt = function(newCreatedAt){
	this._createdAt = newCreatedAt;
};


module.exports = PostBO;