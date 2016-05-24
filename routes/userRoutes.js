var express = require('express');
var path = require('path');
var connect = require('../lib/vc').connect;
var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');
var User = require('../lib2/schema.js').User;
var hash = require('../lib2/hash');


var router = express.Router();

router.get('/', function (req, res, next) {
	res.render('enter', {pageTitle: 'Sign In Here'});
});


router.post('/signin', function(req, res, next) {
	var username = req.body.user;
	var password = req.body.pwd;

	User.find({username: username, password: hash(password)}, function(err, users) {
		if(err) {
			res.json({
				code: -1,
				msg: 'Error occurred while authenticating, please try again later'
			});
			return;
		}

		if(users.length === 1) {
			var user = users[0];
			var token = user.getToken();
			user.token = token['token'];
			user.expires = token['expires'];

			user.save(function(err, u) {
				res.json({
					code: 0,
					msg: {
						text: 'Authenticated',
						id: u['_id'],
						authToken: u.token
					}
				});
			});
		} else {
			res.json({
				code: -1,
				msg: 'Could not authorize. Incorrect username or password'
			});
		}

	});

});


module.exports = router;

