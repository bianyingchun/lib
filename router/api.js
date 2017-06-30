var express=require('express');
var router=express.Router();
var Student=require('../models/student');
var Worker=require('../models/worker');
var Admin=require('../models/admin');
var Book=require('../models/book');
var History=require('../models/history');
var Level=require('../models/level');
var moment = require('moment');
//统一返回格式
var responseData;
router.use(function(req,res,next){
	responseData={
		code:0,
		message:'',
	}
	next();
})
router.post('/user/register',function(req,res,next){
	var username=req.body.username;
	var password=req.body.password;
	var repassword=req.body.repassword;
	//用户名不能为空
	if(username==''){
		responseData.code=1;
		responseData.message='用户名不能为空';
		res.json(responseData);
		return;
	}
	if(password==''){
		responseData.code=2;
		responseData.message='密码不能为空';
	//将对象转为json 格式，返回给前端
		res.json(responseData);
		return;
	}
	if(password.length<6){
		responseData.code=3;
		responseData.message='密码不能小于六位';
//将对象转为json 格式，返回给前端
		res.json(responseData);
		return;
	}
	if(password!=repassword){
		responseData.code=4;
		responseData.message='两次输入的密码不一致';
		res.json(responseData);
		return;
	}
//用户名是否已经被注册，如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册了
	Student.findOne({
		username:username
	}).then(function(userInfo){
		if(userInfo){
			//表示数据库中有该记录
			responseData.code=5;
			responseData.message='用户名已经被注册了';
			res.json(responseData);
			return;
		}
		//保存数据到数据库中
		var student=new Student({
			username:username,
			password:password
		});
		return student.save();
	}).then(function(newUserInfo){
		responseData.message='注册成功';
		res.json(responseData);
	})	
});
//用户登录
router.post('/user/login',function(req,res,next){
	function check(usertype,typestr){
	usertype.findOne({
	username:username,
	password:password
	}).then(function(userInfo){
		if(!userInfo){
			//表示数据库中有该记录
			responseData.code=3;
			responseData.message='用户名或密码错误';
			res.json(responseData);
			return;
		}
		//用户名和密码是正确的		
		responseData.message='登录成功';
		responseData.userInfo={
		id:userInfo._id,
		username:userInfo.username
		};
		// 存储cookie,向浏览器发送cookie信息，以后每次访问该站点时，都会以头信息的方式发送给服务端，
		// 服务端来验证是否为登录状态

		req.cookies.set('userInfo',JSON.stringify({
			id:userInfo._id,
			username:userInfo.username,
			usertype:typestr
		}));
		res.json(responseData)
	});
	}
	var username=req.body.username;
	var password=req.body.password;
	var usertype=req.body.usertype;
	if(username==''||password==''){
		responseData.code=1;
		responseData.message='用户名和密码不能为空';
		res.json(responseData);
		return;
	}
	if(typeof usertype=='undefined'){
		responseData.code=2;
		responseData.message='请选择用户类型';
		res.json(responseData);
		return;
	}
	if(usertype=='student'){
		check(Student,'student');
	}else if(usertype=='admin'){
		check(Admin,'admin');
	}else if(usertype=='worker'){
		check(Worker,'worker');
	}

});

module.exports=router