var UserBO = require('./../control/businessObject/UserBO.js');
var PostBO = require('./../control/businessObject/PostBO.js');
var MutualAgreementBO = require('./../control/businessObject/MutualAgreementBO.js');
var util = require('./../control/util.js');
var PostEnum = require('./../control/Enum.js').PostEnum;
var UserTypeEnum = require('./../control/Enum.js').UserTypeEnum;
var UserRoleEnum = require('./../control/Enum.js').UserRoleEnum;
var GLOBAL_CONSTANTS = require('./../GLOBAL_CONSTANTS.js');
var Converter = require('./../model/Converter.js');
// see http://docs.mongodb.org/manual/reference/object-id/
var ObjectId = require('mongoose').Types.ObjectId;

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
	var newPostBO = new PostBO(ObjectId().valueOf(), title, keywordsArray, description, autherId, byWho, isPurchased, isExpired, createdAt);
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

/**************************Mutual Agreement Handling*************************************/

// depending on the user's identity, load the mutual agreement page or deny access.
// in event of permitted access, set up socket.io for real-time agreement updates.
var mutualAgreementInfoHandler = function(req, res, mutualAgreementId) {
	MutualAgreementBO.findById(mutualAgreementId, function(err, mutualAgreementBO){

		if (err) {
			console.error(err);
		}

		if (mutualAgreementBO) {
			var userId = req.user._userId;
			var userRole = "noAccess";	
			// user role is consumer, provider w.r.t. 
			// mutual agreement, or neither but is 
			// admin, or do not have permission to view
			// agreement

			// check accessing user's role
			if (userId === mutualAgreementBO.getConsumerId()) {
				userRole = "consumer";
			} else if (userId === mutualAgreementBO.getProviderId()) {
				userRole = "provider";
			} else if (req.user._userIdType === UserTypeEnum["admin"]) {
				userRole = "adminOnly";
			}

			// display insufficient permissions page if user has no permission
			// to view the mutual agreement
			if (UserRoleEnum.getName(userRole) === "noAccess") {
				// trigger a 403 forbidden error since user
				// has no access to this mutual agreement
				var err = new Error();
				err.status = 403;
				next(err);
			} else {
				PostBO.findPostById(mutualAgreementBO.getPostId(), function(err, postBO) {
					if (err) {
						console.error(err);
					} else {
						var postTitle = postBO.getTitle();

						var providerId = mutualAgreementBO.getProviderId();
						var consumerId = mutualAgreementBO.getConsumerId();

						var postId = mutualAgreementBO.getPostId();

						var finishAt = mutualAgreementBO.getFinishAt();
						var finishDate = Converter.convertFromUnixTimestamptoDateObj(finishAt);
						var finishMonth = finishDate.getMonth() + 1;

						res.render('mutualAgreement.ejs', {
							userRole : userRole,
							user : req.user,
							mutualAgreementBO : mutualAgreementBO,
							providerId : providerId,
							providerLink : "/users/" + providerId.replace("@", "%40"),
							consumerId : consumerId,
							consumerLink : "/users/" + consumerId.replace("@", "%40"),
							postId : postId,
							postTitle : postTitle,
							postLink : "/post/" + postId,
							finishDay : finishDate.getDate(),
							finishMonth : finishMonth,
							finishYear : finishDate.getFullYear(),
							description : mutualAgreementBO.getDescription(),
							providerConsent : mutualAgreementBO.getProviderConsent(),
							consumerConsent : mutualAgreementBO.getConsumerConsent(),
							isFinalized : mutualAgreementBO.getIsFinalized(),
							isLocked : mutualAgreementBO.getIsLocked(),
							mutualAgreementId : mutualAgreementBO.getMutualAgreementId()
						}); // end res.render

					} // end else in callback function
				}); // end PostBO.findPostById
			}
		} else {
			res.render('404.ejs');
		}
	});
}

var mutualAgreementInfoUpdateHandler = function(req, res) {
	var responseObj = req.body;
	var mutualAgreementId = responseObj.mutualAgreementId;

	for (var attribute in responseObj) {

		if (attribute == "deleteAgreement") {
			MutualAgreementBO.findByIdAndRemove(mutualAgreementId, function(err, mutualAgreementBO){
				if (err) {
					res.send({ "success" : false });
				} else {
					res.send({ "success" : true });
					console.log("Mutual agreement with id " 
						+ mutualAgreementBO.getMutualAgreementId() + " is deleted.");
				}
			});
		}

		if (attribute == "providerConsent") {
			var updateDict = { providerConsent : responseObj[attribute] };
			mutualAgreementUpdateHelper(res, updateDict, mutualAgreementId);
		}

		if (attribute == "consumerConsent") {
			var updateDict = { consumerConsent : responseObj[attribute] };
			mutualAgreementUpdateHelper(res, updateDict, mutualAgreementId);
		}

		if (attribute == "isFinalized") {
			var updateDict = { isFinalized : responseObj[attribute] };
			mutualAgreementUpdateHelper(res, updateDict, mutualAgreementId);
		}

		if (attribute == "isLocked") {
			// on entering edit mode, newLockStatus is true
			// simply change the isLocked property to true
			// otherwise, it is a submit request, so
			// change mutual agreement according to the request
			if (responseObj.isLocked === true) {
				console.log("locked true");
				var updateDict = { isLocked : true };
			} else {
				console.log("locked false");
				if (responseObj.editted) {
					console.log("detected that agreement was editted");
					var updateDict = { 
						isLocked : false,
						description : responseObj.newDescription,
						finishAt : responseObj.finishAt,
						consumerConsent : false,
						providerConsent : false
					};
				} else {
					console.log("wasn't editted");
					var updateDict = { isLocked : false };
				}
			}
			mutualAgreementUpdateHelper(res, updateDict, mutualAgreementId);
		}

	} // end for attribute
}

function mutualAgreementUpdateHelper(res, updateDict, mutualAgreementId) {
	MutualAgreementBO.findByIdAndUpdate(mutualAgreementId, updateDict, function (err, newMutualAgreementBO) {
		if (err) {
			console.error("mutualAgreementInfoUpdateHandler error: " + err);
			res.send({ "success" : false});
		} else {
			res.send({ "success" : true });
		}
	});
}

/**************************General Helper*************************************/





/**************************Home Page*************************************/
module.exports.renderHomePage = renderHomePage;

/**************************Search Bar*************************************/
module.exports.keywordsSearchHandler = keywordsSearchHandler;

/**************************Submit a New Post*************************************/
module.exports.postFormHandler = postFormHandler;

/**************************Mutual Agreement Page*************************************/
module.exports.mutualAgreementInfoHandler = mutualAgreementInfoHandler;
module.exports.mutualAgreementInfoUpdateHandler = mutualAgreementInfoUpdateHandler;