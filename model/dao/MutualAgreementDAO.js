var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');

/************************ Table Schema *************************/
var mutualAgreementDAOSchema = new Schema({
	_id : {
		type: Schema.Types.ObjectId, 
		trim: true 
	},
	providerId : {
		type: String,
		ref: "UserDAO",
		trim: true,
		required: true
	},
	consumerId : {
		type: String,
		ref: "UserDAO",
		trim: true,
		required: true
	},
	description : {
		type: String, 
		trim: true,
		required: true
	},
	postId : {
		type: Schema.Types.ObjectId,
		ref: "PostDAO",
		trim: true,
		required: true
	},
	providerConsent :{
		type: Boolean,
		required: true
	},
	consumerConsent :{
		type: Boolean,
		required: true
	},
	isFinalized : {
		type: Boolean,
		required: true
	},
	isLocked : {
		type: Boolean,
		required: true
	},
	finishAt : {
		type: Number,
		required: true
	}
}, { collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.MUTUAL_AGREEMENT, _id: false});

/************************ Static Methods *************************/
/*
	Mongoose provide static methods:
	http://mongoosejs.com/docs/documents.html
		document.findByIdAndRemove(_id, funciton(err, document))
		document.findByIdAndUpdate(_id, { $set: { password: 'new_pwd' }}, function (err, document))
*/

mutualAgreementDAOSchema.statics.create = function(mutualAgreementId, providerId, consumerId, description, postId,
	providerConsent, consumerConsent, isFinalized, isLocked, finishAt){
	return new MutualAgreementDAO({
		_id: mutualAgreementId,
		providerId : providerId,
		consumerId : consumerId,
		description : description,
		postId : postId,
		providerConsent : providerConsent,
		consumerConsent : consumerConsent,
		isFinalized: isFinalized,
		isLocked: isLocked,
		finishAt: finishAt
	});
};

/************************ Instance Methods *************************/
/*
	Mongoose provide instance methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
*/

//the line below has to be called after we define the methods
var MutualAgreementDAO = mongoose.model("MutualAgreementDAO", mutualAgreementDAOSchema);

module.exports = MutualAgreementDAO;
