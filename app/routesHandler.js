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
					userBO : req.user,
					postBO : postBO
				});
			} else{
				console.log('Somehow no erro but didn\'t submit the Post!');
				res.send('Somehow no erro but didn\'t submit the Post!');
			}
		}
	});
}

// depending on the user's identity, load the mutual agreement page or deny access.
// in event of permitted access, set up socket.io for real-time agreement updates.
var mutualAgreementInfoHandler = function(req, res) {
	var mutualAgreementId = req.params.mutualAgreementId;
	MutualAgreementBO.findById(mutualAgreementId, function(err, mutualAgreementBO){
		if (err) {
			console.error(err);
		}

		if (mutualAgreementBO) {
			var userId = req.user._userId;
			var userRole = UserRoleEnum["noAccess"];	
			// user role is consumer, provider w.r.t. 
			// mutual agreement, or neither but is 
			// admin, or do not have permission to view
			// agreement

			// check accessing user's role
			if (userId === mutualAgreementBO.getConsumerId()) {
				userRole = UserRoleEnum["consumer"];
			} else if (userId === mutualAgreementBO.getProviderId()) {
				userRole = UserRoleEnum["provider"];
			} else if (req.user._userIdType === UserTypeEnum["admin"]) {
				userRole = UserRoleEnum["adminOnly"];
			}

			// display insufficient permissions page if user has no permission
			// to view the mutual agreement
			if (UserRoleEnum.getName(userRole) === "noAccess") {
				res.render('insufficientPermissions.ejs');
			} else {

				var postTitle = PostBO.findPostById(mutualAgreementBO.getPostId(),
					function(err, postBO) {
						if (err) {
							console.error(err);
						} else {
							return postBO.getTitle();
						}
					});

				// set up a new mutual agreement namespace for clients to connect
				var agreementNsp = io.of('/mutualAgreement/' + mutualAgreementId);

				// set up socket event handlers
				agreementNsp.on('connection', function(socket) {
					console.log(req.user._userId + ' connected to socket ' 
						+ 'for agreement ID ' + mutualAgreementId);
				});

				res.render('mutualAgreement.ejs', {
					userRole : userRole,
					userBO : req.user,
					mutualAgreementBO : mutualAgreementBO,
					postTitle : postTitle
				});

			}
		} else {
			// trigger a 404 since no other middleware
			// will match after this one, and we're not
			// responding here
			next();
		}
	});
}

var mutualAgreementInfoUpdateHandler = function(req, res) {

}


module.exports.keywordsSearchHandler = keywordsSearchHandler;
module.exports.postFormHandler = postFormHandler;
module.exports.mutualAgreementInfoHandler = mutualAgreementInfoHandler;
module.exports.mutualAgreementInfoUpdateHandler = mutualAgreementInfoUpdateHandler;