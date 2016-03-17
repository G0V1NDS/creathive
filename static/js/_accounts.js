    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });

    $(function(){
        $('.signup').hide();
        $('#login>ul').css('backgroundColor','#5D7BBA');
        $('#login').on('click',function(e){
            $('.signup').hide();
            $('.login').show();
            $('#login>ul').css('backgroundColor','#5D7BBA');
            $('#signup>ul').css('backgroundColor','#3B5998');
        })
        $('#signup').on('click',function(e){
            $('.login').hide();
            $('.signup').show();
            $('#signup>ul').css('backgroundColor','#5D7BBA');
            $('#login>ul').css('backgroundColor','#3B5998');
        })

        $( "#signup_form" ).validate({
            rules: {
                signup_username: {
                    required:   true,
                    remote:{
                        'method': 'POST',
                        'url': '//' + window.location.hostname + '/accounts/check_username/',
                        'data': {
                            username    :   function()
                            {
                                return $('#signup_username').val()
                            }
                        }
                    }
                },
                signup_fname: {
                    required:   true
                },
                signup_lname: {
                    required:   true
                },
                signup_password: {
                    required:   true,
                    minlength:  4
                },
                signup_password_confirm: {
                    required: true,
                    equalTo: "#signup_password"
                },
                signup_email:   {
                    required: true,
                    email:  true,
                    remote:{
                        'method': 'POST',
                        'url': '//' + window.location.hostname + '/accounts/check_email/',
                        'data': {
                            email   :   function()
                            {
                                return $('#signup_email').val()
                            }
                        }
                    }
                }
            },
            messages:{
                signup_fname:   "Please Enter First Name",
                signup_lname:   "Please Enter Last Name",
                signup_username: {
                    required:   "Please Enter Username",
                    remote: "Username Already Exist"
                },
                signup_password: {
                    required:      "Please Enter Password",
                    minlength:    "At least 4 character"
                },
                signup_password_confirm:{
                    required:   "Please Confirm Password"
                },
                signup_email:{
                    required:   "Please Enter Email",
                    email:  "Please Enter Valid Email",
                    remote: "Email Already Registered"
                }
            },
            submitHandler: function() {
                var signup_data={
                    'first_name':    $('#signup_fname').val(),
                    'last_name':    $('#signup_lname').val(),
                    'username':    $('#signup_username').val(),
                    'email':    $('#signup_email').val(),
                    'password':    $('#signup_password').val()
                };
                console.log(signup_data);
                $.ajax({
                        'method': 'POST',
                        'url'   :'//'+window.location.hostname+'/accounts/signup/',
                        'data'  :   JSON.stringify(signup_data),
                        'dataType'  :   'JSON',
                        'success'   :  function(res){
                            var login_data={
                                'username': $('#signup_username').val(),
                                'password': $('#signup_password').val()
                            };
                            $.ajax({
                                'method': 'POST',
                                'url': '//' + window.location.hostname + '/accounts/login_account/',
                                'data': JSON.stringify(login_data),
                                'dataType': 'JSON',
                                'success':  function (res) {
                                    window.location = '/home/';
                                }
                            })
                        }
                })
            }
        });
        $( "#login_form" ).validate({
            rules: {
                login_password: "required",
                login_username: "required"
            },
            messages:{
                login_username: "Please enter username",
                login_password: "Please enter password"
            },
            submitHandler: function() {
                var login_data={
                    'username': $('#login_username').val(),
                    'password': $('#login_password').val()
                };
                $('#login_submit-error').css('display','none');
                $.ajax({
                    'method': 'POST',
                    'url': '//' + window.location.hostname + '/accounts/login_account/',
                    'data': JSON.stringify(login_data),
                    'dataType': 'JSON',
                    'success':  function (res) {
                        localStorage.setItem('token',res);
                        window.location = '//'+window.location.hostname+'/home/';
                    },
                    'error':    function(res){
                        var login_error=$('#login_submit-error');
                        login_error.html('Incorrect Credentials');
                        login_error.css('display','');

                    }
                })
            }
        });
        $.ajaxSetup({
             headers: { "X-CSRFToken": getCookie("csrftoken") }
            });

    });
    function getCookie(c_name)
        {
            if (document.cookie.length > 0)
            {
                c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1)
                {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) c_end = document.cookie.length;
                    return unescape(document.cookie.substring(c_start,c_end));
                }
            }
            return "";
        }