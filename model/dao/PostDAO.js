var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');
var util = require('./../../control/util.js');

/************************ Table Schema *************************/
var postDAOSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: true
	},
	keywordsArray : {type: Array, required: true },
	description : {
		type: String, 
		trim: true,
		required: true
	},
	authorId : {
		type: String,
		ref: "UserDAO",
		trim: true,
		required: true
	},
	// The following three are for compound indexs, so I have to make sure they are numbers
	byWho : {
		type: Number, // see util.Enum constructor
		required: true
	},
	isPurchased : {
		type: Number,
		required: true
	},
	isExpired : {
		type: Number,
		required: true
	},
	//expiryDate : {type: int, required: true},
	//commentIdArray : {type: Array<String>, required: true},
	//ongoingMutualAgreementIdArray : {type: Array<String>, required: true},
	//pictureIdArray : {type: Array<String>, required: true},
	//googlePlaceId : {type: Array<String}, required: true},
	createdAt : {
		type: Number, 
		required: true
	},
	//rating : {type: float, required: true},
	/*totalNumReviews : {type: int, required: true},*/ 
	}, {collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.POST});

/************************ Static Methods *************************/
postDAOSchema.statics.create = function(title, keywordsArray, description, authorId, byWho, isPurchased, isExpired, createdAt){
	return new PostDAO({
		title: title,
		keywordsArray: keywordsArray,
		description: description,
		authorId: authorId,
		byWho: byWho,
		isPurchased: isPurchased, 
		isExpired: isExpired,
		//expiryDate: expiryDate,
		//ongoingMutualAgreementIdArray: ongoingMutualAgreementIdArray,
		//pictureIdArray: pictureIdArray,
		//googlePlaceId: googlePlaceId,
		createdAt: createdAt
		//rating: rating,
		//totalNumReviews: totalNumReviews
	});
};

postDAOSchema.statics.findPostsByKeywordsArray = function(keywordsArray, callback){
	this.find({keywordsArray: {$in: keywordsArray}}, function(err, docs){
		callback(err, docs);
	}).limit(GLOBAL_CONSTANTS.MODEL.POST_DAO.SEARCH_RESULT_NUMBER);
}

/************************ Instance Methods *************************/
/*
	Mongoose provide instance methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
*/

//the line below has to be called after we define the methods
var PostDAO = mongoose.model("PostDAO", postDAOSchema);

module.exports = PostDAO;
