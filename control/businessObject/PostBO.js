var PostDAO = require('./../../model/dao/PostDAO.js');
//var db = require('./../database.js');
//db.connect();

 /*******************************Dummy Constructor**************************************/ 
function Post (title, keywordsArray, description){
	this._title = title;
	this._keywordsArray = keywordsArray;
	this._description = description;
	//this._authorId = authorId;
	//this._expiryDate = expiryDate;
	//this._ongoingMutualAgreementIdArray = ongoingMutualAgreementIdArray;
	//this._pictureIdArray = pictureIdArray;
	//this._creationDate = TIMESTAMP...
	//this._creationDate = 0;
	//this._googlePlaceId = googlePlaceId;
	//this._rating = rating;
	//this._totalNumReviews = totalNumReviews;
}

/*******************************Static Method**************************************/


/*******************************Instance Method**************************************/

Post.prototype.save = function(callback){
	var newPost = PostDAO.create(this._title, this._keywordsArray, this._description);
	newPost.save(function(err){
		callback(err);
	});
}

module.exports = Post;