var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressWs = require('express-ws')(app);
var crypto = require('crypto');

var models = require('./lib/models');
var vcRoute = require('./routes/vcRoutes.js');
var userRoute = require('./routes/userRoutes.js');


app.use(session({
	secret: 'keyboard cat',
  	resave: false,
  	saveUninitialized: true,
}));
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handles all the version controller API
app.use('/vc', vcRoute);
app.use('/users', userRoute);


app.get('/rdfui', function(req, res, next) {
	res.render('rdfui', {pageTitle: 'Let it rain over me'});
	if(next) {
		next();
	}
});


app.get('/dashboard', function(req, res, next) {
	res.render('dashboard', {pageTitle: 'Dashboard'});
	if(next) {
		next();
	}
});


app.get('/', function(req, res) {
	if(req.session.authToken) {
		models.Race.findAll({where: {active: true}}).then(function(races) {
			res.render('index', {
				pageTitle: 'Dashboard', 
				user: req.session.user,
				races: races 
			});
		});
	} else {
		res.render('enter', {pageTitle: 'Enter'});
	}
});

app.get('/logout', function(req, res) {
	req.session.authToken = null;
	res.redirect('/');
});

app.post('/signin', function(req, res) {
	var email = req.body.email;
	var pwd = req.body.pwd;

	var shaSum = crypto.createHash('sha1');
	shaSum.update(pwd);

	var User = models.User;

	User.findOne({
		where: {
			email: email,
			password: shaSum.digest('hex')
		}
	}).then(function(u) {
		if(u) {
			req.session.authToken = u.id;
			req.session.user = {name: u.name, id:u.id};
			res.redirect('/');
		} else {
			res.render('enter', {pageTitle: 'Enter', errorMessage: 'Email or Password do not match'});
		}
	});

});

app.post('/signup', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var pwd = req.body.pwd;

	if(!name) {
		res.render('enter', {pageTitle: 'Enter', errorMessage: 'Please enter your name'});
		return;
	}

	if(!email) {
		res.render('enter', {pageTitle: 'Enter', errorMessage: 'Please enter a valid email'});
		return;	
	}

	if(!pwd || pwd.length < 6) {
		res.render('enter', {pageTitle: 'Enter', errorMessage: 'Password length must be >= 6'});
		return;
	}

	var shaSum = crypto.createHash('sha1');
	shaSum.update(pwd);

	var User = models.User;

	User.findOne({
		where: {email: email}
	}).then(function(user) {
		if(user) {
			res.render('enter', {pageTitle: 'Enter', errorMessage: 'Email already in use'});
			return;
		} else {
			User.create({
				name: name,
				email: email,
				password: shaSum.digest('hex')
			}).then(function(user) {
				if(!user) {
					res.render('enter', {pageTitle: 'Enter', errorMessage: 'Something went wrong'});
					return;
				} else {
					req.session.authToken = user.id;
					req.session.user = {name: u.name, id: u.id};
					res.redirect('/');
				}
			});
		}
	});
});
 

app.listen(3000);