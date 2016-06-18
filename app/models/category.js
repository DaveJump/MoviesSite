var mongoose = require('mongoose');
//模式的编译
var CategorySchema = require('../schemas/category');
var Category = mongoose.model('Category',CategorySchema);

//暴露编译后的模型
module.exports = Category;
