// Taken from https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
// Retrieve
var fs = require("fs");
var path = require("path");
var MongoClient = require('mongodb').MongoClient;
// valueArray = ["value1","value2",v"value3"...]
module.exports = function(collection, key, valueArray, callback){
	// Connect to the db
	MongoClient.connect("mongodb://elio303:ekotani@ds059692.mongolab.com:59692/getitdone", function(err, db) {
  		if(err) { 
  			db.close();
  			return callback(err, db);
  		}
  		db.close();
  		return db.collection.find({key:{$elemMatch:{valueArray}}});
  		}
	});
}