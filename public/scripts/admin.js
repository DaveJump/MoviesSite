$(function(){
	//删除
	$('.table').on('click','.del',function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type: 'DELETE',
			url: '/admin/list?id=' + id,
			success: function(result){
				console.log(result);
				if(result.success === 1){
					if(tr.length > 0){
						tr.remove();
					}
				}
			}
		});
	});
});