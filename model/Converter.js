var convertFromUserBOtoUserDAO = function(userBO){
	var userDAO = {};
	userDAO._id = userBO.userId;
	userDAO.password = userBO.password;
}

module.exports.convertFromUserBOtoUserDAO = convertFromUserBOtoUserDAO;