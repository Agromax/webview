var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressWs = require('express-ws')(app);
var crypto = require('crypto');

var models = require('./lib/models');
var vcRoute = require('./routes/vcRoutes.js');
var userRoute = require('./routes/userRoutes.js');
var appRoutes = require('./routes/appRoutes.js');


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
app.use('/app', appRoutes);


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
	res.redirect('/app');
});

app.listen(3000);