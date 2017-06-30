var express=require('express');
var swig=require('swig');
//加载数据库模块
var mongoose=require('mongoose');
//加载body-parser,用来处理post提交过来的数据
var bodyParser=require('body-parser');
//加载cookies模块
var Cookies=require('cookies');
var app=express();
//设置静态文件托管
app.use('/public',express.static(__dirname+'/public'));
//定义模板引擎
//第一个参数：模板引擎的名称，同时也是模板引擎的扩展名
//第二个参数：表示用于解析处理模板引擎内容的方法
app.engine('html',swig.renderFile);
//设置模板引擎文件存放的目录，第一个参数为views，第二个参数是目录
app.set('views','./views');
//注册所使用的模板引擎，参数二必须与engine定义的模板引擎名一致。
app.set('view engine','html');
//默认有缓存机制，需要取消缓存
swig.setDefaults({cache:false});
//bodyparser中间件设置
app.use(bodyParser.urlencoded({extended:true}));
//设置cookies，对所有路由使用此中间件。
app.use(function(req,res,next){
	req.cookies=new Cookies(req,res);
	//解析用户登录的cookies
	//将userInfo对象添加到req对象中
	req.userInfo={};
	if(req.cookies.get('userInfo')){
		try{
		req.userInfo=JSON.parse(req.cookies.get('userInfo'));
			next();	
		}catch(e){
			next();
		}
	}
	else{
	 next();	
	}	
})
//分配路由
app.use('/student',require('./router/student'));
app.use('/worker',require('./router/worker'));
app.use('/admin',require('./router/admin'));
app.use('/api',require('./router/api'));
app.use('/',require('./router/main'));
app.listen(8025);
//连接数据库
mongoose.connect('mongodb://localhost:27019/blog',function(err){
	if(err){
		console.log('数据库连接失败！');
 	}
 	else{
 		console.log('数据库连接成功');	
 	}
});
