var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
var _ = require('underscore');

module.exports = function(app){

	//用户session预处理
	app.use(function(req,res,next){
		var _user = req.session.user;
		app.locals.user = _user;
		next();
	});


	//前端首页列表
	app.get('/',Index.index);


	//电影详细信息页
	app.get('/movie/:id',Movie.detail);
	//后台录入页
	app.get('/admin/movie/new',User.signInRequired,User.adminRequired,Movie.new);
	//后台更新操作
	app.post('/admin/movie',User.signInRequired,User.adminRequired,Movie.savePoster,Movie.save);
	//更新电影信息页
	app.get('/admin/movie/update/:id',User.signInRequired,User.adminRequired,Movie.update);
	//后台电影列表
	app.get('/admin/movie/list',User.signInRequired,User.adminRequired,Movie.list);
	//删除记录
	app.delete('/admin/movie/list',User.signInRequired,User.adminRequired,Movie.del);


	//用户注册
	app.post('/user/signUp',User.signUp);
	//用户列表
	app.get('/admin/user/list',User.signInRequired,User.adminRequired,User.list);
	//用户登录
	app.post('/user/signIn',User.signIn);
	//用户登出
	app.get('/logout',User.logout);


	//评论
	app.post('/user/comment',User.signInRequired,Comment.save);


	//分类录入
	app.get('/admin/movie/category/new',User.signInRequired,User.adminRequired,Category.new);
	//分类保存
	app.post('/admin/movie/category',User.signInRequired,User.adminRequired,Category.save);
	//分类列表
	app.get('/admin/movie/category/list',User.signInRequired,User.adminRequired,Category.list)


	//查询和分页
	app.get('/results',Index.search);

}