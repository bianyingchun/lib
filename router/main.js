var express=require('express');
var router=express.Router();
//通用数据
var data={};
router.use(function(req,res,next){
	data={
		userInfo:req.userInfo
	}
	next();
	});
router.get('/',function(req,res,next){
	if(req.userInfo.usertype=='student'){
		res.render('student/index',data);
	}else if(req.userInfo.usertype=='worker'){
		res.render('worker/index',data);
	}else if(req.userInfo.usertype=='admin'){
		res.render('admin/index',data);
	}else{
		res.render('main/index');
	}
	
})
//退出
router.get('/logout', function(req, res) {
    req.cookies.set('userInfo', null);
    res.render('main/index');
});
module.exports=router;