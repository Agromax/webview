var path = require('path');
var fs = require('fs');
var models = require('./models');
var random = require("random-js")(); // uses the nativeMath engine

/*
fs.readFile(path.join(__dirname, "horse_data.json"), function(err, data) {
	if(err) {
		console.log(err);
		return;
	}

	var horses = JSON.parse(data);
	var Horse = models.Horse;

	horses.forEach(function(h) {
		Horse.create(h).then(function(hor) {
			console.log(hor.id);
		});
	});
});
*/


function createRace() {
	var Horse = models.Horse;
	var horseCount = random.integer(7, 12);

	var raceLocation = random.pick(["lucknow", "kanpur", "delhi", "jaipur", "gurugram", "bangaluru"]);

	Horse.all().then(function(horses) {
		random.shuffle(horses);
		var selectedHorses = [];
		for(var i=0; i<horseCount; i++) {
			selectedHorses.push(horses[i]);
		}

		models.Race.create({
			startsAt: (Date.now() + 7 * 60 * 1000),
			location: raceLocation
		}).then(function(race) {
			if(race) {
				selectedHorses.forEach(function(horse) {
					models.Participants.create({
						raceId: race.id,
						horseId: horse.id
					});
				});
			} else {
				console.log("Could not create the race. Try again");
			}
		});

	});
}

createRace();