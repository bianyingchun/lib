var mongoose=require('mongoose');
var adminsSchema=require('../schemas/admins');
module.exports=mongoose.model('admin',adminsSchema);