var mongoose = require('mongoose');
//模式的编译
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('Comment',CommentSchema);

//暴露编译后的模型
module.exports = Comment;
