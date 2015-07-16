// Taken from https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
// Retrieve
var fs = require("fs");
var path = require("path");
var MongoClient = require('mongodb').MongoClient;
// Command will be an array 
module.exports = function(command, callback){
	// Connect to the db
	MongoClient.connect("mongodb://elio303:ekotani@ds059692.mongolab.com:59692/getitdone", function(err, db) {
  		if(err) { 
  			return callback(err, db);
  		}
  		// Put all database commands here
  		if(command[0] === "GET"){
  			//db.collection_name.find(key_value_pair_1, key_value_pair_2, ...);
  			// Parse this into something usable and return
  		}
  		else if(command[0] === "POST"){

  		}
  		else if(command[0] === "PUT"){

  		}
  		else if(command[0] === "DELETE"){

  		}
	});
}
