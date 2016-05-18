var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');
var assert = require('assert');



var DATABASE_NAME = "rdfdb";
var COLLECTION_NAME = "triple_store";

var CONNECTION_URL = 'mongodb://localhost:27017/'+DATABASE_NAME;

MongoClient.connect(CONNECTION_URL, function(err, db) {
	assert.equal(null, err);

	console.log('Connected to the database');
/*
	fetchAllVersions(db, function(res) {
		console.log(res);
		writeToFile(res, 'triple_store.json');
		db.close();
	});	
	*/

	// insertVersion(db, function() {
	// 	db.close();
	// });
});


function insertVersion(db, callback) {
	fs.readFile(path.join(__dirname, 'triple_store.json'), function(err, res) {
		assert.equal(null, err);
		var json = JSON.parse(res);
		var ts = db.collection(COLLECTION_NAME);
		doc = {
			ts: Date.now(),
			triplets: json
		};
		ts.insert(doc);

		callback();
	});
}


function fetchAllVersions(db, callback) {
	var store = db.collection(COLLECTION_NAME);
	store.find({}).toArray(function(err, docs) {
		if(err) {
			console.error(err);
			return;
		}
		callback(docs);
	});
}


function writeToFile(obj, filename) {
	var objs = JSON.stringify(obj);
	var storagePath = path.join(__dirname, filename);
	fs.writeFile(storagePath, objs);
}

function connect(callback) {
	MongoClient.connect(CONNECTION_URL, function(err, db) {
		if(err) {
			callback(null);
		} else {
			console.log('Connected to the database');
			callback(db);
		}
	});
}	


module.exports.connect = connect;