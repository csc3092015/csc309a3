var mongoose = require('mongoose');
var database = "mongodb://elio303:ekotani@ds059692.mongolab.com:59692/getitdone";

mongoose.connect(database);

var db = mongoose.connection;
var userProfileSchema = new mongoose.Schema({
	_id : String,
	password : Number
}, { collection: 'User', _id: false});

var UserProfile = mongoose.model("UserProfile", userProfileSchema);

var userJiecao = new UserProfile({_id: 'jiecao.wang@gmail.com', password: 1234})


userJiecao.save(function (err, userJiecao) {
  if (err) return console.error(err);
  console.log(userJiecao._id);
});