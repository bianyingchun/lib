var express=require('express');
var router=express.Router();
var Student=require('../models/student');
var Level=require('../models/level');
var History=require('../models/history');
var Book=require('../models/book');
var data={};
router.use(function(req, res, next) {
    if (req.userInfo.usertype!='student') {
        //如果当前用户不是学生
        res.send('对不起，只有学生才可以访问此页面');
        return;
    }
    data={
		userInfo:req.userInfo
	}
	next();
});
router.get('/',function(req,res,next){
	res.render('student/index',{
		userInfo:req.userInfo
	});
});
//个人中心
router.get('/selfinfo',function(req,res,next){
	var id=req.query.id||'';
	//获取要修改的信息
	Student.findOne({
		_id:id
	}).populate("level").then(function(userinfo){
		if(!userinfo){
			res.render('student/error',{
				userInfo:req.userInfo,
				message:'用户不存在'
			})
		}
		else{
			data.password=userinfo.password;
			data.tel=userinfo.tel;
			data.level=userinfo.level.leveltype;
			res.render('student/selfinfo',data);
		}
	})
})
//个人中心，修改学生信息
router.post('/selfinfo',function(req,res){
	var id=req.query.id||'';
	if(req.body.uname==''){
		res.render('student/error',{
				userInfo:req.userInfo,
				message:'用户名不能为空',
			});
		return;
	}
	if(req.body.upassword==''){
		res.render('student/error',{
				userInfo:req.userInfo,
				message:'密码不能为空',
			});
		return;
	}
	//修改cookie信息
	req.cookies.set('userInfo',JSON.stringify({
			id:id,
			username:req.body.uname,
			usertype:'student'
		}));
	//更新数据库
	Student.update(
	{_id:id},{
		username:req.body.uname,
		password:req.body.upassword,
		tel:req.body.tel
	}).then(function(){
		res.render('student/success',{
				userInfo:req.userInfo,
				message:'修改成功',
				url:"/student"
			});
	});	
})
//图书查询
router.get('/books',function(req,res,next){
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    Book.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        Book.find().limit(limit).skip(skip).then(function(books){
        res.render('student/books',{
                    userInfo:req.userInfo,
                    books:books,
                    count: count,
                    pages: pages,
                    limit: limit,
                    page: page
                });
            });					
    });
});
//借阅历史查询
router.get('/histories', function(req, res) {
	var id=req.query.id||'';
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    History.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        History.find({user:id}).limit(limit).skip(skip).populate(['user','book']).then(function(histories){
        res.render('student/historys',{
                userInfo:req.userInfo,
                histories:histories,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });                 
    });	
});

module.exports=router;