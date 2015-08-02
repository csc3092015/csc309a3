var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');

/************************ Table Schema *************************/
var ImageDAOSchema = new Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		trim: true
	},
	name: {
		type: String,
		trim: true,
		required: true
	},
	data: {
		type: Buffer,
		required: true
	},
	contentType: {
		type: String,
		trim: true,
		required: true
	}
}, {collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.IMAGE, _id: false});

/************************ Static Methods *************************/
/*
	Mongoose provide static methods:
	http://mongoosejs.com/docs/documents.htmlrp
		document.findByIdAndRemove(_id, funciton(err, document))
		document.findByIdAndUpdate(_id, { $set: { password: 'new_pwd' }}, function (err, document))
*/
ImageDAOSchema.statics.create = function(name, data, contentType){
	return new ImageDAO({
		_id: name,
		img: {data: data, contentType: contentType}
	});
}

/************************ Instance Methods *************************/
/*
	Mongoose provide instance methods:
	http://mongoosejs.com/docs/documents.html
		document.save(funciton(err, document))
*/

var ImageDAO = mongoose.model('ImageDAO', ImageDAOSchema);
module.exports = ImageDAO;