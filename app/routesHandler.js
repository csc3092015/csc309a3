var PostBO = require('./../control/businessObject/PostBO.js');
var util = require('./../control/util.js');
var PostEnum = require('./../control/Enum.js').PostEnum;
var GLOBAL_CONSTANTS = require('./../GLOBAL_CONSTANTS.js');

var keywordsSearchHandler = function(req, res){
	// check home.ejs and Enum.js
	var keywordsArray = util.stringToArray(req.body.post.keywords);
	var optionalDictionary = {};
	// check which radio button is turned on
	for (var i = GLOBAL_CONSTANTS.MODEL.POST_DAO.MULTIKEY_INDEX.length - 1; i >= 0; i--) {
		// so key = either "byWho", "isPurchased", "isExpired"
		var key = GLOBAL_CONSTANTS.MODEL.POST_DAO.MULTIKEY_INDEX[i];
		// if the radio button is checked, added the option into optionalDictinary
		// Eg. key = "byWho", then req.body.post[key] = "byComsumer" or "byProvider"
		if(req.body.post[key]){
			// Eg. req.body.post[key] = "byComsumer", then PostEnum[req.body.post[key]] = 0
			optionalDictionary[key] = PostEnum[req.body.post[key]];
		}
	};
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