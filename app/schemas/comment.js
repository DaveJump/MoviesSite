var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
	movie: {
		type: ObjectId,
		ref: 'Movie'
	},
	from: {
		type: ObjectId,
		ref: 'User'
	},
	reply: [
		{
			from: {
				type: ObjectId,
				ref: 'User'
			},
			to: {
				type: ObjectId,
				ref: 'User'
			},
			content: String
		}
	],
	content: String,
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
CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

//设置schema实例的静态方法
CommentSchema.statics = {
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
			.findOne({_id: id})
			.sort('meta.updateAt')
			.exec(callback);
	}
}

//实例方法
CommentSchema.methods = {
	
}

//暴露schema实例
module.exports = CommentSchema;