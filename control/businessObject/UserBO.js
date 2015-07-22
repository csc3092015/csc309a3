 /*******************************Dummy Constructor**************************************/ function User (userId, password, userName, userIdType){
function User (userId, password, userName, userIdType){
	this._userId = userId;
	this._password = password;
	this._userName = userName;
	this._userIdType = userIdType;
}

module.exports = User;