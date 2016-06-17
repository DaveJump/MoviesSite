var User = require('../models/user');

//用户注册
exports.signUp = function(req,res){
	var _user = req.body.user;
	var userModel = new User(_user);

	User.findOne({name: _user.name},function(err,user){
		if(err) console.log(err);
		if(user){
			res.redirect('/');
		}else{
			userModel.save(function(err,user){
				if(err) console.log(err);
				res.redirect('/admin/user/list');
			});
		}
	});
}

//用户列表
exports.list = function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title: '用户列表',
			users: users
		});
	});
}

//用户登录
exports.signIn = function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var pwd = _user.password;

	User.findOne({name: name},function(err,user){
		if(err) console.log(err);
		if(!user) return res.redirect('/');
		user.comparePassword(pwd,function(err,isMatch){
			if(err) console.log(err);
			if(isMatch){
				req.session.user = user;
				return res.redirect('/');
			}else{
				console.log('password is not matched!');
			}
		});
	});
}

//用户登出
exports.logout = function(req,res){
	delete req.session.user;
	//delete app.locals.user;
	res.redirect('/');
}


//用户登录中间件
exports.signInRequired = function(req,res,next){
	var user = req.session.user;
	if(!user)
		return res.redirect('/');
	next();
}

//管理员中间件
exports.adminRequired = function(req,res,next){
	var user = req.session.user;
	if(user.role <= 10)
		return res.redirect('/');
	next();
}