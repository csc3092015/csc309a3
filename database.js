// Taken from https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://elio303:ekotani@ds059692.mongolab.com:59692/getitdone", function(err, db) {
  if(err) { 
  	return console.dir(err); 
  }
  // Put all database commands here
  
});