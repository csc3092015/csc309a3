var UserDAO = require('./../model/dao/UserDAO');
var UserBO = require('./../control/businessObject/UserBO.js');
var PostBO = require('./../control/businessObject/PostBO.js');
var ImageBO = require('./../control/businessObject/ImageBO.js');
var util = require('./../control/util.js');
var PostEnum = require('./../control/Enum.js').PostEnum;
var GLOBAL_CONSTANTS = require('./../GLOBAL_CONSTANTS.js');
var Converter = require('./../model/Converter.js');
var fs = require('fs');

/**************************Home Page*************************************/
var renderHomePage = function(req, res){
	var userId = req.user._userId;
	UserBO.findAllPostBOsByUserId(userId, function(err, postBOArray){
		// find all the posts that this user has
		// construct the keyword set out of those posts
		var keywordsSet = new Set();
		for (var i = 0; i < postBOArray.length; i++) {
			var keywordsArray = postBOArray[i].getKeywordsArray();
			// chrome console output
			// b = new Set()
			// Set {}
			// Set.prototype.add.apply(b, [1,2,1]) #this line is the same as b.add.apply(b, [1,2,1])
			// Set {1}
			keywordsSet.add.apply(keywordsSet, keywordsArray);
		};
		// need to convert set to array now
		var keywordsArray = [];
		keywordsSet.forEach(function(keyword){
			keywordsArray.push(keyword);
		});

		if(keywordsArray.length > 0){
			// search for all the posts that are not owned by this user, byConsumer, not expired
			var byConsumerCriteriaDictionary = {
				$and:
					[
						{authorId: {$ne: userId}},
						{keywordsArray: {$in: keywordsArray}},
						{byWho: {$eq: PostEnum['byConsumer']}},
						{isExpired: {$eq: PostEnum['isNotExpired']}}
					]
			};
			PostBO.findPosts(byConsumerCriteriaDictionary, GLOBAL_CONSTANTS.MODEL.POST_DAO.HOME_PAGE_RECOMMENDATION_NUMBER, function(err, postBOArray){
				// search for all the posts that are not owned by thie user, byProvider, not expired
				if(err){
					res.send(err);
					console.log('fails on finding recommended posts by consumer\n ' + err);
					return;
				}
				var postBOByConsumerArray = postBOArray;
				var byProviderCriteriaDictionary = {
					$and:
						[
							{authorId: {$ne: userId}},
							{keywordsArray: {$in: keywordsArray}},
							{byWho: {$eq: PostEnum['byProvider']}},
							{isExpired: {$eq: PostEnum['isNotExpired']}}
						]
				};
				PostBO.findPosts(byProviderCriteriaDictionary, GLOBAL_CONSTANTS.MODEL.POST_DAO.HOME_PAGE_RECOMMENDATION_NUMBER, function(err, postBOArray){
					if(err){
						res.send(err);
						console.log('fails on finding recommended posts by provider\n ' + err);
						return;
					}
					var postBOByProviderArray = postBOArray;
					res.render('home.ejs', {
						user : req.user,
						postBOByConsumerArray: postBOByConsumerArray, 
						postBOByProviderArray: postBOByProviderArray,
						PostEnum: PostEnum
					});
				});
			});
		} else {
			// if i have time, show some posts that are most searched most of the time
			// if not, show random posts (right now just show any 5 posts)
			var criteriaDictionary = {
				$and:
					[
						{authorId: {$ne: userId}},
						{isExpired: {$eq: PostEnum['isNotExpired']}}
					]
			};
			PostBO.findPosts(criteriaDictionary, GLOBAL_CONSTANTS.MODEL.POST_DAO.HOME_PAGE_RECOMMENDATION_NUMBER, function(err, postBOArray){
				if(err){
					res.send(err);
					console.log('fails on finding recommended posts\n ' + err);
					return;
				}
				var postBOFeaturedArray = postBOArray;
				res.render('home.ejs', {
					user : req.user,
					postBOFeaturedArray: postBOFeaturedArray,
					PostEnum: PostEnum
				});
			});

		}

	});
};

/**************************Search Bar*************************************/
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
				postBOArray: postBOArray,
				PostEnum: PostEnum
			});
		}
	});
}

/**************************Submit a New Post*************************************/
var postFormHandler = function(req, res){
	var title = req.body.post.title;
	var keywordsArray = util.stringToArray(req.body.post.keywords);
	var description = req.body.post.description;
	var autherId = req.user._userId;

	var byWho = PostEnum[req.body.post.byWho];
	var isPurchased = PostEnum.isNotPurchased;
	var isExpired = PostEnum.isNotExpired;
	var createdAt = new Date().getTime();
	var newPostBO = new PostBO(Converter.generateBOId(), title, keywordsArray, description, autherId, byWho, isPurchased, isExpired, createdAt);
	newPostBO.save(function(err, postBO){
		if(err){
			console.error(err);
		}
		else{
			if (postBO){
				res.render('postAfterSubmit.ejs', {
					user : req.user,
					postBO: postBO,
					PostEnum: PostEnum
				});
			} else{
				console.log('Somehow no erro but didn\'t submit the Post!');
				res.send('Somehow no erro but didn\'t submit the Post!');
			}
		}
	}, autherId);
}

var uploadToDB = function(req, res){
	// for convenience
	var user = req.user;
	// connect-multipart creates this convenient req.files.file and its attributes
	// connect-multipart module is imported in routes.js
	var file = req.files.file;

	// name photos by their user's name
	var name = user._userId;
	// getting file attributes
	var path = file.path;
	var contentType = file.headers['content-type'];

	fs.readFile(path, function (err, data) {
  		if (err) {
    		return console.log(err);
  		}
  		
  		// Creating ImageBO 
  		var image = new ImageBO(name, data, contentType);
  		// Updating UserDAO's image
  		UserDAO.findByIdAndUpdate(req.user._userId, {$set: {image: {id: image.getImageName(), data: image.getImageData(), contentType: image.getImageType()}}}, function(err, userDAOReturned){
			if(err){
				console.log(err);
			}
			else{
				// Setting refined user
				// Converter fails on new UserBO so decided not to use it
				req.user._userId = userDAOReturned._id;
				console.log(req.user._userId);
				// Creating image object
				var contentType = userDAOReturned.image.contentType;
				var name = userDAOReturned.image.id;
				var data = userDAOReturned.image.data;
				// Passing image so that uploadSucceeded can receive it
				res.contentType(contentType);
          		res.send(data);
          		res.end();
			}
  		});
	});
}

/**************************General Helper*************************************/





/**************************Home Page*************************************/
module.exports.renderHomePage = renderHomePage;

/**************************Search Bar*************************************/
module.exports.keywordsSearchHandler = keywordsSearchHandler;

/**************************Submit a New Post*************************************/
module.exports.postFormHandler = postFormHandler;
/**************************Upload A Profile Picture**********/
module.exports.uploadToDB = uploadToDB;