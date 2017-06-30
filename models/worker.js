var mongoose=require('mongoose');
var workersSchema=require('../schemas/workers');
module.exports=mongoose.model('worker',workersSchema);