var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var port = 3000;
var app = express();
// var fs = require('fs');
var dbUrl = 'mongodb://localhost/MoviesSite';
//链接本地mongodb
mongoose.connect(dbUrl);

//models loading
/*var models_path = __dirname + '/app/models';
var walk = function(path){
	fs
		.readFileSync(path)
		.forEach(function(file){
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath)

			if(stat.isFile()){
				if(/(.*)\.(js|coffee)/.test(file)){
					require(newPath);
				}
			}else if(stat.isDirectory()){
				walk(newPath);
			}
		});
}

walk(models_path);
*/

app.set('views','./app/views/pages');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multipart());
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