var express=require('express');
var router=express.Router();
var Student=require('../models/student');
var Book=require('../models/book');
var History=require('../models/history');
var Level=require('../models/level');
var data={};
router.use(function(req, res, next) {
    if (req.userInfo.usertype!='worker') {
        //如果当前用户不是工作人员
        res.send('对不起，只有工作人员才可以访问此页面');
        return;
    }
    data={
		userInfo:req.userInfo
	}
	next();
});
router.get('/',function(req,res,next){
	res.render('worker/index',data);
});
router.get('/lent_book',function(req,res,next){
	res.render('worker/lent_book',data);
});
//借阅图书
router.post('/lent_book',function(req,res,next){
	var bid=req.body.bookid.toString()||'';
	var uname=req.body.uname;
	var userid;
	if(req.body.uname==''){
		res.render('worker/error',{
			userInfo:req.userInfo,
			message:''
		})
		return;
	}
	if(req.body.bookid==''){
		res.render('worker/error',{
				userInfo:req.userInfo,
				message:'图书编号不能为空'
			});
		return;
	}
	Student.findOne({'username':uname},function(err,udoc){
			if(!udoc){
				res.render('worker/error',{
				userInfo:req.userInfo,
				message:'用户不存在!'
				});
			}else{
				userid=udoc.id;
				Book.findById(bid,function(err,bdoc){
					if(!bdoc){
						res.render('worker/error',{
						userInfo:req.userInfo,
						message:'图书不存在!'
					});
					}else{
						if(bdoc.get('state')=='不可借'){
							res.render('worker/error',{
							userInfo:req.userInfo,
							message:'图书不可借!'
						});
						}else{
							bdoc.set('state','不可借');
							bdoc.save(function(err){
								new History({
			        			user:userid.toString(),
			        			book: bid
			   				 }).save(function(err){
			   				 	res.render('worker/success', {
						           userInfo: req.userInfo,
						           message: '图书借阅成功',
						           url: '/worker'
						       })
							})
						})
					}
				}
			})
		}
	})
})
router.get('/return_book',function(req,res,next){
	res.render('worker/return_book',data);
});
router.post('/return_book',function(req,res,next){
	var bid=req.body.rbookid.toString()||'';
	var uname=req.body.runame;
	var userid,levelid;
	if(uname==''){
		res.render('worker/error',{
			userInfo:req.userInfo,
			message:''
		})
		return;
	}
	if(bid==''){
		res.render('worker/error',{
				userInfo:req.userInfo,
				message:'图书编号不能为空!'
			});
		return;
	}
	Student.findOne({'username':uname},function(err,udoc){
			if(!udoc){
				res.render('worker/error',{
				userInfo:req.userInfo,
				message:'用户不存在!'
			})
			}else{
				userid=udoc._id.toString();
				levelid=udoc.level.toString();
				Book.findById(bid,function(err,bdoc){
					if(!bdoc){
						res.render('worker/error',{
						userInfo:req.userInfo,
						message:'图书不存在!'
					});
					}else{
						History.findOne({'user':userid,'book':bid},function(err,hdoc){
							if(!hdoc){
								res.render('worker/error',{
									userInfo:req.userInfo,
									message:'无借阅记录，请检查用户名和图书编号!'
								})
							}else{
								if(hdoc.get('rtime').getFullYear()!=1899){
									res.render('worker/error',{
									userInfo:req.userInfo,
									message:'无未归还记录，请检查用户名和图书编号!'
								})
								}else{
									hdoc.set('rtime',new Date());
									hdoc.save(function(err){
										Level.findOne({_id:levelid},function(err,ldoc){
											var t1=hdoc.get('rtime').getTime()/86400;
											var t2=hdoc.get('btime').getTime()/86400;
											var t=Math.max(0,t1-t2-ldoc.limit);
											var fine=t*ldoc.fine;
											Book.update({_id:bid},{state:'可借'},function(){
												res.render('worker/success',{
												userInfo:req.userInfo,
												message:'图书归还成功!   超时:'+t+'天'+'   罚金:'+fine+'元',
												url:'/worker'
												});
											 })
									    })
									})	
								}
								
							}
						})

					}
				})
			}
	});
});
module.exports=router;