var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	role: {
		type: Number,
		default: 0
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

//保存数据之前的操作
UserSchema.pre('save',function(next){
	var user = this;
	//判断数据是否为新的(即数据库当中有没有该数据)
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err) return next(err);
		bcrypt.hash(user.password,salt,null,function(err,hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

//设置schema实例的静态方法
UserSchema.statics = {
	//查询所有数据按更新时间排序,并执行回调函数
	fetch: function(callback){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(callback);
	},

	//根据id查询单条数据
	findById: function(id,callback){
		return this
			.find({_id: id})
			.sort('meta.updateAt')
			.exec(callback);
	}
}

//实例方法
UserSchema.methods = {
	comparePassword: function(_password,callback){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err) return callback(err);
			callback(null,isMatch);
		});
	}
}

//暴露schema实例
module.exports = UserSchema;