var mongoose = require('mongoose');
var crypto = require('crypto');
var random = require("random-js")(); // uses the nativeMath engine


mongoose.connect('mongodb://localhost/rdfdb');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	name: String,
	token: String,
	expires: Number,
	loginArchives: [{ip: String, loc: String}]
});

userSchema.methods.generateToken = function() {
	var expiresAt = Date.now() + 60 * 60 * 24 * 1000; // Expires in 24 hours by default
	return {
		token: random.hex(24),
		expires: expiresAt
	};
};
userSchema.methods.isValidToken = function(token) {
	if(this.token === token && Date.now() < this.expires) {
		return true;
	}
	return false;
};
userSchema.methods.invalidateToken = function(callback) {
	this.token = '';
	this.expires = Date.now() - 10000;
	this.save(callback);
};
userSchema.statics.findByToken = function(token, callback) {
	this.find({token: token}, function(err, user) {
		if(err) {
			callback(null);
			return;
		}
		callback(user);
	});
};


var tripletSchema = new Schema({
	sub: String,
	obj: String,
	pre: String,
	grades: [{
		user: Schema.Types.ObjectId,
		value: Number,
		feedback: String
	}],
	avgGrade: Number
});


var versionSchema = new Schema({
	desc: String,
	ts: Date,
	triplets: [tripletSchema]
});


var User 		   = mongoose.model('User', userSchema);
var Triplet 	   = mongoose.model('Triplet', tripletSchema);
var VersionControl = mongoose.model('VersionControl', versionSchema);




/*function hash(x) {
	var shaSum = crypto.createHash('sha1');
	shaSum.update(x);
	return shaSum.digest('hex');
}*/

// usr.save(function(er, us) {
// 	if(er) {
// 		console.warn(er);
// 		return;
// 	}
// 	console.log(us);
// });

// User.find({username: 'anurag', password: hash('123')}, function(err, users) {
	// console.log(users);
// });

module.exports.User 			= User;
module.exports.Triplet 			= Triplet;
module.exports.VersionControl 	=  VersionControl;

