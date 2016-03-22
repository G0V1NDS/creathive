$(function(){
	// resize
	function modalHeight() {
		var videoHeight = $(window).height();
		$('.video-modal').css('height', videoHeight - 50);
	}
	modalHeight();

	$(window).resize(function() {
		modalHeight();
	});


	if ($(window).width() >= 768) {
        function setHeight() {
            var windowHeight = $(window).height();
            $('#main_Content').css('min-height', windowHeight);
            $('.right_viewArea').css('min-height', windowHeight + 20);
            $('.leftPanel').css('min-height', windowHeight);
            $('.left-panel-scroll').css('height', windowHeight - 200);
        }

        setHeight();

        $(window).resize(function () {
            setHeight();
        });
    }
	$('.all, .videos, .tracks, .images, .articles').on('click',function(e){
        e.preventDefault();
        $('.tabs').removeClass('active');
        var classname = $(this).attr('class').split(' ')[0];
        $('.'+classname).addClass('active');
        $('.project_lists.show').removeClass('show').addClass('hide');
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

    /*
        Project events
     */

    /*
    Project add button event
     */
    $('.lp_title').find('button').on('click',function(e){
        $('.pH_row').removeClass('show').addClass('hide');
        $('.project_lists.show').removeClass('show').addClass('hide');
        $('.pH_row-edit').removeClass('hide').addClass('show');
        addProject();
	});
	/*
	// to add dynamic project div and let it edit
	 */
    function addProject()
	{
		$('.lp_title').find('button').addClass('hide').removeClass('show');
        $('.left-panel-scroll ul li').removeClass('active');
		$('.left-panel-scroll>ul').prepend('' +
            '<li data-proj-id="0" class="active">' +
                '<a href="#">' +
                    '<img src="/static/images/edit/titleImage.png" alt="">' +
                    '<span></span>' +
                    '<div class="overLay"></div>' +
                    '<img src="/static/images/edit/empty-trash.png" class="emptyTrash" alt="delete">' +
                    '<img src="/static/images/edit/trash.png" class="deleteTrash" alt="delete">' +
                '</a>' +
                '<div class="deletePrompt" style="display: none">' +
                    '<h4>Are you sure?</h4>' +
                    '<a href="#" class="no">Cancel</a>' +
                    '<a href="#" class="yes">Yes, Delete</a>' +
                '</div>' +
            '</li>');
        reset_project_edit();
        update_project_count('+');
	}
    /*
    // to reset all fields of ph_edit for new project
     */
    function reset_project_edit()
    {
        $('.pH_row-edit').attr('data-proj-id',0);
        $('.edit-projTitle').text('Title');
        $('.edit-projType').text('Project Type');
        $('.edit-projDesc').text('Project Description');
        $('.media-object').attr('src','/static/images/edit/titleImage.png');
    }
    /*
    // to manage project count after new project or deleting project
     */
    function update_project_count(op){
        count=$('#count');
        switch(op)
        {
            case '+':
                count.text(parseInt(count.text())+1);
                break;
            case '-':
                count.text(parseInt(count.text())-1);
        }
    }


	/*
	Project update and save
	*/
    /*
    Project title type and description update
     */
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
                $('.left-panel-scroll >ul li').first().attr('data-proj-id',res.proj_id);
                $('.left-panel-scroll >ul span').first().text(res.title);
			})
		}
        else
        {
            ajaxHandle.ajax_req(url,'PUT',data,function(res){
                $('.left-panel-scroll>ul').find('[data-proj-id='+proj_id+']').find('span').text(res.title);
			})
        }
        $('.lp_title').find('button').addClass('show').removeClass('hide');
    });

    /*
        Project thumbnail upload
     */
	$('.media').find('img').on('click',function(e){
		$('#project_title_image').click();
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
        var project_editor=$('.pH_row-edit');
		var proj_id=project_editor.attr('data-proj-id');
		var url=proj_id+'/project_title_image/';
		if(proj_id==0)
		{
            ajaxHandle.upload_pic(url,'POST',data,function(res){
                $('.media-object').attr('src',res.url+'?'+new Date().getTime());
                project_editor.attr('data-proj-id',res.proj_id);
                $('.left-panel-scroll >ul li').first().attr('data-proj-id',res.proj_id);
                $('.left-panel-scroll > ul img ').first().attr('src',res.url+'?'+new Date().getTime());
			})
		}
        else
        {
            ajaxHandle.upload_pic(url,'PUT',data,function(res){
                $('.media-object').attr('src',res.url+'?'+new Date().getTime());
                $('.left-panel-scroll>ul').find('[data-proj-id='+proj_id+']').find('img').first().attr('src',res.url+'?'+new Date().getTime());
			})
        }
        $('.lp_title').find('button').addClass('show').removeClass('hide');
    });
    /*
        modifying created project
     */
    $('.edit-proj').on('click',function(e){
        e.preventDefault();
        var project_edit=$('.pH_row-edit');
        var project_view=$('.pH_row');
        project_edit.addClass('show').removeClass('hide');
        project_view.addClass('hide').removeClass('show');
        $('.project_lists.show').removeClass('show').addClass('hide');
        var proj_id=project_view.attr('data-proj-id');
        var url=proj_id+'/display/';
        project_edit.attr('data-proj-id',project_view.attr('data-proj-id'));
        $('.media-object').attr('src',$('.left-panel-scroll>ul').find('[data-proj-id='+proj_id+']').find('img').first().attr('src'));
        $('.edit-projTitle').text(project_view.find('.p_mt').text());
        $('.edit-projType').text(project_view.find('.p_st').text());
        $('.edit-projDesc').text(project_view.find('p').text());
    });
    /*
    project view and deletion
     */
    var project_list=$('.left-panel-scroll ul');
    var project_view=$('.pH_row');
    $(project_list).on('click', 'li', function(e) {
        e.preventDefault();
        $('.left-panel-scroll ul li').removeClass('active');
        $(this).addClass('active');
        var proj_id=$(this).attr('data-proj-id');
        if(proj_id!=0) {
            load_project(proj_id);
        }
        else
        {
            $('.pH_row-edit').addClass('show').removeClass('hide');
            project_view.addClass('hide').removeClass('show');
        }
    });
    /*
        to load project details into ph_edit
     */
    function load_project(proj_id){
        $('.pH_row-edit').addClass('hide').removeClass('show');
        project_view.addClass('show').removeClass('hide');
        var url=proj_id+'/display/';
        ajaxHandle.ajax_req(url,'GET',proj_id,function(res){
            project_view.attr('data-proj-id', res.id);
            project_view.find('.p_mt').text(res.title);
            project_view.find('.p_st').text(res.type);
            project_view.find('p').text(res.description);
        });
    }
    /*
        to delete project
     */
    $(project_list).on('click', '.deleteTrash', function(e) {
        e.preventDefault();
        $(this).closest('li').find('.deletePrompt').show();
        e.stopPropagation();
    });
    $(project_list).on('click', '.yes', function(e) {
        e.preventDefault();
        $(this).closest('li').remove();
        $('.lp_title').find('button').addClass('show').removeClass('hide');
        update_project_count('-');
        var proj_id=$(this).closest('li').attr('data-proj-id');
        if(proj_id!=0) {
            var url = proj_id + '/project_delete/';
            ajaxHandle.ajax_req(url, 'POST', proj_id, function (res) {
            });
        }
        else
        {
        }
        load_next_project();
        e.stopPropagation();
    });
    /*
        to load next project and set it active after deletion or on refresh
     */
    function load_next_project(){
        var next_proj=project_list.children().first();
        if(next_proj.attr('data-proj-id')) {
            next_proj.addClass('active');
            load_project(next_proj.closest('li').attr('data-proj-id'));
        }
        else
        {
            $('.pH_row').removeClass('show').addClass('hide');
            $('.project_lists.show').removeClass('show').addClass('hide');
            $('.pH_row-edit').removeClass('show').addClass('hide');
        }
    }
    load_next_project();
    $(project_list).on('click', '.no', function(e) {
        e.preventDefault();
        $(this).closest('li').find('.deletePrompt').hide();
        e.stopPropagation();
    });
});