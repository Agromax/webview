var express = require('express');
var path = require('path');
var Schema = require('../lib2/schema');
var ObjectID = require('mongodb').ObjectID;

var router = express.Router();

router.get('/', function (req, res, next) {
	res.send('Welcome, this is version controller router');
});

/**
Returns the list of all the versions available
*/
router.get('/versions', function(req, res, next) {
	var VC = Schema.VersionControl;
	VC.find({}, function(err, versions) {
		if(err) {
			console.error(err);
			res.json({
				code: -1,
				msg: 'Error occurred while downloading the list of verisons'
			});
			return;
		}

		res.json({
			code: 0,
			msg: versions
		});
	});
});


/** 
Returns the details of individual version
*/
router.get('/version', function(req, res, next) {
	var versionId = req.query.id;
	if(req.session.payload) {
		Schema.VersionControl.findById(versionId, function(err, record) {
			if(err) {
				res.json({
					code: -1,
					msg: err
				});
				return;
			}
			var rec = record.toObject();
			rec['user'] = {
				id: req.session.payload["_id"], 
				username: req.session.payload['username']
			};
			/*var curUser = req.session.payload;
			var triplets = record.triplets.map(function(t) {
				var gradeVal = t.grades.find(function(g) {
					if(g.user) {
						return g.user.toString() === curUser["_id"].toString();
					}
					return false;
				});
				t['gradeVal'] = gradeVal;
				return t;
			});
			record.triplets = triplets;*/

			res.json({
				code: 0,
				msg: rec
			});
		});
	} else {
		res.redirect('/app');
	}
});


router.get('/help', function(req, res, next) {
	var cmd = req.query.route;
	if(cmd === 'grade') {
		res.json({
			code: 0,
			msg: 'Updates the grade of the given triple. Takes version, triple and grade as parameter'
		});
	}
	else {
		res.json({
			code: 0,
			msg: 'Unknown command'
		});
	}
});	


/**
Updates the grade of an individual triple
*/
router.post('/grade', function(req, res, next ) {
	var VC = Schema.VersionControl;
	var User = Schema.User;

	var versionId = req.body.version;
	var tripleId = req.body.triple;
	var gradeVal = parseInt(req.body.grade);

	// var token = req.body.token;

	if(req.session.payload) {
		var user = req.session.payload;

		VC.findById(versionId, function(err, version) {
			var triple = version.triplets.id(tripleId);
			var marks = triple.grades.find(function(u) {
				if(u.user) {
					return u.user.toString() === user["_id"].toString();
				}
				return false;
			});

			if(!marks) {
				marks = {user: user["_id"], value: gradeVal};
				triple.grades.push(marks);
			} else {
				marks['value'] = gradeVal;
			}
			version.save(function(err, v) {
				if(err) {
					res.json({
						code: -1,
						msg: err
					});
					return;
				}
				res.json({
					code: 0,
					msg: 'Grade for triple with id=' + triple.id + ' updated to:' + gradeVal  
				});
			});
		});

	} else {
		res.redirect('/app');
	}
});


/**
Updates the feedback given by the domain expert on the given triple
*/
router.post('/feedback', function(req, res, next) {
	var VC = Schema.VersionControl;
	var User = Schema.User;

	var versionId = req.body.version;
	var tripleId = req.body.triple;
	var feedback = req.body.feedback;

	if(req.session.payload) {
		var user = req.session.payload;
		VC.findById(versionId, function(err, version) {
			var triple = version.triplets.id(tripleId);
			var marks = triple.grades.find(function(u) {
				if(u.user) {
					return u.user.toString() === user["_id"].toString();
				} 
				return false;
			});

			if(!marks) {
				marks = {user: user["_id"], value: 0, feedback: feedback};
				triple.grades.push(marks);
			} else {
				marks['feedback'] = feedback;
			}

			version.save(function(err, v) {
				if(err) {
					res.json({
						code: -1,
						msg: err
					});
					return;
				}
				res.json({
					code: 0,
					msg: 'Feedback for triple with id=' + triple.id + ' updated to:' + feedback  
				});
			});
		});
	} else {
		res.redirect('/app');
	}
});
 	

module.exports = router;
