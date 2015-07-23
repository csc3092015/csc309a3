var keywordsReqToArray = function(req){
	keywords = req.body.post.keywords;
	return keywords.split(" ").filter(Boolean);
}

module.exports = keywordsReqToArray;