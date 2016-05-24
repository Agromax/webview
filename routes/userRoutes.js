var express = require('express');
var path = require('path');
var connect = require('../lib/vc').connect;
var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');


var router = express.Router();

router.get('/', function (req, res, next) {
	res.send('Hello FROM user controller');
});

router.post('/signin', function(req, res, next) {
	var username = req.body.user;
	var password = req.body.password;

	var shaSum = crypto.createHash('sha1');
	shaSum.update(password);

	connect(function(db) {
		if(db) {
			var store = db.users;
			store.findOne({"username": username, password: shaSum.digest('hex')}, function(err, u) {
				if(err) {
					console.error(err);
					res.send('Not found');
					return;
				}

				if(u) {
					
				}
			});

		} else {
			res.send('Could not connect to the database');
		}
	});

});


