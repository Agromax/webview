var path = require('path');
var Schema = require('../lib2/schema');
var fs = require('fs');
const readline = require('readline');

var Triplet = Schema.Triplet;
var VC = Schema.VersionControl;


function upload(filePath) {

	fs.readFile(filePath, function(err, data) {
		var json = JSON.parse(data.toString());
		var triplets = [];

		json.triplets.forEach(function(t) {
			var triple = new Triplet({
				sub: t.sub,
				pre: t.pre,
				obj: t.obj
			});
			triple.save(function(err, savedTriple) {
				console.warn(savedTriple);
			});

			triplets.push(triple);
		});


		var version = new VC({
			desc: 'Initial version',
			ts: Date.now(),
			triplets: triplets
		});
		version.save(function(err, c) {
			if(err) {
				console.warn('Could not save the verison');
				return;
			}
			console.log('Created a new version with id: ' + c.id);
		});
	});
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Name of the file: ', (answer) => {
	upload(path.join(__dirname, "json_data", answer));
  	rl.close();
});

// upload(path.join(__dirname, "json_data", "ricey.json"));

