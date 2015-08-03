var mongoose = require('mongoose');
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');
var util = require('./../../control/util.js');

/************************ Table Schema *************************/
var postDAOSchema = new mongoose.Schema({
	_id : {
		type: mongoose.Schema.Types.ObjectId, 
		trim: true 
	},
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
	//ongoingMutualAgreementIdArray : {type: Array<String>, required: true},
	//pictureIdArray : {type: Array<String>, required: true},
	//googlePlaceId : {type: Array<String}, required: true},
	commentIdArray : [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentDAO'}],
	createdAt : {
		type: Number, 
		required: true
	},
	//rating : {type: float, required: true},
	/*totalNumReviews : {type: int, required: true},*/ 
	}, {collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.POST, _id: false});

/************************ Compound Index *************************/
// 1 here just means sort by ascending
postDAOSchema.index({ byWho: 1, isPurchased: 1, isExpired: 1});

/************************ Static Methods *************************/
postDAOSchema.statics.create = function(postId, title, keywordsArray, description, authorId, byWho, isPurchased, isExpired, createdAt){
	return new PostDAO({
		_id: postId,
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

//The parameter keywordsArray is the input from the req, the criteriaDictionary.keywordsArray is the field name in Mongoose model
postDAOSchema.statics.findPostsByKeywordsArrayAndOption = function(keywordsArray, optionalDictionary, callback){
	var multiQueryExpressionArray = [];
	multiQueryExpressionArray.push({'keywordsArray': {$in: keywordsArray}});
	var option;
	for(option in optionalDictionary){
		var queryExpression = {};
		queryExpression[option] = {$eq: optionalDictionary[option]};
		multiQueryExpressionArray.push(queryExpression);
	}
	//http://docs.mongodb.org/manual/reference/operator/query/and/
	// and here just force that all the expression has to be evaluated to be true
	var criteriaDictionary = {$and: multiQueryExpressionArray};
	this.findPosts(criteriaDictionary, GLOBAL_CONSTANTS.MODEL.POST_DAO.SEARCH_RESULT_NUMBER, callback);
};

postDAOSchema.statics.findPosts = function(criteriaDictionary, resultSizeUpperBound, callback){
	this.find(criteriaDictionary, function(err, postDAOArray){
		callback(err, postDAOArray);
	}).limit(resultSizeUpperBound);
};

postDAOSchema.statics.findPostsWithPopulatedFields = function(fieldsString, criteriaDictionary, resultSizeUpperBound, callback){
	this
		.find(criteriaDictionary)
		.limit(resultSizeUpperBound)
		.populate(fieldsString)
		.exec(function(err, postDAOArray){
			callback(err, postDAOArray);
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
