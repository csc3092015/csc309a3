//var PostBO = require('./../control/businessObject/PostBO.js');
var PostDAO = require('./../model/dao/PostDAO.js');
var reqToArray = require('./reqToArray');

var search = function(req, callback){
	var keywordsArray = reqToArray(req);
	PostDAO.find({keywordsArray: {$in: keywordsArray}}, function(err, docs){
		if(err){
			callback(err, docs);
		}
		else{
			callback(err, docs);
		}
	}).limit(10);
}

module.exports = search;