var ajaxHandle ={
    upload_pic: function(url,method,data,callback){
        var ajax_data={
            'data':data,
            'url': url,
            'type': method,
            'processData': false,
            'contentType': false,
            'xhr': function() {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function(evt) {
                        var percent = (evt.loaded / evt.total) * 100;
                        console.log(percent)
                    }, false);
                }
                return xhr;
            },
            'success': function(res) {
                    callback(res)
            },
            'error':function(res){
                    callback(res.responseJSON)
            }
        };
        var csrf_token = ajaxHandle.getCookie('csrftoken');
        if(csrf_token!=''){
            ajax_data['beforeSend'] = function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
        $.ajax(ajax_data);
    },
    ajax_req: function(url,method,data,callback,callback_error){
        var ajax_data = {
            'url':url,
            'type':method,
            'contentType':'application/json',
            'success':function(response){
                    callback(response)
            },
            'error':function(response){
                    if(callback_error == undefined)
                        callback(response.responseJSON);
                    else
                        callback_error(response);
            }
        };

        if(data!=undefined){
             ajax_data['data'] = JSON.stringify(data)
        }

        var csrf_token = ajaxHandle.getCookie('csrftoken');
        if(csrf_token!=''){
            ajax_data['beforeSend'] = function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }

        $.ajax(ajax_data)
    },
    getCookie : function(name){
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};