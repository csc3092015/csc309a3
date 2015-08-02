var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GLOBAL_CONSTANTS = require('./../../GLOBAL_CONSTANTS.js');

/************************ Table Schema *************************/
var ImageDAOSchema = new Schema({
	_id: {type:String},
	img: { data: Buffer, contentType: String }
}, {collection: GLOBAL_CONSTANTS.MODEL.TABLE_NAME.IMAGE, _id: false});

/************************ Static Methods *************************/
ImageDAOSchema.statics.create = function(name, data, contentType){
	return new ImageDAO({
		_id: name,
		img: {data: data, contentType: contentType}
	});
}

var ImageDAO = mongoose.model('ImageDAO', ImageDAOSchema);
module.exports = ImageDAO;