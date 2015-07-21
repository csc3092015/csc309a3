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

var PostDAO = mongoose.model("PostDAO", postDAOSchema);

module.exports = PostDAO;

