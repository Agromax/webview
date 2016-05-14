var models = require('./models');
var random = require("random-js")(); // uses the nativeMath engine
var Promise = require('promise');


function handlePaycheck(race, winner) {
	models.Stakeholders.findAll({where: {raceId: race.id}}).then(function(stakeholders) {
		if(stakeholders) {
			var totalInflow = 0;
			var totalOutflow = 0;
			var stakePromises = [];

			stakeholders.forEach(function(sh) {
				var tickets = sh.betAmount;
				if(sh.horseId === winner.id) {
					totalOutflow += winner.payoff * tickets;
					models.Wallet.findOne({where: {userId: sh.userId}}).then(function(wallet) {
						if(wallet) {
							var currentBalance = wallet.balance;
							wallet.update({
								balance: currentBalance + winner.payoff * tickets
							});
						} else {
							console.log('No wallet found for user with id:' + sh.userId);
						}
					});
				}

				stakePromises.push(
					models.Horse.findOne({where: {id: sh.horseId}}).then(function(ch) {
						if(ch) {
							totalInflow += tickets * ch.minBet;
						} else {
							console.log('No horse with id:' + sh.horseId);
						}
					})
				);
			});

			Promise.all(stakePromises).then(function(r) {
				models.Analytics.create({
					raceId: race.id,
					inflow: totalInflow,
					outflow: totalOutflow
				});
			});

		} else {
			console.log('No stakeholders for the race with id:' + race.id);
		}
	});
}

function play(race, participants) {
	if(participants && participants.length > 0) {

		// Randomly select a winning horse
		var winner = random.pick(participants);

		console.log(winner.name + ' has been selected as the winner');

		race.update({
			active: false,
			winnerHorseId: winner.horseId
		}).then(function(uv) {
			// Update the horse stat
			// Transfer the funds
			models.Horse.findOne({where: {id: winner.horseId}}).then(function(horse) {
				var runs = horse.totalRuns;
				var wins = horse.totalWins;
				horse.update({
					totalRuns: runs + 1,
					totalWins: wins + 1
				}).then(function(uh) {
					handlePaycheck(race, uh);
				});
			});
		});
	}
}

function handleRace(race) {
	if(race.active) {
		var ct = Date.now();
		var raceTime = race.startsAt;
		if(ct >= raceTime) {
			models.Participants.findAll({where: {raceId: race.id}}).then(function(ps) {
				if(ps && ps.length > 0) {
					play(race, ps);
				} else {
					console.log('No participants for the race with id=' + race.id + ' found');
				}
			});
		}
	}
}


function initiate() {
	models.Race.findAll({where: {active: true}}).then(function(races) {
		if(races) {
			console.log(races.length + ' race[s] found');
			races.forEach(function(race) {
				handleRace(race);
			});
		}
	});
}


setInterval(initiate, 2000);