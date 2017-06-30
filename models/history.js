var mongoose=require('mongoose');
var historiesSchema=require('../schemas/histories');
module.exports=mongoose.model('history',historiesSchema);