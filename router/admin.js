var express=require('express');
var router=express.Router();
var Book= require('../models/book');
var Student=require('../models/student');
var Worker=require('../models/worker');
var Level=require('../models/level');
var History=require('../models/history');

router.use(function(req, res, next) {
    if (req.userInfo.usertype!='admin') {
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以访问此页面');
        return;
    }
    next();  
});
router.get('/',function(req,res,next){
	res.render('admin/index',{userInfo:req.userInfo});
});
//图书列表
router.get('/book',function(req,res,next){
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
        res.render('admin/book_index',{
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
//图书修改
router.get('/book/edit',function(req,res,next){
	var bid=req.query.id||'';
	Book.findOne({
        _id: bid
    }).then(function(book){
		if (!book) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        } else {
            res.render('admin/book_edit', {
                userInfo: req.userInfo,
                book: book
            });
	    }
	})				
});
//保存图书修改
router.post('/book/edit', function(req, res) {
    var id = req.query.id || '';

    if ( req.body.bookname == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '书名不能为空'
        })
        return;
    }
    if ( req.body.category == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '类别不能为空'
        })
        return;
    }
    if ( req.body.publish == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '出版社不能为空'
        })
        return;
    }
    if ( req.body.writer== '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '作者不能为空'
        })
        return;
    }
    Book.update({
        _id: id
    }, {
    	bookname:req.body.bookname,
        category: req.body.category,
        publish: req.body.publish,
        writer: req.body.writer,
        state: req.body.state
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/book'
        })
    });
});
//图书删除
router.get('/book/delete', function(req, res) {
    var id = req.query.id || '';
    Book.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/book'
        });
    });
});
//借阅记录
router.get('/history', function(req, res) {
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

        History.find().limit(limit).skip(skip).populate(['user','book']).then(function(histories){
        res.render('admin/history_index',{
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
//学生用户列表
router.get('/student',function(req,res,next){
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    Student.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        Student.find().limit(limit).skip(skip).populate('level').then(function(students){
        res.render('admin/student_index',{
                    userInfo:req.userInfo,
                    students:students,
                    count: count,
                    pages: pages,
                    limit: limit,
                    page: page
                });
            });                 
    });
});
//工作人员列表
router.get('/worker',function(req,res,next){
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    Worker.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        Worker.find().limit(limit).skip(skip).then(function(workers){
        res.render('admin/worker_index',{
                    userInfo:req.userInfo,
                    workers:workers,
                    count: count,
                    pages: pages,
                    limit: limit,
                    page: page
                });
            });                 
    });
});

//学生用户修改
router.get('/student/edit',function(req,res,next){
    var id=req.query.id||'';
    //获取要修改的信息
    var levels = [];
    Level.find().sort({_id: 1}).then(function(rs) {
        levels = rs;
        return Student.findOne({
        _id:id
        }).populate("level");
    }).then(function(student){
        if(!student){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'用户不存在'
            })
        }
        else{
            res.render('admin/student_edit',{
                userInfo:req.userInfo,
                student:student,
                levels:levels
            });
        }
    })              
});
//工作人员用户修改
router.get('/worker/edit',function(req,res,next){
    var id=req.query.id||'';
    //获取要修改的信息
    Worker.findOne({
        _id:id
    }).then(function(worker){
        if(!worker){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'用户不存在'
            })
        }
        else{
            res.render('admin/worker_edit',{
                userInfo:req.userInfo,
                worker:worker
            });
        }
    })              
});
//保存学生用户修改
router.post('/student/edit',function(req,res){
    var id=req.query.id||'';
    if(req.body.username==''){
        res.render('admin/error',{
                userInfo:req.userInfo,
                message:'用户名不能为空',
            });
        return;
    }
    if(req.body.password==''){
        res.render('admin/error',{
                userInfo:req.userInfo,
                message:'密码不能为空',
            });
        return;
    }
    if(req.body.password.length<6){
        res.render('admin/error',{
                userInfo:req.userInfo,
                message:'密码不能小于六位',
            });
        return;
    }
    Student.update(
    {_id:id},{
        username:req.body.username,
        password:req.body.password,
        tel:req.body.tel,
        level:req.body.level
    }).then(function(){
        res.render('admin/success',{
                userInfo:req.userInfo,
                message:'修改成功',
                url:"/admin/student"
            });
    }); 
});
//保存工作人员修改
router.post('/worker/edit',function(req,res){
    var id=req.query.id||'';
    if(req.body.username==''){
        res.render('admin/error',{
                userInfo:req.userInfo,
                message:'用户名不能为空',
            });
        return;
    }
    if(req.body.password==''){
        res.render('admin/error',{
                userInfo:req.userInfo,
                message:'密码不能为空',
            });
        return;
    }
    if(req.body.password.length<6){
        res.render('admin/error',{
                userInfo:req.userInfo,
                message:'密码不能小于六位',
            });
        return;
    }
    Worker.update(
    {_id:id},{
        username:req.body.username,
        password:req.body.password,
        tel:req.body.tel
    }).then(function(){
        res.render('admin/success',{
                userInfo:req.userInfo,
                message:'修改成功',
                url:"/admin/worker"
            });
    }); 
});
//学生用户删除
router.get('/student/delete', function(req, res) {
    var id = req.query.id || '';
    Student.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/student'
        });
    });
});
//工作人员用户删除
router.get('/worker/delete', function(req, res) {
    var id = req.query.id || '';
    Worker.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/worker'
        });
    });
});
//学生用户添加
router.get('/student/add', function(req, res) {
    Level.find().sort({_id: 1}).then(function(levels) {
        res.render('admin/student_add', {
            userInfo: req.userInfo,
            levels:levels
         });
    })
});
//工作人员添加
router.get('/worker/add', function(req, res) {
    res.render('admin/worker_add', {
        userInfo: req.userInfo
     });
});
//保存学生用户添加
router.post('/student/add',function(req, res){
    var username=req.body.username;
    var password=req.body.password;
    //用户名不能为空
    if(username==''){
       res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return;
    }
    if(password==''){
       res.render('admin/error', {
            userInfo: req.userInfo,
            message: '密码不能为空'
        });
        return;
    }
    if(password.length<6){
    res.render('admin/error', {
            userInfo: req.userInfo,
            message: '密码不能小于六位'
        });
        return;
    }
    Student.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            //表示数据库中有该记录
            res.render('admin/error', {
            userInfo: req.userInfo,
            message: '用户名已经被使用了'
            });
        return Promise.reject();
        }else{
            return new Student({
            username:username,
            password:password,
            tel:req.body.tel,
            level:req.body.level
        }).save()
        }
    }).then(function(newUserInfo){
        res.render('admin/success',{
                userInfo:req.userInfo,
                message:'添加成功',
                url:"/admin/student"
         });
    })  
});


//保存工作人员添加
router.post('/worker/add',function(req, res){
    var username=req.body.username;
    var password=req.body.password;
    //用户名不能为空
    if(username==''){
       res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return;
    }
    if(password==''){
       res.render('admin/error', {
            userInfo: req.userInfo,
            message: '密码不能为空'
        });
        return;
    }
    if(password.length<6){
    res.render('admin/error', {
            userInfo: req.userInfo,
            message: '密码不能小于六位'
        });
        return;
    }
    Worker.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            //表示数据库中有该记录
            res.render('admin/error', {
            userInfo: req.userInfo,
            message: '用户名已经被使用了'
            });
        return Promise.reject();
        }else{
            return new Worker({
            username:username,
            password:password,
            tel:req.body.tel
        }).save()
        }
    }).then(function(newUserInfo){
        res.render('admin/success',{
                userInfo:req.userInfo,
                message:'添加成功',
                url:"/admin/worker"
         });
    })  
});
//图书删除
router.get('/book/delete', function(req, res) {

    //获取要删除的分类的id
    var id = req.query.id || '';

    Book.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/book'
        });
    });

});
//图书添加
router.get('/book/add', function(req, res) {
        res.render('admin/book_add', {
            userInfo: req.userInfo
         })
});
//保存图书添加
router.post('/book/add',function(req, res){
    var bookname=req.body.bookname;
    var category=req.body.category;
    var publish=req.body.publish;
    var writer=req.body.writer;
    //图书任一信息不能为空
    if(bookname==""||category==""||publish==""||writer==""){
       res.render('admin/error', {
            userInfo: req.userInfo,
            message: '图书信息不完整，请补充完整'
        });
        return;
    } 
    var book=new Book({
            bookname:bookname,
            category:category,
            publish:publish,
            writer:writer,
            state:'可借'
        }).save();   
    book.then(function(newUserInfo){
        res.render('admin/success',{
                userInfo:req.userInfo,
                message:'添加成功',
                url:"/admin/book"
         });
    });
     });
module.exports=router;