$(function(){
	$('.all, .videos, .tracks, .images, .articles').on('click',function(e){
        $(this).parent().find('li').each(function(){
			$(this).removeClass('active');
		});
        $('.project_lists.show').removeClass('show').addClass('hide');
        var id="#"+$(this).attr('class').split(" ")[0]+"_list";
        $(id).removeClass('hide').addClass('show');
    });
	$('.lp_title').find('button').on('click',function(e){
        $('.pH_row').removeClass('show').addClass('hide');
        $('.project_lists.show').removeClass('show').addClass('hide');
        $('.pH_row-edit').removeClass('hide').addClass('show');
        addProject();
	});
	$('#logout').on('click',function(e){
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
		$('.left-panel-scroll>ul').prepend('' +
            '<li data-proj-id="0">' +
                '<a href="#">' +
                    '<img src="/static/images/edit/titleImage.png" alt="">' +
                    '<span></span>' +
                    '<div class="overLay"></div>' +
                    '<img src="/static/images/edit/empty-trash.png" class="emptyTrash" alt="delete">' +
                    '<img src="/static/images/edit/trash.png" class="deleteTrash" alt="delete">' +
                '</a>' +
                '<div class="deletePrompt hide">' +
                    '<h4>Are you sure?</h4>' +
                    '<a href="#">Cancel</a>' +
                    '<a href="#">Yes, Delete</a>' +
                '</div>' +
            '</li>');
		project_id='';
	}
	/*
	Project thumbnail upload
	 */
	$('.media').find('img').on('click',function(e){
		$('#project_title_image').click();
	});
    $('.edit-projTitle, .edit-projType, .edit-projDesc').on('blur',function(e){
        var title=$('.edit-projTitle').text().trim();
        var type=$('.edit-projType').text().trim();
        var description=$('.edit-projDesc').text().trim();
        var data = {
            'title':title,
            'type':type,
            'description':description
        };
        project_editor=$('.pH_row-edit');
		var proj_id=project_editor.attr('data-proj-id');
		var url=proj_id+'/project_update/';
		if(proj_id==0)
		{
            ajaxHandle.ajax_req(url,'POST',data,function(res){
                project_editor.attr('data-proj-id',res.proj_id);
                $('.left-panel-scroll >ul span').first().text(res.title);
			})
		}
        else
        {
            ajaxHandle.ajax_req(url,'PUT',data,function(res){
                $('.left-panel-scroll>ul span').first().text(res.title);
			})
        }
    });
    $('#project_title_image_form').on('change',function(e){
        var $img= e.target.files[0];
		var $img_name=$img.name;
		var $img_ext=$img_name.substr($img_name.lastIndexOf('.')+1);
        var data = new FormData();
		data.append('image',$img);
		data.append('ext',$img_ext);
		if(!($img_ext=='png' || $img_ext=='jpg' || $img_ext=='jpeg'))
			return;
        project_editor=$('.pH_row-edit');
		var proj_id=project_editor.attr('data-proj-id');
		var url=proj_id+'/project_title_image/';
		if(proj_id==0)
		{
            ajaxHandle.upload_pic(url,'POST',data,function(res){
                $('.media-object').attr('src',res.url+'?'+new Date().getTime());
                project_editor.attr('data-proj-id',res.proj_id);
                $('.left-panel-scroll > ul img ').first().attr('src',res.url+'?'+new Date().getTime());
			})
		}
        else
        {
            ajaxHandle.upload_pic(url,'PUT',data,function(res){
                $('.media-object').attr('src',res.url+'?'+new Date().getTime());
                $('.left-panel-scroll>ul img').first().attr('src',res.url+'?'+new Date().getTime());
			})
        }
    });
	/*
	Profile pic upload
	 */
	$('.edit-prof').on('click',function(e){
		$('#profile_image').click();
	});
	$('#profile_image_form').on('change',function(e){
		var $img= e.target.files[0];
		var $img_name=$img.name;
		var $img_ext=$img_name.substr($img_name.lastIndexOf('.')+1);
        var data = new FormData();
		data.append('image',$img);
		data.append('ext',$img_ext);
		if(!($img_ext=='png' || $img_ext=='jpg' || $img_ext=='jpeg'))
			return;
		var url='profile_image/';
		ajaxHandle.upload_pic(url,'POST',data,function(res){
			$('#profile_pic').attr('src',res.url+'?'+new Date().getTime())
		})
    });

    /*
	Profile cover pic upload
	 */
	$('.edit-wall').on('click',function(e){
		$('#profile_cover_image').click();
	});
	$('#profile_cover_image_form').on('change',function(e){
		var $img= e.target.files[0];
		var $img_name=$img.name;
		var $img_ext=$img_name.substr($img_name.lastIndexOf('.')+1);
        var data = new FormData();
		data.append('image',$img);
		data.append('ext',$img_ext);
		if(!($img_ext=='png' || $img_ext=='jpg' || $img_ext=='jpeg'))
			return;
		var url='profile_cover_image/';
		ajaxHandle.upload_pic(url,'POST',data,function(res){
			$('#cover_pic').attr('src',res.url+'?'+new Date().getTime())
		})
    });
	/*
	Update user info
	 */
	$('.edit-pen').on('click',function(e){
		$(this).addClass('hide').removeClass('show');
		var userinfo=$('.profile_name');
		userinfo.unbind('mouseenter mouseleave');
		$('.edit-save').removeClass('hide').addClass('show');
		userinfo.find($('[contentEditable]')).each(function(){
			$(this).attr('contentEditable','true');
		})
	});
	$('.edit-save').on('click',function(e){
		$(this).addClass('hide').removeClass('show');
		var userinfo=$('.profile_name');
		var data={
			'name':userinfo.find('h3').text(),
			'about_me':userinfo.find('p').text()
		};
		ajaxHandle.ajax_req('update_user_info/','POST',data,function(res){

		});
		userinfo.bind('mouseenter',show_pen);
		userinfo.bind('mouseleave',hide_pen);
		userinfo.find($('[contentEditable]')).each(function(){
			$(this).attr('contentEditable','false');
		})
	});
    /*
    Hover and click events for updating profile
    */
	var profile_name=$('.profile_name');
	profile_name.bind('mouseenter',show_pen);
	profile_name.bind('mouseleave',hide_pen);
	function show_pen(){
		$(this).find('.edit-pen').removeClass('hide').addClass('show');
	}
	function hide_pen(){
		$(this).find('.edit-pen').removeClass('show').addClass('hide');
	}

	var profile_pic=$('.profile_pic_large');
	profile_pic.bind('mouseenter',function(e){
		$(this).find('.edit-prof').removeClass('hide').addClass('show');
	});
	profile_pic.bind('mouseleave',function(e){
		$(this).find('.edit-prof').removeClass('show').addClass('hide');
	});

	var cover_pic=$('#banner');
	cover_pic.bind('mouseenter',function(e){
		$(this).find('.edit-wall').removeClass('hide').addClass('show');
	});
	cover_pic.bind('mouseleave',function(e){
		$(this).find('.edit-wall').removeClass('show').addClass('hide');
	});

});