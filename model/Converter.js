var convertFromUserBOtoUserDAO = function(userBO){
	var userDAO = {};
	userDAO._id = userBO.userId;
	userDAO.password = userBO.password;
}

var convertFromPostBOtoPostDAO = function(postBO){
	var postDAO = {};
	postDAO.title = userBO.title;
	postDAO.keywordsArray = postBO.keywordsArray;
	postDAO.description = postBO.description;
}

var convertFromPostDAOtoPostBO = function(postDAO){
	var postBO = {};
	postBO.title = postDAO.title;
	postBO.keywordsArray = postDAO.keywordsArray;
	postBO.description = postDAO.description;
}

module.exports.convertFromUserBOtoUserDAO = convertFromUserBOtoUserDAO;
module.exports.convertFromPostBOtoPostDAO = convertFromPostBOtoPostDAO;
module.exports.convertFromPostDAOtoPostBO = convertFromPostDAOtoPostBO;