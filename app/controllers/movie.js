var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');

//电影详细信息页
exports.detail = function(req,res){
	var id = req.params.id;

	Movie.findById(id,function(err,movie){
		Comment
			.find({movie: id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err,comments){
				console.log(comments)
				res.render('detail',{
					title: movie.title,
					movie: movie,
					comments: comments
				});
			});
	});
}

//后台录入页
exports.new = function(req,res){
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
}

//后台更新操作
exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	//如果存在id,则证明该条电影详细信息数据存在于数据库中，此时就要执行更新操作
	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			//用underscore模块的extend_API替换掉旧数据
			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/admin/list');
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
			res.redirect('/admin/list');
		});
	}
}

//更新电影信息页
exports.update = function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title: '电影信息更新',
				movie: movie
			});
		});
	}
}

//后台电影列表
exports.list = function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title: '电影列表',
			movies: movies
		});
	});
}

//删除记录
exports.del = function(req,res){
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
}