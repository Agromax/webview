var express = require('express');
var path = require('path');
var crypto = require('crypto');
var Schema = require('../lib2/schema.js');
var hash = require('../lib2/hash');


var router = express.Router();
var User =  Schema.User;
var VC = Schema.VersionControl;


/**
Just a helper function 
*/
function _url(name) {
	return '/app/' + name;
}


router.get('/', function (req, res, next) {
	var user = req.session.payload;
	if(user) {
		res.redirect(_url('dashboard')); 			// The user seems to be logged in, this is cool
	} else {
		res.redirect(_url('enter'));				// Nopes, not cool
	}
});


router.get('/dashboard', function(req, res, next) {
	if(req.session.payload) {
		res.json({
			code: 0,
			msg: {
				text: 'Welcome onboard!',
				payload: req.session.payload
			}
		});
	} else {
		res.json({
			code: -1,
			msg: 'Something went wrong. Re-creating the universe, please wait'
		});
	}
});


router.get('/enter', function(req, res, next) {
	res.render('enter', {pageTitle: 'Sign In here'});
});


module.exports = router;

