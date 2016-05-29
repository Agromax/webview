// Custom imports
var schema = require('../lib2/schema');

// Standard file imports
var path   		= require('path');
var fs 	   		= require('fs');
const readline 	= require('readline');


// Declaration of global variables
var VC 		= schema.VersionControl;
var Triplet = schema.Triplet;



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

main();