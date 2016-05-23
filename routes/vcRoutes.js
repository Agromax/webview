var express = require('express');
var path = require('path');
var connect = require('../lib/vc').connect;
var ObjectID = require('mongodb').ObjectID;

var router = express.Router();

router.get('/', function (req, res, next) {
	res.send('Hello FROM vc');
});

router.get('/versions', function(req, res, next) {
	connect(function(db) {
		if(db) {
			var store = db.collection('triple_store');
			store.find({}).toArray(function(err, docs) {
				if(err) {
					console.log(err);
					res.json({
						code: -1,
						msg: err,
					});
				} else {
					var vIds = [];
					docs.forEach(function(v) {
						vIds.push({
							id: v._id,
							ts: v.ts
						});
					});

					res.json({
						code: 0,
						msg: {
							count: docs.length,
							ids: vIds
						}
					});
				}

			});
		} else {
			console.warn('Something went wrong. Could not connect to the database');
			res.json({
				code: -1,
				msg: 'Something went wrong. Could not connect to the database'
			});
		}
	});
});


router.get('/version', function(req, res, next) {
	var versionId = req.query.id;
	connect(function(db) {
		if(db) {
			var store = db.collection('triple_store');
			var objId = new ObjectID(versionId);

			store.findOne({"_id": objId}, function(err, docs) {
				if(err) {
					res.json({
						code: -1,
						msg: err
					});
				} else {
					res.json({
						code: 0,
						msg: docs
					});
				}
			});
		} else {
			res.json({
				code: -1,
				msg: 'Could not connect to the database.'
			});
		}
	});
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


router.post('/grade', function(req, res, next ) {
	var versionId = req.body.version;
	var tripleId = req.body.triple;
	var gradeVal = parseInt(req.body.gradeVal);

	connect(function(db) {
		if(db) {
			var store = db.collection('triple_store');
			try {
				store.findOne({
					"_id": ObjectID(versionId)
				}, function(err, records) {
					if(err) {
						console.error(err);
						res.json({code: -1, msg: err});
						return;
					}
					if(!records) {
						res.json({code: -1, msg: 'No record found with id:' + versionId});
						return;
					}
					var triple = records.triplets.find(elem => elem["_id"] === tripleId);
					if(triple) {
						var grade = triple.grade;
						grade.push({user: 'admin', val: gradeVal});
						store.updateOne({"_id": ObjectID(versionId)}, {
							$set: {
								triplets: records.triplets
							}
						}, function(err, done) {
							if(err) {
								console.warn(err);
								res.json({code: -1, msg: err});
								return;
							}
							res.json({code: 0, msg: 'Booyah! I did it'});
						});
					}

				});
			} catch(err) {
				res.json({code: -1, msg: err});
			}
		} else {
			res.json({
				code: -1,
				msg: 'Could not connect to the database'
			});
		}
	});
});



module.exports = router;
