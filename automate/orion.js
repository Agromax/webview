// Custom imports
var schema = require('../lib2/schema');

// Standard file imports
var path   			= require('path');
var fs 	   			= require('fs');
const readline 		= require('readline');
var request 		= require('request');
var GitHubApi		= require('github');

// Declaration of global variables
var VC 		= schema.VersionControl;
var Triplet = schema.Triplet;


var github = new GitHubApi();
github.authenticate({
	type: 'basic',
	username: 'lunar-logan',
	password: 'd58cc999'
});














github.repos.getContent({
	user: 'Agromax',
	repo: 'triples',
	path: 'triples.json',
	ref: 'master'
}, function(err, data) {
	var base64Content = data['content'];
	var contentBuffer = new Buffer(base64Content, 'base64');

	// Parse the decode string to get the object
	var fileContent = JSON.parse(contentBuffer.toString());

	var createdAt = new Date(fileContent['ts']);

	// Search for any version created "at" or "after" the `createdAt` date
	VC.findOne({
		ts: {
			$gte: createdAt
		}
	}).exec(function(err, version) {
		if(err) {
			console.warn(err);
			return;
		}
		if(!version) {		// Version does not exists, lets create one
			fileContent['ts'] = createdAt;
			addToVersionControl(fileContent);
		} else {
			console.log('Version exists with id: ' + version.id);
		}
	});
});



function addToVersionControl(content) {
	var triplets = [];

	content.triplets.forEach(function(t) {
		triplets.push(
			new Triplet({
				sub: t.sub,
				pre: t.pre,
				obj: t.obj
			})
		);
	});

	var newVersion = new VC({
		desc: content.desc,
		ts: content.ts,
		triplets: triplets
	});
	newVersion.save(function(err, saved) {
		if(err) {
			console.warn(err);
			return;
		}
		console.log('New version created and saved successfully');
	});
}


function loadTriplets(filePath) {

	fs.readFile(filePath, function(err, data) {
		if(err) {
			console.log(err);
			return;
		}
		var obj = JSON.parse(data.toString());
		var triplets = [];

		obj.triplets.forEach(function(t) {
			triplets.push(
				new Triplet({
					sub: t.sub,
					pre: t.pre,
					obj: t.obj
				})
			);
		});

		var newVersion = new VC({
			ts: Date.now(),
			triplets: triplets
		});
		newVersion.save(function(err, saved) {
			if(err) {
				console.warn(err);
				return;
			}
			console.log('New version created and saved successfully');
		});
	});
}


function handleCommand(cmd, rl) {
	switch(cmd) {
		case 'help':
			console.log('List of commands: [load, help, quit]');
			break;
		case 'load':
			rl.question('[orion-cl] the file path: ', (p) => {
				loadTriplets(p);
			});
			break;
		case 'exit':
		case 'quit':
			rl.close();
			break;
		default:
			console.warn("Unknown command '" + cmd + "', you might want to use 'help'");
	}
}


function main() {
	const rl = readline.createInterface({
  		input: process.stdin,
  		output: process.stdout
	});

	rl.setPrompt('orion-cl> ');
	rl.prompt();

	rl.on('line', (line) => {
		handleCommand(line.trim(), rl);
		rl.prompt();
	}).on('close', () => {
		console.warn('Bye!');
		process.exit(0);
	});
}

// main();