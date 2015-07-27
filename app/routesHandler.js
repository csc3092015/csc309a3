var PostBO = require('./../control/businessObject/PostBO.js');
var util = require('./../control/util.js');
var PostEnum = require('./../control/Enum.js').PostEnum;
var GLOBAL_CONSTANTS = require('./../GLOBAL_CONSTANTS.js');
var Converter = require('./../model/Converter.js');

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
	PostBO.findPostsByKeywordsArrayAndOption(keywordsArray, optionalDictionary, function(err, postDAOs){
		if(err){
			console.error(err);
		}
		else{
			var postBOs = [];
			for (var i = postDAOs.length - 1; i >= 0; i--) {;
				postBOs.push(Converter.convertFromPostDAOtoPostBO(postDAOs[i]));
			};
			res.render('postSearchResult.ejs', {
				user : req.user,
				postBOs: postBOs
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
	var createdAt = new Date().getTime();
	var newPost = new PostBO(title, keywordsArray, description, autherId, byWho, createdAt);
	newPost.save(function(err, postDAO){
		if(err){
			console.error(err);
		}
		else{
			if (postDAO){
				var postBO = Converter.convertFromPostDAOtoPostBO(postDAO);
				res.render('postSubmit.ejs', {
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