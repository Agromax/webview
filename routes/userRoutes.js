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
				msg: 'Error occurred while authenticating, please try again later',
				forNerds: err
			});
			return;
		}

		if(users.length === 1) {
			var user = users[0];
			var token = user.generateToken();
			user.token = token['token'];
			user.expires = token['expires'];

			user.save(function(err, u) {
				if(err) {
					res.json({
						code: -1,
						msg: 'Something went wrong by authentication. Please try again later',
						forNerds: err
					});
					return;
				}

				req.session.payload = u;
				res.redirect('/app');
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

