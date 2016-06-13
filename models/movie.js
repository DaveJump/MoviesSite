var mongoose = require('mongoose');
//模式的编译
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie',MovieSchema);

//暴露编译后的模型
module.exports = Movie;
