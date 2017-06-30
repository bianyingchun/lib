var mongoose=require('mongoose');
//管理人员的表结构
module.exports=new mongoose.Schema({
	//等级
	leveltype:String,
	//
	fine:Number,
	//
	limit:Number
})