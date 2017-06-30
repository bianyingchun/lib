var mongoose=require('mongoose');
var levelsSchema=require('../schemas/levels');
module.exports=mongoose.model('level',levelsSchema);