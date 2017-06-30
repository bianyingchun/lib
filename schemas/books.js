var mongoose=require('mongoose');
//管理人员的表结构
module.exports=new mongoose.Schema({
	//书名
	bookname:String,
	//类别
	category:String,
	//出版社
	publish:String,
	//作者
	writer:String,
	//状态
	state:{
		type:String,
		default:"可借"
	}
})
