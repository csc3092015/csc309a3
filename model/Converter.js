var convertFromUserBOtoUserDAO = function(userBO){
	var userDAO = {};
	userDAO._id = userBO.userId;
	userDAO.password = userBO.password;
}

var convertFromPostBOtoPostDAO = function(postBO){
	var postBO = {};
	postDAO.title = userBO.title;
	postDAO.keywordsArray = postBO.keywordsArray;
	postDAO.description = postBO.description;
}

module.exports.convertFromUserBOtoUserDAO = convertFromUserBOtoUserDAO;
module.exports.convertFromPostBOtoPostDAO = convertFromPostBOtoPostDAO;