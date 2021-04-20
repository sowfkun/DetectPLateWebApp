//
//Hiệu ứng các input khi load page
//
function loadFunction(){
    $("#image").css("opacity", 100);
}

//
//Hiệu ứng các input khi load page
//

$(".input input").on("focusin", function () {
    $(this).siblings(".fas").css({
        "margin-left": "-7px",
        "z-index": "10000"
    });
    $(this).siblings("#otp_label").css("margin-left", "-2px");

});
$(".input input").on("focusout", function () {
    $(this).siblings(".fas").css({
        "margin-left": "4px",
        "z-index": "10000"
    });
});

//
//Đăng nhập
//

$("#login_form").submit(function() {
    return false;
})
$("#sendSMS").submit(function() {
    $("#switch_to_confirm_sms").click()
    return false;
})
$("#otpConfirm").submit(function() {
    $("#confirm_new_pass").click()
    return false;
})

$("#btn_login").on('click', function(){
    //lấy giá trị số điện thoại và mật khẩu
    var phone = $("#login_form #phone").val().trim();
    var password = $("#login_form #password").val().trim();
    
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    //validate giá trị
    if(phone == ""){
        var msg1 = "Vui lòng nhập số điện thoại";
        alertFail("phone", msg1);
        return;
    } else if(phone_regex.test(phone) == false){
        var msg1 = "Số điện thoại không hợp lệ";
        alertFail("phone", msg1);
        return;
    }
    //kiểm tra password
    if(password == "") {
        var msg2 = "Vui lòng nhập password";
        alertFail("password", msg2);
        return;
    } else if(password.length < 5) {
        var msg2 = "Password tối thiểu phải có 5 kí tự";
        alertFail("password", msg2);
        return;
    }
    
    //các giá trị đều hợp lệ
    $.ajax({
        type: "POST",
        url: "/login",
        dataType: "json",
        data: {phone: phone, password: password},
        cache: false
    }).done (function (data) {
        console.log(data)
        if(data.msg == "success"){
            //hiển thị thông báo
            var msg = "Đăng nhập thành công";
            alertSuccess(data.id, msg);
            window.location.replace("/");
        } else {
            var msg = "Số điện thoại hoặc mật khẩu không đúng"
            alertFail(data.id, msg);
        }
    }).fail(function() {
        var msg = "Đăng nhập không thành công"
        alertFail("abc", msg);
    });
    return false;
});

//
//chuyển sang trang nhập số điện thoại để lấy otp
//
$("#switch_to_send_sms").on("click", function(){
    $(".form").hide();
    $("#sendSMS").show();
});
$("#switch_to_confirm_sms").on("click", function(){

    var phone = $("#sendSMS input").val();
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    //validate giá trị
    if(phone == ""){
        var msg1 = "Vui lòng nhập số điện thoại";
        alertFail("phone", msg1);
        return;
    } else if(phone_regex.test(phone) == false){
        var msg1 = "Số điện thoại không hợp lệ";
        alertFail("phone", msg1);
        return false;
    }
    $.ajax({
        type: "POST",
        url: "/login/changepass/getotp",
        dataType: "json",
        data: {phone: phone},
        cache: false
    }).done(function(data){
        console.log(data)
        if(data.msg == "not-exist"){
            alertFail("fail", "Số điện thoại chưa được đăng kí")
        } else {
            alertSuccess("success", "Mã xác nhận đã được cho bạn");
            $(".form").hide();
            $("#otpConfirm").show();
            $("#sendSMS input").val("")
        }
       
    }).fail(function(){
        alertFail("fail", "Yêu cầu không thể thực hiện")
    });
    return false;
    
});

//
//Xác nhận otp và mật khẩu mới
//
$("#confirm_new_pass").on("click", function(){

    var flag = 0; //không có lỗi
    var newpass = $("#newpass").val();
    var confirm = $("#confirm").val();
    var otp = $("#otp").val();

    if(otp.length < 6) {
        alertFail("fail", "Mã xác nhận không hợp lệ");
        flag = 1;
    }

    if(newpass.length == 0) {
        alertFail("fail", "password không được để trống");
        flag = 1;
    } else if(newpass.length < 5){
        alertFail("fail", "password phải tối thiểu 5 kí tự");
        flag = 1;
    } else {
        if(newpass !== confirm){
            alertFail("fail", "Mật khẩu nhập lại không trùng khớp");
            flag = 1;
        }
    }
    if(flag == 0){
        $.ajax({
            type: "POST",
            url: "/login/changepass/confirmotp",
            dataType: "json",
            data: {otp: otp, newpass: newpass, confirm: confirm},
            cache: false
        }).done(function(data){
            console.log(data);
           if(data.msg == "code-resent"){
               alertFail("fail", "Có lỗi khi đổi mật khẩu, thử lại với mã số mới")
           } else if(data.msg == "success") {
               alertSuccess("success", "Đổi mật khẩu thành công");
               $(".switch_to_login").click();

               //reset form
                document.getElementById("otpConfirm").reset();
           } else {
                alertFail("not-match", "Mã xác nhận không đúng");
           }
        }).fail(function(){
            alertFail("fail", "Yêu cầu không thể thực hiện")
        });
    }
    
    return false;
    
});

//
//chuyển sang trang dăng nhập
//
$(".switch_to_login").on("click", function(){
    $(".form").hide();
    $("#login_form").show();
});

//
//Gửi lại mã 
//
$(".resendOTP").on("click", function(){
    $.ajax({
        type: "POST",
        url: "/login/changepass/resendotp",
        dataType: "json",
        data: {},
        cache: false
    }).done(function(data){
        console.log(data)
        if(data.msg == "not-exist"){
            alertFail("fail", "Số điện thoại chưa được đăng kí")
        } else {
            alertSuccess("resend", "Mã xác nhận mới đã được gửi")
            $("#otp").val("");
        }
    }).fail(function(){
        alertFail("fail", "Yêu cầu không thể thực hiện")
    });
});


//
//function hiển thị thông báo thành công
//
function alertSuccess(id, msg){
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${id}_${random}" class="alert alert-success" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    setTimeout(function(){
        $("#alert_" + id + "_" + random).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 2000);
}
//
//function hiển thị thông báo không thành công
//
function alertFail(id, msg){
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${id}_${random}" class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    
    setTimeout(function(){
        $("#alert_" + id + "_" + random).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 2000);
}