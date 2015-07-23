var PostBO = require('./../control/businessObject/PostBO.js');

function submit(req){
	var title = req.body.post.title;
	var keywords = req.body.post.keywords;
	var description = req.body.post.description;
	var keywordsArray = keywords.split(" ").filter(Boolean);
	var newPost = new PostBO(title, keywordsArray, description);
	newPost.save(function(err){
		if(err){
			throw err;
		}
		else{
			console.log('Post submitted!');
		}
	});
}

module.exports = submit;