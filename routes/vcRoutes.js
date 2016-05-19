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


router.post('/grade2', function(req, res, next ) {
	var versionId = req.body.version;
	var tripleId = req.body.triple;
	connect(function(db) {
		if(db) {
			var store = db.collection('triple_store');
			store.aggregate([{
				$project: { 
					"triplets" : {
						$filter: {
							input: "$triplets",
							as: "t",
							cond: {
								$eq: [
									"$$t._id",
									tripleId
								]
							}
						}
					}
				}
			}]).toArray(function(err, rec) {
				if(err) {
					res.json({
						code: -1,
						msg: err
					});
				} else {
					res.json({
						code: 0,
						msg: rec[0].triplets[0]
					});
				}
			});
		} else {
			res.json({
				code: -1,
				msg: 'Could not connect to the database'
			});
		}
	});
});

router.post('/grade', function(req, res, next) {
	var versionId = req.body.version;
	var tripleId = req.body.triple;
	connect(function(db) {
		if(db) {
			var store = db.collection('triple_store');
			store.findOne({
				"_id": new ObjectID(versionId)
			}, function(err, rec) {
				if(err) {
					res.json({
						code: -1,
						msg: err
					});
				} else {
					var found = null;
					rec.triplets.forEach(function(t) {
						if(t["_id"] === tripleId) {
							found = t;
						}
					})
					if(found) {
						res.json({
							code: 0,
							msg: found
						});
					} else {
						res.json({
							code: -1,
							msg: 'Not found any triple with the given id'
						});
					}
				}
			});
		} else {
			res.json({
				code: -1,
				msg: 'Could not connect to the database'
			});
		}
	});
});


module.exports = router;
