$(document).ready(function () {

    // submit login form
    $("#loginForm").submit(function (e) {
        var form = $(this);
        var url = form.attr('action');
        $("#loginMsg").html('');
        $(".btnLogin").prop('disabled', true);
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (data) {
                !data.success ? $("#loginMsg").html(`<div class="alert alert-danger" role="alert">${data.message}</div>`) : location.reload();
                $(".btnLogin").prop('disabled', false);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                $("#loginMsg").html(`<div class="alert alert-danger" role="alert">Server error</div>`)
                $(".btnLogin").prop('disabled', false);
            }
        });
        e.preventDefault();
    });

    // submit forgot password form
    $("#forgotPasswordForm").submit(function (e) {
        var form = $(this);
        var url = form.attr('action');
        $("#forgotPasswordMsg").html('');
        $(".btnForgot").prop('disabled', true);
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (data) {
                $("#forgotPasswordMsg").html(`<div class="alert alert-${data.success ? 'success' : 'danger'}" role="alert">${data.success ? 'Please check your email' : data.message}</div>`);
                !data.success && $(".btnForgot").prop('disabled', false);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                $("#forgotPasswordMsg").html(`<div class="alert alert-danger" role="alert">Server error</div>`)
                $(".btnForgot").prop('disabled', false);
            }
        });
        e.preventDefault();
    });

    // toggle modal
    $('.forgot-password-link').on('click', function () {
        toggleLoginModal();
    });
    $('.login-link').on('click', function () {
        toggleLoginModal();
    });

    // check is reset password
    checkParamsResetPassword();

    // reset password
    function checkParamsResetPassword() {
        let searchParams = new URLSearchParams(window.location.search)
        let _type = searchParams.get('type');
        let _token = searchParams.get('token');
        if (_type && _token) {
            jQuery.ajax({
                type: "GET",
                url: "/api/reset-password?token=" + _token,
                success: function (response) {
                    if (response.success) {
                        $('#ResetPasswordToken').val(_token);
                        $('#resetPasswordModal').modal('toggle');
                    } else {
                        alert(response.message);
                        removeParam();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.status);
                    alert(thrownError);
                }
            });
        }
    };

    $("#resetPasswordForm").submit(function (e) {
        $("#resetPasswordMsg").html('');
        $(".btnResetPassword").prop('disabled', true);
        if ($('#NewPassword').val() !== $('#RepeatPassword').val()) {
            $("#resetPasswordMsg").html(`<div class="alert alert-danger" role="alert">Password does not match!</div>`);
            $(".btnResetPassword").prop('disabled', false);
        } else {
            var form = $(this);
            var url = form.attr('action');
            $.ajax({
                type: "POST",
                url: url,
                data: form.serialize(),
                success: function (data) {
                    // !data.success ? $("#resetPasswordMsg").html(`<div class="alert alert-danger" role="alert">${data.error}</div>`) : location.reload();
                    if (data.success) {
                        countDown(function (time) {
                            $("#resetPasswordMsg").html(`<div class="alert alert-success" role="alert">${data.message}, go to Login on <strong>${time + 1}</strong></div>`);
                            if(time === 0){
                                removeParam();
                                $('#loginModal').modal('toggle');
                                $('#resetPasswordModal').modal('toggle');
                            }
                        });
                    } else {
                        $("#resetPasswordMsg").html(`<div class="alert alert-danger" role="alert">${data.message}</div>`);
                        $(".btnResetPassword").prop('disabled', false);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr);
                    $("#resetPasswordMsg").html(`<div class="alert alert-danger" role="alert">Server error</div>`);
                    $(".btnResetPassword").prop('disabled', false);
                }
            });
        }
        e.preventDefault();
    });

    function countDown(cb) {
        var n = 5;
        setTimeout(countDown, 1000);

        function countDown() {
            n--;
            if (n > 0) {
                setTimeout(countDown, 1000);
            }
            cb(n);
        }
    };

    // remove param in url
    function removeParam() {
        window.history.pushState({}, document.title, "/trade");
    };


    function toggleLoginModal() {
        $('#loginModal').modal('toggle');
        $('#forgotPasswordModal').modal('toggle');
    }

});