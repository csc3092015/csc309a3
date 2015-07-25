var PostBO = require('./../control/businessObject/PostBO.js');
var util = require('./../control/util.js');
var PostEnum = require('./../control/Enum.js').PostEnum;
var GLOBAL_CONSTANTS = require('./../GLOBAL_CONSTANTS.js');

var keywordsSearchHandler = function(req, res){
	var keywordsArray = util.stringToArray(req.body.post.keywords);
	var optionalDictionary = {};
	for (var key in GLOBAL_CONSTANTS.MODEL.POST_DAO.MULTIKEY_INDEX){
		if(req.body.post[key]){
			optionalDictionary[key] = req.body.post[key];
		}
	}
	console.log("post is:" + req.body.post + "\n");
	console.log(optionalDictionary);
	PostBO.findPostsByKeywordsArrayAndOption(keywordsArray, optionalDictionary, function(err, results){
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

	var byWho = PostEnum[req.body.post.byWho];
	var createdAt = new Date().getTime();
	var newPost = new PostBO(title, keywordsArray, description, autherId, byWho, createdAt);
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