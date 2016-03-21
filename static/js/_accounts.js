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
                signup_contact: {
                    required: true,
                    maxlength: 10,
                    number: true
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
                signup_contact:{
                    required:   "Please Enter Mobile Number",
                    maxlength: "Number Should Not Exceed 10 Digits",
                    number: "Only Digits Allowed"
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
                    'contact_number':  $('#signup_contact').val(),
                    'password':    $('#signup_password').val()
                };
                //console.log(signup_data);
                //alert(signup_data);
                ajaxHandle.ajax_req('//'+window.location.hostname+'/accounts/signup/','POST',signup_data,function(res){
                    var login_data={
                        'username': $('#signup_username').val(),
                        'password': $('#signup_password').val()
                    };
                    ajaxHandle.ajax_req('//'+window.location.hostname+'/accounts/login_account/','POST',login_data,function(res){
                        window.location = '/home/';
                    });
                });
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
                ajaxHandle.ajax_req('//'+window.location.hostname+'/accounts/login_account/','POST',login_data,function(res){
                        localStorage.setItem('token',res);
                        window.location = '//'+window.location.hostname+'/home/';
                    },
                    function(res){
                        var login_error=$('#login_submit-error');
                        login_error.html('Incorrect Credentials');
                        login_error.css('display','');
                    }
                );
            }
        });
        $.ajaxSetup({
             headers: { "X-CSRFToken": ajaxHandle.getCookie('csrftoken') }
            });

    });
