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

userSchema.methods.getToken = function() {
	var expiresAt = Date.now() + 60 * 60 * 24 * 1000
	return {
		token: random.hex(16),
		expires: expiresAt
	};
};
userSchema.methods.isValidToken = function(token) {
	if(this.token === token && Date.now() < this.expires) {
		return true;
	}
	return false;
};


var tripletSchema = new Schema({
	sub: String,
	obj: String,
	pre: String,
	grades: [{
		user: Schema.Types.ObjectId,
		value: Number
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

