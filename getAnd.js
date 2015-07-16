// Taken from https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
// Retrieve
var fs = require("fs");
var path = require("path");
var MongoClient = require('mongodb').MongoClient;
// keyValueArray = [{"key1":"value1"},{"key2":"value2"}...]
module.exports = function(collection, keyValueArray, callback){
	// Connect to the db
	MongoClient.connect("mongodb://elio303:ekotani@ds059692.mongolab.com:59692/getitdone", function(err, db) {
  		if(err) { 
  			db.close();
  			return callback(err, db);
  		}
  		db.close();
  		return db.collection.find({$and:[keyValueArray]});
  		}
	});
}