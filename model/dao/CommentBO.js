var CommentDAO = require('./../../model/dao/CommentDAO.js');
var Converter = require('./../../model/Converter.js');
var util = require('./../util.js');

/*******************************Dummy Constructor**************************************/ 
function CommentBO(commentId, description, authorId, createdAt){
	this._commentId = commentId;
	this._description = description;
	this._authorId = authorId;
	this._createdAt = createdAt;
}

/*******************************Static Method**************************************/

/*******************************Dummy Getters**************************************/
CommentBO.prototype.getCommentId = function(){
	return this._commentId;
};

CommentBO.prototype.getDescription = function(){
	return this._description;
};

CommentBO.prototype.getAuthorId = function(){
	return this._authorId;
};

CommentBO.prototype.getCreatedAt = function(){
	return this._createdAt;
};

/*******************************Setters**************************************/
CommentBO.prototype.setCommentId = function(newCommentId){
	this._commentId = newCommentId;
};

CommentBO.prototype.setDescription = function(newDescription){
	this._description = newDescription;
};

CommentBO.prototype.setAuthorId = function(newAuthorId){
	this._authorId = newAuthorId;
};

CommentBO.prototype.setCreatedAt = function(newCreatedAt){
	this._createdAt = newCreatedAt;
};

module.exports = CommentBO;	