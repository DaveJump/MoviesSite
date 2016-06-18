var Movie = require('../models/movie');
var Category = require('../models/category');

//前端首页列表
exports.index = function(req,res){
	Category
		.find({})
		.populate({path: 'movies',options: {limit: 6}})
		.exec(function(err,categories){
			if(err)
				console.log(err);
			res.render('index',{
				title: '首页',
				categories: categories
			});
		});
}

exports.search = function(req,res){
	var cateId = req.query.cate;
	var q = req.query.q;
	var page = parseInt(req.query.p,10) || 0;
	var count = 6;
	var index = page * count;

	if(cateId){
		Category
			.find({_id: cateId})
			.populate({path: 'movies',select: 'title poster'})
			.exec(function(err,categories){
				if(err)
					console.log(err);
				
				var category = categories[0] || {};
				var movies = category.movies || [];
				var results = movies.slice(index,index + count);

				res.render('results',{
					title: '搜索结果',
					keyword: category.name,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					query: 'cate=' + cateId,
					movies: results
				});
			});

	}else{
		Movie
			.find({title: new RegExp(q + '.*','i')})
			.exec(function(err,movies){
				if(err)
					console.log(err);

				var results = movies.slice(index,index + count);

				res.render('results',{
					title: '搜索结果',
					keyword: '搜索：' + q,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					query: 'q=' + q,
					movies: results
				});
			})
	}
}