$(function(){
	$('.all').click(function(e){
			setActive(this);
			$('.project_lists').removeClass('show').addClass('hide');
			$('#all_list').removeClass('hide').addClass('show');
	});
	$('.videos').click(function(e){
			setActive(this);
			$('.project_lists').removeClass('show').addClass('hide');
			$('#videos_list').removeClass('hide').addClass('show');
	});
	$('.tracks').click(function(e){
			setActive(this);
			$('.project_lists').removeClass('show').addClass('hide');
			$('#tracks_list').removeClass('hide').addClass('show');
	});
	$('.images').click(function(e){
			setActive(this);
			$('.project_lists').removeClass('show').addClass('hide');
			$('#images_list').removeClass('hide').addClass('show');
	});
	$('.articles').click(function(e){
			setActive(this);
			$('.project_lists').removeClass('show').addClass('hide');
			$('#articles_list').removeClass('hide').addClass('show');
	});
	function setActive(menu)
	{
		$(menu).parent().find('li').each(function(){
			$(this).removeClass('active');
		});
		$(menu).addClass('active');
	}
	$('.lp_title').find('button').click(function(e){
		 //$('.nav-categories').removeClass('show').addClass('hide');
		  $('.pH_row').removeClass('show').addClass('hide');
		  $('#all_list').removeClass('show').addClass('hide');
		  $('#videos_list').removeClass('show').addClass('hide');
		  $('#tracks_list').removeClass('show').addClass('hide');
		  $('#images_list').removeClass('show').addClass('hide');
		  $('#articles_list').removeClass('show').addClass('hide');
		 $('.pH_row-edit').removeClass('hide').addClass('show');
		 addProject();
	});
	$('#logout').click(function(e){
		$.ajax({
			'method' : 'GET',
			'url': '//' + window.location.hostname + '/accounts/logout_account/',
			'success': function(res){
				console.log(res);
				location.reload();
			},
			'error': function(res){
				console.log(res);
			}
		})
	});

	function addProject()
	{
		$('.lp_title').find('button').addClass('hide').removeClass('show');
		$('.left-panel-scroll').children().first().prepend('<li><a href="#"><img src="/static/images/edit/titleImage.png" alt=""><span>Title</span><div class="overLay"></div><img src="/static/images/edit/empty-trash.png" class="emptyTrash" alt="delete"><img src="/static/images/edit/trash.png" class="deleteTrash" alt="delete"></a><div class="deletePrompt hide"><h4>Are you sure?</h4><a href="#">Cancel</a><a href="#">Yes, Delete</a></div></li>');
		project_id='';
	}

	$('.media').find('img').click(function(e){
		$('#project_title_image').click();
	});
    $('#project_title_image').change(function(e){
        e.preventDefault();
        var data = new FormData($('form').get(0));
        $.ajax({
            'data':data,
            'url': 'project_title_image/',
            'type': 'POST',
            cache: false,
            processData: false,
            contentType: false,
            success: function(res) {
                console.log(res);
            }
        });
    });
/*
Hover and click events for updating profile
*/
	$('.profile_pic_large').hover(function(e){
		$(this).find('.edit-prof').removeClass('hide').addClass('show');
	},function(e){
		$(this).find('.edit-prof').removeClass('show').addClass('hide');
	});

	$('.profile_name').hover(function(e){
		$(this).find('.edit-pen').removeClass('hide').addClass('show');
	},function(e){
		$(this).find('.edit-pen').removeClass('show').addClass('hide');
	});
	$('#banner').hover(function(e){
		$(this).find('.edit-wall').removeClass('hide').addClass('show');
	},function(e){
		$(this).find('.edit-wall').removeClass('show').addClass('hide');
	});
/*Update profile*/

});