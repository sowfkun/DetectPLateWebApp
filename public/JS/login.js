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

$("#btn_login").on('click', function(){
    //lấy giá trị số điện thoại và mật khẩu
    var username = $("#login_form #username").val().trim();
    var password = $("#login_form #password").val().trim();
    
    if (username == "") {
        var msg = "Vui lòng nhập username";
        alertFail(msg);
        return;
    }
    //kiểm tra password
    if(password == "") {
        var msg = "Vui lòng nhập password";
        alertFail(msg);
        return;
    } else if(password.length < 5) {
        var msg = "Password tối thiểu phải có 5 kí tự";
        alertFail(msg);
        return;
    }
    
    //các giá trị đều hợp lệ
    $.ajax({
        type: "POST",
        url: "api/login",
        dataType: "json",
        data: {username: username, password: password},
        cache: false
    }).done (function (data) {
        if(data.msg == "success"){
            //hiển thị thông báo
            var msg = "Đăng nhập thành công";
            alertSuccess(msg);
            window.location.replace("/");
        } else {
            var msg = "username hoặc mật khẩu không đúng"
            alertFail(msg);
        }
    }).fail(function() {
        var msg = "Đăng nhập không thành công"
        alertFail(msg);
    });
    return false;
});

//
//function hiển thị thông báo thành công
//
function alertSuccess(msg){
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${random}" class="alert alert-success" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    setTimeout(function(){
        $("#alert_" + random).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 2000);
}
//
//function hiển thị thông báo không thành công
//
function alertFail(msg){
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${random}" class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    
    setTimeout(function(){
        $("#alert_" + random).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 2000);
}