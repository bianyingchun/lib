var mongoose=require('mongoose');
var studentsSchema=require('../schemas/students');
module.exports=mongoose.model('student',studentsSchema);
