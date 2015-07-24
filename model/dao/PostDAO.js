var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');

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
	//expiryDate : {type: int, required: true},
	//commentIdArray : {type: Array<String>, required: true},
	//ongoingMutualAgreementIdArray : {type: Array<String>, required: true},
	//pictureIdArray : {type: Array<String>, required: true},
	//googlePlaceId : {type: Array<String}, required: true},
	creationDate : {
		type: Date, 
		default: Date.now
	},
	//rating : {type: float, required: true},
	/*totalNumReviews : {type: int, required: true},*/ 
	}, {collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.POST});

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
		// creationDate: creationDate, (This is not needed, cuz creationDate is self defined)  
		//rating: rating,
		//totalNumReviews: totalNumReviews
	});
};

postDAOSchema.statics.findPostsByKeywordsArray = function(keywordsArray, callback){
	this.find({keywordsArray: {$in: keywordsArray}}, function(err, docs){
		callback(err, docs);
	}).limit(10);
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
