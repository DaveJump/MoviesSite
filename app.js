var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var port = 3000;
var app = express();
var dbUrl = 'mongodb://localhost/MoviesSite';
//链接本地mongodb
mongoose.connect(dbUrl);

app.set('views','./app/views/pages');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	secret: 'MoviesSite',
	store: new mongoStore({
		url: dbUrl,
		colletion: 'sessions'
	})
}));

if('development' === app.get('env')){
	app.set('showStackError',true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

app.set('view engine','jade');
app.locals.moment = require('moment');
app.listen(port);

console.log('server runing at port: ' + port);

require('./config/routes')(app);