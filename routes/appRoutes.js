var express = require('express');
var path = require('path');
var crypto = require('crypto');
var User = require('../lib2/schema.js').User;
var hash = require('../lib2/hash');


var router = express.Router();

router.get('/', function (req, res, next) {
	res.send('Welcome to app');
});



module.exports = router;

