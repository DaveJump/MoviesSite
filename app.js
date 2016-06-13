var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');
var port = 3000;
var app = express();

//链接本地mongodb
mongoose.connect('mongodb://localhost/MoviesSite');

app.set('views','./views/pages');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','jade');
app.locals.moment = require('moment');
app.listen(port);

console.log('server runing at port: ' + port);

//前端首页列表
app.get('/',function(req,res){
	//模型的fetch方法
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}

		res.render('index',{
			title: '首页',
			movies: movies
		});
	});
});

//电影详细信息页
app.get('/movie/:id',function(req,res){
	var id = req.params.id;

	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title: movie[0].title,
			movie: movie
		/*{
				title: '机械战警',
				director: '何仙姑',
				country: '美国',
				release_date: 2014,
				poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
				language: '英语',
				flash: 'http://player.youku.com/player.php/sid/XNkA1Njc0NTUy/v.swf',
				summary: '《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。'
			}*/
		});
	});
});

//后台录入页
app.get('/admin/new',function(req,res){
	res.render('admin',{
		title: '电影录入',
		movie: [
			{
				title: '',
				director: '',
				country: '',
				release_date: '',
				poster: '',
				flash: '',
				summary: '',
				language: ''
			}
		]
	});
});

//后台更新操作
app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie[0]._id;
	var movieObj = req.body.movie[0];
	var _movie;

	//如果存在id,则证明该条电影详细信息数据存在于数据库中，此时就要执行更新操作
	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			//用underscore模块的extend_API替换掉旧数据
			_movie = _.extend(movie[0],movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/list');
			});
		});

	}else{
		_movie = new Movie({
			title: movieObj.title,
			director: movieObj.director,
			country: movieObj.country,
			language: movieObj.language,
			release_date: movieObj.release_date,
			summary: movieObj.summary,
			flash: movieObj.flash,
			poster: movieObj.poster
		});

		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/list');
		});
	}
});

//更新电影信息页
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title: '电影信息更新',
				movie: movie
			});
		});
	}
});

//后台电影列表
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title: '电影列表',
			movies: movies
		});
	});
});

//删除记录
app.delete('/admin/list',function(req,res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id: id},function(err,movie){
			if(err){
				console.log(err);
			}else{
				res.json({success: 1});
			}
		});
	}
});