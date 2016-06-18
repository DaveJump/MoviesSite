$(function(){
	//删除
	$('.table').on('click','.del',function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/list?id=' + id,
			success: function(result){
				if(result.success === 1){
					if(tr.length > 0){
						tr.remove();
					}
				}
			}
		});
	});

	//同步豆瓣
	$('#douban').blur(function(){
		var douban = $(this);
		var id = douban.val();

		if(id){
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data){
					$('#inputTitle').val(data.title);
					$('#inputDirector').val(data.directors[0].name);
					$('#inputCountry').val(data.countries[0]);
					$('#inputLanguage').val('');
					$('#inputPoster').val(data.images.large);
					$('#inputReleaseDate').val(data.year);
					$('#inputSummary').val(data.summary);
				}
			});
		}
	});
});