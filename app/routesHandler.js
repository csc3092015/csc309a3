var PostBO = require('./../control/businessObject/PostBO.js');
var util = require('./../control/util.js');

var keywordsSearchHandler = function(req, res){
	var keywordsArray = util.stringToArray(req.body.post.keywords);
	PostBO.findPostsByKeywordsArray(keywordsArray, function(err, results){
		if(err){
			console.error(err);
		}
		else{
			res.send(results);
		}
	});
}

var postFormHandler = function(req, res){
	var title = req.body.post.title;
	var keywordsArray = util.stringToArray(req.body.post.keywords);
	var description = req.body.post.description;
	var autherId = req.user._userId;
	var newPost = new PostBO(title, keywordsArray, description, autherId);
	newPost.save(function(err){
		if(err){
			console.error(err);
		}
		else{
			console.log('Post submitted!');
		}
	});
	res.send('Post submitted page goes here.');
}

module.exports.keywordsSearchHandler = keywordsSearchHandler;
module.exports.postFormHandler = postFormHandler;