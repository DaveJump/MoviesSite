var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

//电影详细信息页
exports.detail = function(req,res){
	var id = req.params.id;

	Movie.findById(id,function(err,movie){
		Movie.update({_id: id},{$inc: {pv: 1}},function(err){
			if(err) console.log(err);
		});
		
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
	Category.find({},function(err,categories){
		res.render('admin',{
			title: '电影录入',
			categories: categories,
			movie: {}
		});
	});
}

//海报上传
exports.savePoster = function(req,res,next){
	var posterData = req.files.poster;
	console.log(posterData)
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;

	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname,'../../','/public/upload/' + poster);

			fs.writeFile(newPath,data,function(){
				req.poster = poster;
				next();
			})
		});

	}else{
		next();
	}
}

//后台更新操作
exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(req.poster){
		movieObj.poster = req.poster;
	}

	//如果存在id,则证明该条电影详细信息数据存在于数据库中，此时就要执行更新操作
	if(id){
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
				res.redirect('/admin/movie/list');
			});
		});

	}else{
		_movie = new Movie(movieObj);

		var categoryId = _movie.category;

		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			Category.findById(categoryId,function(err,category){
				category.movies.push(movie._id);
				category.save(function(err,category){
					res.redirect('/admin/movie/list');
				});
			});
		});
	}
}

//更新电影信息页
exports.update = function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){
				res.render('admin',{
					title: '电影信息更新',
					movie: movie,
					categories: categories
				});
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