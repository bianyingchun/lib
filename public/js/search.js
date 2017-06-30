$(function(){

   search($('#student_book'));
   search($('#student_history'));
	//借阅查找
    search($('#admin_history'));
    //用户查找
    search($('#admin_student'));
    search($('#admin_worker'));
    //图书查找
    search($('#admin_book'));
    function search($div){
      $div.find('.btn-info').click(function(){
        var value=$div.find('.search').val();
        var type_index=$div.find('.search_type').find(':selected').index();
        var $tr=$div.parent().find('tbody>tr');
        $.each($tr,function(index,tr){
           var filter=$(this).find('td').eq(type_index).html();
           if(filter==value){
            $(this).show();
           }else{
            $(this).hide();
           }
        })
    });  
    }
})