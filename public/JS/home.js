// set height for main layout
navbarHeight = $(".navbar").height() + 16;
$("#main-layout").css("height", $("body").height() - navbarHeight + "px");

// Set height for table of vehicle
titleHeight  = $(".title").height();
$(".list-detected-vehicle").css("height", $(".group").height() - titleHeight - 40 + "px");