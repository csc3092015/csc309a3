var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');
// var database = require('./../database.js');
// database.connect();

/************************ Table Schema *************************/
var postDAOSchema = new mongoose.Schema({
	title: {type: String, required: true},
	keywordsArray : {type: Array, required: true },
	description : {type: String, required: true},
	authorId : {type: String, required: true}
	//expiryDate : {type: int, required: true},
	//commentIdArray : {type: Array<String>, required: true},
	//ongoingMutualAgreementIdArray : {type: Array<String>, required: true},
	//pictureIdArray : {type: Array<String>, required: true},
	//googlePlaceId : {type: Array<String}, required: true},
	//creationDate : {type: String, required: true},
	//rating : {type: float, required: true},
	/*totalNumReviews : {type: int, required: true},*/ 
	}, {collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.POST, _id: true});

/************************ Static Methods *************************/
postDAOSchema.statics.create = function(title, keywordsArray, description, authorId){
	return new PostDAO({
		title: title,
		keywordsArray: keywordsArray,
		description: description,
		authorId: authorId
		//expiryDate: expiryDate,
		//ongoingMutualAgreementIdArray: ongoingMutualAgreementIdArray,
		//pictureIdArray: pictureIdArray,
		//googlePlaceId: googlePlaceId,
		//creationDate: creationDate,
		//rating: rating,
		//totalNumReviews: totalNumReviews
	});
};

/************************ Instance Methods *************************/
/*
	Mongoose provide instance methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
*/

//the line below has to be called after we define the methods
var PostDAO = mongoose.model("PostDAO", postDAOSchema);

module.exports = PostDAO;
