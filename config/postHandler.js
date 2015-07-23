var PostBO = require('./../control/businessObject/PostBO.js');
var reqToArray = require('./reqToArray');

function submit(req){
	var title = req.body.post.title;
	var keywordsArray = reqToArray(req);
	var description = req.body.post.description;
	var user = req.user._userId;
	var newPost = new PostBO(title, keywordsArray, description, user);
	newPost.save(function(err){
		if(err){
			throw err;
		}
		else{
			console.log('Post submitted!');
		}
	});
}

module.exports = submit;