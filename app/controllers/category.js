var Category = require('../models/category');


//后台分类录入页
exports.new = function(req,res){
	res.render('category_admin',{
		title: '电影分类录入',
		category: {}
	});
}

//后台更新操作
exports.save = function(req,res){
	var _category = req.body.category;
	var category = new Category(_category);

	category.save(function(err,category){
		if(err){
			console.log(err);
		}
		res.redirect('/admin/movie/category/list');
	});
	
}

//后台电影列表
exports.list = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err);
		}
		res.render('category_list',{
			title: '电影分类列表',
			categories: categories
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