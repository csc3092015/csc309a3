var UserDAO = require('./../../model/dao/UserDAO.js');
var Converter = require('./../../model/Converter.js');
var PostBO = require('./PostBO.js');

// Image constructor

function ImageBO (name, data, contentType){
	this._name = name;
	this._data = data;
	this._contentType = contentType;
}

//Getters

ImageBO.prototype.getImageName = function(){
	return this._name;
}

ImageBO.prototype.getImageData = function(){
	return this._data;
}

ImageBO.prototype.getImageType = function(){
	return this._contentType;
}

//Setters

ImageBO.prototype.setImageName = function(name){
	this._name = name;
}

ImageBO.prototype.setImageData = function(data){	
	this._data = data;
}

ImageBO.prototype.setImageType = function(contentType){
	this._contentType = contentType;
}

// Export Function

module.exports = ImageBO;