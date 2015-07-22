var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');
// var database = require('./../database.js');
// database.connect();

var postDAOSchema = new mongoose.Schema({
	title: {type: String, required: true},
	keywordsArray : {type: Array<String>, required: true },
	description : {type: String, required: true},
	authorId : {type: String, required: true},
	expiryDate : {type: int, required: true},
	commentIdArray : {type: Array<String>, required: true},
	ongoingMutualAgreementIdArray : {type: Array<String>, required: true},
	pictureIdArray : {type: Array<String>, required: true},
	googlePlaceId : {type: Array<String}, required: true},
	creationDate : {type: String, required: true},
	rating : {type: float, required: true},
	postType: {type: float, required: true}
	totalNumReviews : {type: int, required: true}, {collection: GLOBAL_CONSTANTS.TABLE_NAME.POST, _id: true});

postDAOSchema.statics.create = function(title, keywordsArray, description, authorId, expiryDate, ongoingMutualAgreementIdArray, pictureIdArray, googlePlaceId, creationDate, rating, totalNumReviews){
	return new PostDAO({
		title: title,
		keywordsArray: keywordsArray,
		description: description,
		authorId: authorId,
		expiryDate: expiryDate,
		ongoingMutualAgreementIdArray: ongoingMutualAgreementIdArray,
		pictureIdArray: pictureIdArray,
		googlePlaceId: googlePlaceId,
		creationDate: creationDate,
		rating: rating,
		totalNumReviews: totalNumReviews
	});
};

postDAOSchema.statics.findPostByKeyword = function(keyword, type, callback){
	this.find({keyword: currentKeyword, postType: type}, function(err, postDAO){
		callback(err, postDAO);
	});
}

postDAOSchema.statics.findPostByKeywordArray = function(keywordArray, type){
	var postDAOsWithKeywords = [];
	function callback = function(err, postDAO){
		if(!err){
			postDAOsWithKeywords.push(postDAO);
		}
	}
	for(i=0;i<keywordArray.length;i++){
		this.findPostByKeyword(keywordArray[i], type, callback);
	}

	return postDAOsWithKeywords;
}

var PostDAO = mongoose.model("PostDAO", postDAOSchema);

module.exports = PostDAO;

