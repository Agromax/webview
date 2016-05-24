var mongoose = require('mongoose');
var crypto = require('crypto');

// mongoose.connect('mongodb://localhost/rdfdb');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	name: String,
	loginArchives: [{ip: String, loc: String}]
});


var User = mongoose.model('User', userSchema);

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

module.exports.User = User;

