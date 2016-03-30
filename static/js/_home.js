$(function(){
    var offset=0;
    var media_count=0;
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
    $(".leftPanel").sticky({topSpacing:80});

		// Nice scroll
		$(".left-panel-scroll").niceScroll();


		function sticky_relocate() {
			var window_top = $(window).scrollTop();
			var div_top = $('#sticky-anchor').offset().top;
			var targetOffset = $("#anchor-point").offset().top;

			if (window_top > div_top) {
				$('.leftPanel').addClass('stick');
				$('.header-midMenu').removeClass('hide');
				$('.nav-categories').addClass('hide');
			} else {
				$('.leftPanel').removeClass('stick');
				$('.header-midMenu').addClass('hide');
				$('.nav-categories').removeClass('hide');
			}
		}

		$(function () {
            $(window).scrollTop(0);
			sticky_relocate();
		});
	$('.all, .videos, .tracks, .images, .articles').on('click',function(e){
        e.preventDefault();
        offset=0;
        $('.tabs').removeClass('active');
        var classname = $(this).attr('class').split(' ')[0];
        $('.'+classname).addClass('active');
        $('.project_lists').removeClass('hide').addClass('show');
        var proj_id=$('#rightView_content').find('.show[data-proj-id]').first().attr('data-proj-id');
        var media_type;
        media_type=get_media_type(classname);
        load_media(media_type,proj_id,'click',offset,3);
    });
    function get_media_type(classname){
        switch(classname)
        {
            case 'all':
                return media_type=0;
            case 'videos':
                return media_type=1;
            case 'tracks':
                return media_type=2;
            case 'images':
                return media_type=3;
            case 'articles':
                return media_type=4;
        }
    }
	$('#logout').on('click',function(){
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
	$('.edit-prof').on('click',function(){
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
		ajaxHandle.upload_file(url,'POST',data,function(res){
			$('#profile_pic').attr('src',res.url+'?'+new Date().getTime())
		})
    });

    /*
	Profile cover pic upload
	 */
	$('.edit-wall').on('click',function(){
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
		ajaxHandle.upload_file(url,'POST',data,function(res){
			$('#cover_pic').attr('src',res.url+'?'+new Date().getTime())
		})
    });
	/*
	Update user info
	 */
	$('.edit-pen').on('click',function(){
		$(this).addClass('hide').removeClass('show');
		var userinfo=$('.profile_name');
		userinfo.unbind('mouseenter mouseleave');
		$('.edit-save').removeClass('hide').addClass('show');
		userinfo.find($('[contentEditable]')).each(function(){
			$(this).attr('contentEditable','true');
		})
	});
	$('.edit-save').on('click',function(){
		$(this).addClass('hide').removeClass('show');
		var userinfo=$('.profile_name');
		var data={
			'name':userinfo.find('h3').text().trim(),
			'about_me':userinfo.find('p').text().trim()
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
	profile_pic.bind('mouseenter',function(){
		$(this).find('.edit-prof').removeClass('hide').addClass('show');
	});
	profile_pic.bind('mouseleave',function(){
		$(this).find('.edit-prof').removeClass('show').addClass('hide');
	});

	var cover_pic=$('#banner');
	cover_pic.bind('mouseenter',function(){
		$(this).find('.edit-wall').removeClass('hide').addClass('show');
	});
	cover_pic.bind('mouseleave',function(){
		$(this).find('.edit-wall').removeClass('show').addClass('hide');
	});

    /*
        Project events
     */

    /*
    Project add button event
     */
    $('.lp_title').find('button').on('click',function(){
        $('.pH_row').removeClass('show').addClass('hide');
        $('.project_lists.show').html('');
        $('.row').addClass('hide');
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
        $('.edit-projTitle').text('');
        $('.edit-projType').text('');
        $('.edit-projDesc').text('');
        $('.media-object').attr('src','/static/images/edit/titleImage.png');
    }
    /*
    // to manage project count after new project or deleting project
     */
    function update_project_count(op){
        var count=$('#count');
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
    $('.edit-projTitle, .edit-projType, .edit-projDesc').on('blur',function(){
        submit_error=$('#proj_info_submit');
        submit_error.hide();
        var title=$('.edit-projTitle').text().trim().toUpperCase();
        var type=$('.edit-projType').text().trim();
        var description=$('.edit-projDesc').text().trim();
        $('.pH_row-edit span').css('border-color','#ddd');
        if(title=="")
        {
            submit_error.fadeIn("slow");
        }
        else {
            var data = {
                'title': title,
                'type': type,
                'description': description
            };
            project_editor = $('.pH_row-edit');
            var proj_id = project_editor.attr('data-proj-id');
            var url = proj_id + '/project_update/';
            if (proj_id == 0) {
                ajaxHandle.ajax_req(url, 'POST', data, function (res) {
                    project_editor.attr('data-proj-id', res.proj_id);
                    $('.left-panel-scroll >ul li').first().attr('data-proj-id', res.proj_id);
                    $('.left-panel-scroll >ul span').first().text(res.title);
                })
            }
            else {
                ajaxHandle.ajax_req(url, 'PUT', data, function (res) {
                    $('.left-panel-scroll>ul').find('[data-proj-id=' + proj_id + ']').find('span').text(res.title);
                })
            }
            $('.row').removeClass('hide');
            $('.lp_title').find('button').addClass('show').removeClass('hide');
        }
    });

    /*
        Project thumbnail upload
     */
	$('.media').find('img').on('click',function(){
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
            ajaxHandle.upload_file(url,'POST',data,function(res){
                $('.media-object').attr('src',res.url+'?'+new Date().getTime());
                project_editor.attr('data-proj-id',res.proj_id);
                $('.left-panel-scroll >ul li').first().attr('data-proj-id',res.proj_id);
                $('.left-panel-scroll > ul img ').first().attr('src',res.url+'?'+new Date().getTime());
			})
		}
        else
        {
            ajaxHandle.upload_file(url,'PUT',data,function(res){
                $('.media-object').attr('src',res.url+'?'+new Date().getTime());
                $('.left-panel-scroll>ul').find('[data-proj-id='+proj_id+']').find('img').first().attr('src',res.url+'?'+new Date().getTime());
			})
        }
        $('.row').removeClass('hide');
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
        $('.project_lists').removeClass('hide').addClass('show');
        var proj_id=project_view.attr('data-proj-id');
        project_edit.attr('data-proj-id',project_view.attr('data-proj-id'));
        $('.media-object').attr('src',$('.left-panel-scroll>ul').find('[data-proj-id='+proj_id+']').find('img').first().attr('src'));
        $('.edit-projTitle').text(project_view.find('.p_mt').text().trim());
        $('.edit-projType').text(project_view.find('.p_st').text().trim());
        $('.edit-projDesc').text(project_view.find('p').text().trim());
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
        if(proj_id==0) {
            $('.pH_row').addClass('hide').removeClass('show');
            $('.pH_row-edit').addClass('show').removeClass('hide');
            $('.project_lists').html('');

        }
        else
        {
            reset_remove_media();
            load_project(proj_id);
        }
    });
    /*
        to load project details into ph_edit
     */
    function load_project(proj_id){
        offset=0;
        media_count=0;
        $(window).scrollTop(400);
        $('.pH_row-edit').addClass('hide').removeClass('show');
        project_view.addClass('show').removeClass('hide');
        var url=proj_id+'/display/';
        ajaxHandle.ajax_req(url,'GET',proj_id,function(res){
            res=JSON.parse(res);
            project_view.attr('data-proj-id', res.serial.id);
            project_view.find('.p_mt').text(res.serial.title);
            project_view.find('.p_st').text(res.serial.type);
            project_view.find('p').text(res.serial.description);
            media_count=res.media_count;
            $('.project_lists').removeClass('hide').addClass('show');
            load_media(0,proj_id,'click',offset,3);
        });
    }
    function load_media(media_type,proj_id,event,os,limit){
        var url=proj_id+'/'+media_type+'/media_get/'+os+'/'+limit+'/';
        console.log(offset);
        ajaxHandle.ajax_req(url,'GET',proj_id,function(res){
            res=JSON.parse(res);
            if(event=='click')
                $('.project_lists').html('');
            offset=os+res.loaded_media;
            var i=0;
            if(res.serial!=undefined)
            for(i=0;i<res.serial.length;i++){
                data=res.serial[i];
                $('.project_lists').append(newMediaThumb(data.id,data.title,data.description,data.type,data.media_url,data.thumbnail));
            }
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
        if(proj_id==0) {
        }
        else
        {
            var url = proj_id + '/project_delete/';
            ajaxHandle.ajax_req(url, 'POST', proj_id, function (res) {
            });
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
    /*
        Media upload
     */
    var media_type;
    $('#video, #audio, #image, #article').on('click',function(e){
        e.preventDefault();
        $('#media_upload').trigger('click');
        media_type=$(this).attr("id");
    });
    $('#media_upload_form').on('change',function(e){
        var $file= e.target.files[0];
        var $file_name=$file.name;
        var $file_ext=$file_name.substr($file_name.lastIndexOf('.')+1);
        var data = new FormData();
        data.append('media',$file);
        data.append('type', media_type);
        data.append('ext',$file_ext);
        switch(media_type) {
            case 'video':
                if (!($file_ext == 'ogg' || $file_ext == 'mp4' || $file_ext == 'webm')) {
                    alert('not a valid video file');
                    return;
                }
                break;
            case 'audio':
                if (!($file_ext == 'mp3' || $file_ext == 'amr')) {
                    alert('not a valid audio file');
                    return;
                }
                break;
            case 'article':
                if (!($file_ext == 'txt' || $file_ext == 'pdf' || $file_ext == 'docx' || $file_ext == 'doc')) {
                    alert('not a valid document');
                    return;
                }
                break;
            case 'image':
                if(!($file_ext=='png' || $file_ext=='jpg' || $file_ext=='jpeg')) {
                    alert('not a valid image file');
                    return;
                }
        }
        var modal=$('.video-modal');
        modal.fadeIn();
        edit_media();
        var proj_id=$('.pH_row-edit').attr('data-proj-id');
        var url=proj_id+'/media_upload/';
        ajaxHandle.upload_file(url,'POST',data,function(res){
            res=JSON.parse(res)
            modal.attr('data-media-id',res.serial.id);
            $('.gallery-header').find('h4').text(res.serial.title);
            $('.mediaplayer').find('iframe').attr('src',res.serial.media_url);
            $('.edit-midTitle').text(res.serial.title);
            $('.edit-midDesc').text(res.serial.description);
            $('.project_lists').prepend(newMediaThumb(res.serial.id,res.serial.title,res.serial.description,res.serial.type,res.serial.media_url,res.serial.thumbnail));
        });
    });
    //Function for editable media
    function edit_media(){
        $('.edit-mid').removeClass('show').addClass('hide');
        $('.video-desc').find('[contenteditable]').attr('contenteditable',true);
        $('.edit-midTitle').focus();
    }
    //Function to update media title and description
    function update_media(){
        var data={
            'title': $('.edit-midTitle').text().trim().toUpperCase(),
            'description': $('.edit-midDesc').text().trim(),
            'media_id': $('.video-modal').attr('data-media-id')
        };
        var proj_id=$('#rightView_content').find('.show[data-proj-id]').first().attr('data-proj-id');
        var url=proj_id+'/media_update/';
        ajaxHandle.ajax_req(url,'PUT',data,function(res){
            editable_media=$('.project_lists').find('[id='+data.media_id+']');
            editable_media.find('.title').text(res.media_title);
            editable_media.find('.description').text(res.media_desc);
        });
    }
    //To create new media thumbnail
    function newMediaThumb(id,title,description,type,media_url,thumbnail){
        return '' +
                '<div class="pl_thumbHolder" id="'+id+'">' +
                '<div class="thumb-edit-overlay"></div>' +
                '<div class="thumbnail">' +
                '<p style="display:none;"  class="description">'+description+'</p>' +
                '<p style="display:none;" class="media_url">'+media_url+'</p>' +
                '<img src="'+thumbnail+'" alt="thumbnail">' +
                '<div class="caption">' +
                '<p class="title">'+title+'</p>' +
                '<a href="#"><img src="/static/images/header/'+type.toLowerCase()+'s-black.png" alt="'+type.toLowerCase()+'"></a>' +
                '</div>' +
                '<div class="thumb-edit-icons">' +
                '<div class="squaredThree">' +
                '<input class="mid_label" type="checkbox" value="'+id+'" id="mid_'+id+'" name="check" />' +
                '<label class="mid_label" for="mid_'+id+'"></label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
    }
    $('.project_lists').on('click','.pl_thumbHolder',function(e){
        e.preventDefault();
        selected_media=$(this);
        var proj_id=$('#rightView_content').find('.show[data-proj-id]').first().attr('data-proj-id');
        var modal=$('.video-modal');
        modal.attr('data-media-id',$(this).attr('id'));
        $('.gallery-header').find('h4').text($('.left-panel-scroll>ul').find('[data-proj-id='+proj_id+']').find('span').text().trim());
        $('.mediaplayer').find('iframe').attr('src',selected_media.find($('.media_url')).text().trim());
        $('.edit-midTitle').text(selected_media.find($('.title')).text().trim());
        $('.edit-midDesc').text(selected_media.find($('.description')).text().trim());
		$('body').css('overflow', 'hidden');
		modal.fadeIn();
		$('.body-overlay').fadeIn();
        e.stopPropagation();
	});
    $('.edit-midTitle,.edit-midDesc').on('blur',function(e){
        if($('.edit-midTitle').text()=="" || $('.edit-midDesc').text()==""){
            $('#mid_info_submit').fadeIn('slow');
        }
        else{
            $('#mid_info_submit').fadeOut('slow');
            update_media();
        }
    });
    $('.edit-mid').on('click',function(e){
       edit_media();
    });
	$('.btn-done').on('click',function(){
		$('body').css('overflow', 'visible');
        $('.video-desc').find('[contenteditable]').attr('contenteditable',false);
        $('.edit-mid').removeClass('hide').addClass('show');
        $('#mid_info_submit').fadeOut('slow');
		$('.video-modal').fadeOut();
		$('.body-overlay').fadeOut();
	});
    /*
        To delete media
     */
    $('.project_lists.show').on('click', '.mid_label', function(e){
        $('.thumb-edit-icons').css('display','block');
        $('.remove-media').show();
        e.stopPropagation();
    });
    $('.remove-mid').on('click',function(){
        var rem_mid=[];
        $('.mid_label:checked').each(function(){
            mid_thumb=$(this).closest('.pl_thumbHolder');
            rem_mid.push(mid_thumb.attr('id'));
            mid_thumb.remove();
        });
        var data={rem_mid:rem_mid};
        var proj_id=$('#rightView_content').find('.show[data-proj-id]').first().attr('data-proj-id');
        var url = proj_id + '/media_delete/';
        ajaxHandle.ajax_req(url, 'POST',data, function (res) {
            reset_remove_media();
            var classname = $('.tabs.active').attr('class').split(' ')[0];
            var media_type=get_media_type(classname);
            //var proj_id=$('#rightView_content').find('.show[data-proj-id]').first().attr('data-proj-id');
            offset-=rem_mid.length;
            load_media(media_type,proj_id,'remove',offset,offset+rem_mid.length);
            offset+=rem_mid.length;
        });
    });
    $('.cancel-remove-mid').on('click',function(){
        reset_remove_media();
    });
    function reset_remove_media(){
        $('.thumb-edit-icons').css('display','none');
        $('.remove-media').hide();
        $('.mid_label:checked').each(function(){
           $(this).prop('checked',false);
        });
    }
    /*
        Infinite scroll
     */
    var timeout;
    $(window).on('scroll',function(){
        sticky_relocate();
        clearTimeout(timeout);
        timeout = setTimeout(function() {
        if($(this).height()+$(this).scrollTop()==$(document).height() && offset<media_count){
            var classname = $('.tabs.active').attr('class').split(' ')[0];
            var media_type=get_media_type(classname);
            var proj_id=$('#rightView_content').find('.show[data-proj-id]').first().attr('data-proj-id');
            load_media(media_type,proj_id,'scroll',offset,offset+3);

        }

        }, 50);
    })
});