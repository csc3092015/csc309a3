var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');

/************************ Table Schema *************************/
var userDAOSchema = new Schema({
	_id : { type: String, trim: true },
	_password : {type: String/*, required: true*/},
	_facebookId : { type: String },
	_name : { type: String, trim: true },
	_userIdType : { type: Number }, //0 for normal user, 1 for admin
	_rating : { type: Number }/*,
	_circleIdArray : [Schema.Types.ObjectId],
	_mutualAgreementIdArrayAreOngoing : [Schema.Types.ObjectId],
	_reviewIdArrayAreOngoing : [Schema.Types.ObjectId],
	_postIdArrayNotExpired : [Schema.Types.ObjectId],
	_postIdArrayExpired : [Schema.Types.ObjectId]
	*/
}, { collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.USER, _id: false});

/************************ Static Methods *************************/
/*
	Mongoose provide static methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
		document.findByIdAndRemove(_id, funciton(err, document))
		document.findByIdAndUpdate(_id, { $set: { password: 'new_pwd' }}, function (err, document))
*/

// create a new user document
userDAOSchema.statics.create = function(userId, password, facebookId, name,
	userIdType, rating/*, circleIdArray, mutualAgreementIdArrayAreOngoing,
	reviewIdArrayAreOngoing, postIdArrayNotExpired, postIdArrayExpired*/){
	return new UserDAO({
		_id : userId,
		_password : password,
		_facebookId : facebookId,
		_name : name,
		_userIdType : userIdType,
		_rating : rating, // -1 rating before rated!
		/*
		_circleIdArray : circleIdArray,
		_mutualAgreementIdArrayAreOngoing : mutualAgreementIdArrayAreOngoing,
		_reviewIdArrayAreOngoing : reviewIdArrayAreOngoing,
		_postIdArrayNotExpired : postIdArrayNotExpired,
		_postIdArrayExpired : postIdArrayExpired
		*/
	});
};

/************************ Instance Methods *************************/
/*
	Mongoose provide instance methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
*/

//the line below has to be called after we define the methods
var UserDAO = mongoose.model("UserDAO", userDAOSchema);

// UserDAO.validate('jiecao.wang@gmail.com', '1234', function(err, v){console.log(v)});

module.exports = UserDAO;
