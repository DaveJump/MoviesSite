var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	title: String,
	director: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	release_date: Number,
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
MovieSchema.pre('save',function(next){
	//判断数据是否为新的(即数据库当中有没有该数据)
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	//该静态方法不与数据库直接交互，只有被Model实例化后才会拥有并调用
	next();
});

//设置schema实例的静态方法
MovieSchema.statics = {
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

//暴露schema实例
module.exports = MovieSchema;