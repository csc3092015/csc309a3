/*********************************Constructors****************************************/
function ImageBO (imageId, name, data, contentType){
	this._imageId = imageId;
	this._name = name;
	this._data = data;
	this._contentType = contentType;
};

/*********************************Setters****************************************/
ImageBO.prototype.setImageId = function(newImageId){
	this._imageId = newImageId;
};

ImageBO.prototype.setImageName = function(newName){
	this._name = newName;
};

ImageBO.prototype.setImageData = function(newData){	
	this._data = newData;
};

ImageBO.prototype.setImageType = function(newContentType){
	this._contentType = newContentType;
};

/*********************************Getters****************************************/
ImageBO.prototype.getImageId = function(){
	return this._imageId;
}

ImageBO.prototype.getImageName = function(){
	return this._name;
}

ImageBO.prototype.getImageData = function(){
	return this._data;
}

ImageBO.prototype.getImageType = function(){
	return this._contentType;
}

module.exports = ImageBO;