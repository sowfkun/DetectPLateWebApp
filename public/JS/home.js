// set height for main layout
navbarHeight = $(".navbar").height() + 16;
$("#main-layout").css("height", $("body").height() - navbarHeight + "px");

// Set height for table of vehicle
titleHeight = $(".title").height();
$(".table-result-area").css("height", $(".group").height() - titleHeight - 40 + "px");

// Set height for body of table
headerHeight = $(".table-header").height();
$(".table-body").css("height", $(".table-result-area").height() - headerHeight + "px");

// zoom image when hover
$("#img-area img").hover(function () {
    console.log("hover")
    $(this).css({ "transform": "scale(1.7)", "transform-origin": "top right"});
}, function () {
    $(this).css({ "transform": "scale(1)", "margin-left":"0"});
})

// on event new Detection
socket.on("NewDetection", (data)=>{
    console.log(data);
});
