var mongoose=require('mongoose');
//工作人员的表结构
module.exports=new mongoose.Schema({
	//用户名
	username:String,
	//密码
	password:String,
	//电话
	tel:{
		type:String,
		default:''
	}
})
