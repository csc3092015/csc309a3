var PostBO = require('./../control/businessObject/PostBO.js');
var util = require('./../control/util.js');
var PostEnum = require('./../control/Enum.js').PostEnum;
var GLOBAL_CONSTANTS = require('./../GLOBAL_CONSTANTS.js');
var Converter = require('./../model/Converter.js');
// see http://docs.mongodb.org/manual/reference/object-id/
var ObjectId = require('mongoose').Types.ObjectId;

var keywordsSearchHandler = function(req, res){
	// for following part refer to home.ejs and Enum.js
	var keywordsArray = util.stringToArray(req.body.post.keywords);
	var optionalDictionary = {};
	// the for loop checks which radio button is turned on
	for (var i = GLOBAL_CONSTANTS.MODEL.POST_DAO.MULTIKEY_INDEX.length - 1; i >= 0; i--) {
		// so key = either "byWho", "isPurchased", "isExpired"
		var key = GLOBAL_CONSTANTS.MODEL.POST_DAO.MULTIKEY_INDEX[i];
		// Eg. key = "byWho", then req.body.post[key] = "byComsumer" or "byProvider"
		if(req.body.post[key]){
			// Eg. req.body.post[key] = "byComsumer", then PostEnum[req.body.post[key]] = 0 if By comsumer radio is checked
			optionalDictionary[key] = PostEnum[req.body.post[key]];
		}
	};
	PostBO.findPostsByKeywordsArrayAndOption(keywordsArray, optionalDictionary, function(err, postBOArray){
		if(err){
			console.error(err);
		}
		else{
			res.render('postSearchResult.ejs', {
				user : req.user,
				postBOArray: postBOArray
			});
		}
	});
}

var postFormHandler = function(req, res){
	var title = req.body.post.title;
	var keywordsArray = util.stringToArray(req.body.post.keywords);
	var description = req.body.post.description;
	var autherId = req.user._userId;

	var byWho = PostEnum[req.body.post.byWho];
	var isPurchased = PostEnum.isNotPurchased;
	var isExpired = PostEnum.isNotExpired;
	var createdAt = new Date().getTime();
	var newPostBO = new PostBO(ObjectId().valueOf(), title, keywordsArray, description, autherId, byWho, isPurchased, isExpired, createdAt);
	newPostBO.save(function(err, postBO){
		if(err){
			console.error(err);
		}
		else{
			if (postBO){
				res.render('postAfterSubmit.ejs', {
					user : req.user,
					postBO: postBO
				});
			} else{
				console.log('Somehow no erro but didn\'t submit the Post!');
				res.send('Somehow no erro but didn\'t submit the Post!');
			}
		}
	});
}

module.exports.keywordsSearchHandler = keywordsSearchHandler;
module.exports.postFormHandler = postFormHandler;