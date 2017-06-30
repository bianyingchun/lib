var mongoose=require('mongoose');
//内容的表结构
module.exports=new mongoose.Schema({
	//关联字段—学生
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'student'
	},
	//关联字段-图书
	book:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'book'
	},
	//借阅时间
	btime:{
		type:Date,
		default:new Date()
	},
	//归还时间
	rtime:{
		type:Date,
		default:new Date(0000,0,0,8,0,0)
	}
	
		
})