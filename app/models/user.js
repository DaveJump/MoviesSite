var mongoose = require('mongoose');
//模式的编译
var UserSchema = require('../schemas/User');
var User = mongoose.model('User',UserSchema);

//暴露编译后的模型
module.exports = User;
