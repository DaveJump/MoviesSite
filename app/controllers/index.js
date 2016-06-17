var Movie = require('../models/movie');

//前端首页列表
exports.index = function(req,res){
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
}