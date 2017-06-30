$(function(){
	var $login=$('#login');
	var $reg=$('#reg');
	var $userinfo=$("#userinfo");
//切换到注册面板
	$login.find('span').on('click',function(){
		$reg.show();
		$login.hide();
	})
//切换到登录面板
	$reg.find('span').on('click',function(){
		$reg.hide();
		$login.show();
	})
//注册
$reg.find('.btn').on('click', function() {
		$.ajax({
			url: '/api/user/register',
			type: 'post',
			dataType: 'json',
			data: {
				username:$reg.find('[name="username"]').val(),
				password:$reg.find('[name="password"]').val(),
				repassword:$reg.find('[name="repassword"]').val(),
			},
			success:function(result){
				$reg.find('.colWarning').html(result.message);
				if(!result.code){
					//注册成功
					setTimeout(function(){
						$reg.hide();
						$login.show();	
					}, 1000);
				}
			},
			error:function(){
				
			}
		})	
	});
//登录
	$login.find('.btn').on('click', function(){
		$.ajax({
			url: '/api/user/login',
			type: 'post',
			dataType: 'json',
			data: {
				username:$login.find('[name="username"]').val(),
				password:$login.find('[name="password"]').val(),
				usertype:$login.find(':checked').val()
			},
			success:function(result){
				$login.find('.colWarning').html(result.message);
				if(!result.code){
					if($login.find(':checked').val()=='student'){
					   window.location.replace('/student');
					}
					else if($login.find(':checked').val()=='worker'){
					
						window.location.replace('/worker');
					}
					else{
						window.location.replace('/admin');
					}
				}
			},
		})	
	});
	
})