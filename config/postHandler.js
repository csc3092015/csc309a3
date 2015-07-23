var PostBO = require('./../control/businessObject/PostBO.js');

module.exports = function(title, keywordsArray, description){
	var newPost = new PostBO(title, keywordsArray, description);
	newPost.save(function(err){
		if(err){
			throw err;
		}
		else{
			console.log('Post submitted!');
		}
	});
}