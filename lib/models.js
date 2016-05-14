var Sequelize = require('sequelize');

var sequelize = new Sequelize('betgame', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var User = sequelize.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
    	type: Sequelize.STRING,
    	allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});


var Wallet = sequelize.define('wallet', {
	balance: {
		type: Sequelize.INTEGER,
		validate: {
			min: 0,
			max: 10000000
		}
	}
});

Wallet.belongsTo(User);


var Horse = sequelize.define('horse', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	totalRuns: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	totalWins: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	minBet: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		validate: {
			min: 0,
			max: 100000
		}
	},
	payoff: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		validate: {
			min: 0,
			max: 100000
		}
	}
});


var Race = sequelize.define('race', {
	winnerHorseId: {
		type: Sequelize.INTEGER,
		defaultValue: null
	},
	startsAt: {
		type: Sequelize.BIGINT.UNSIGNED
	},
	location: {
		type: Sequelize.STRING
	},
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	}
});


var Stakeholders = sequelize.define('stakeholders', {
	userId: {
		type: Sequelize.INTEGER
	},
	raceId: {
		type: Sequelize.INTEGER
	},
	horseId: {
		type: Sequelize.INTEGER
	},
	betAmount: {
		type: Sequelize.INTEGER
	}
});


var Participants = sequelize.define('participants', {
	raceId: {
		type: Sequelize.INTEGER
	},
	horseId: {
		type: Sequelize.INTEGER
	}
});


var Analytics = sequelize.define('analytics', {
	raceId: {
		type: Sequelize.INTEGER
	},
	inflow: {
		type: Sequelize.INTEGER
	},
	outflow: {
		type: Sequelize.INTEGER
	}
});


sequelize.sync();


module.exports.User = User;
module.exports.Wallet = Wallet;
module.exports.Horse = Horse;
module.exports.Race = Race;
module.exports.Stakeholders = Stakeholders;
module.exports.Participants = Participants;
module.exports.Analytics = Analytics;


