var mongoose=require('mongoose');
//学生用户的表结构
module.exports=new mongoose.Schema({
	//用户名
	username:String,
	//密码
	password:String,
	//电话
	tel:{
		type:String,
		default:''
	},
	level:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'level'
	}
})
