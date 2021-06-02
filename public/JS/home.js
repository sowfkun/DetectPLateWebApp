//#region SetUpAndEffect

/**
 * set height for main layout
 */

navbarHeight = $(".navbar").height() + 16;
$("#main-layout").css("height", $("body").height() - navbarHeight + "px");

/**
 * Set height for table of vehicle
 */

titleHeight = $(".title").height();
$(".table-result-area").css("height", $(".group").height() - titleHeight - 40 + "px");

/**
 * Set height for body of table
 */

headerHeight = $(".table-header").height();
$(".table-body").css("height", $(".table-result-area").height() - headerHeight + "px");

/**
 * zoom image when hover
 */

$("#img-area img").hover(function () {
    console.log("hover")
    $(this).css({ "transform": "scale(1.7)", "transform-origin": "top right"});
}, function () {
    $(this).css({ "transform": "scale(1)", "margin-left":"0"});
})
//#endregion


//#region EventAndFunction  

/**
 * on event new Detection
 */

socket.on("NewDetection", (data)=>{
    AppendToTableOfDetectedVehicle(data.detection);
    // Show Detail
    FillDetectData(data.detection, data.stolen, data.registry, data.violation)
});

/**
 * Append new Detection into list Table
 */

function AppendToTableOfDetectedVehicle(detection) {
    timeDetect = new Date(detection.time_detect);
    timeFormat = timeDetect.getHours() + ":" + (timeDetect.getMinutes() < 10 ? "0" + timeDetect.getMinutes(): timeDetect.getMinutes());
    dateFormat = timeDetect.getDate() + "/" + (timeDetect.getMonth() + 1) + "/" + timeDetect.getFullYear();

    if (detection.stolen_status) {
        status = "Mất cắp";
        alert  = "alert alert-danger";
    } else if (detection.sanction_status) {
        status = "Đang phạt nguội";
        alert  = "alert alert-warning";
    } else if (detection.registry_status == "expired") {
        status = "Hết hạn đăng kiểm";
        alert  = "alert alert-warning";
    } else {
        status = "Bình thường";
        alert  = "";
    }

    var element = `
        <tr class="table-row ${alert}" onclick="ShowDetailByPlateNumber("${detection.plate_number}")">
            <td class="table-col" style="width: 25%">
                <p>${timeFormat}</p>
                <p>${dateFormat}</p>
            </td>
            <td class="table-col" style="width: 30%">${detection.plate_number}</td>
            <td class="table-col" style="width: 45%">
                <span><strong>${status}</strong></span>
            </td>
        </tr>
    `;
    $(element).prependTo(".table-body table");
}

/**
 * Fill detect detail 
 */

function FillDetectData(detection, stolen, registry, violation){
    // detection information
    $("#img-area img").css("display", "block");
    $("#img-area img").attr("src", detection.img_url);
    $("#plate-number").text(detection.plate_number);
    $("#detect-time").text(detection.time_detect.toLocalString());
    if (typeof (detection.position_detect) !== "undefined") {
        $("#plate-number").text(detection.position_detect);
    }

    // Violation
    if (detection.violation_status == true){
        $("#sanction-status").text("Phương tiện đang bị phạt nguội");
        $("#traffic-sanction-area").css("opacity", 1);
        $("#sanction-detail").attr("disabled", true);
    } else {
        $("#sanction-status").text("Không");
        $("#traffic-sanction-area").css("opacity", 0.3);
        $("#sanction-detail").attr("disabled", false);
    }

    // stolen
    if (detection.stolen_status == true) {
        $("#stolen").css("background-color", "#f8d7da");
        $("#stolen-area").css("opacity", 1);
        $("#stolen-date").text(stolen.time_stolen);
        $("#stolen-position").text(stolen.position_stolen);
        $("#stolen-status").text(stolen.stolen_status);
    } else {
        $("#stolen").css("background-color", "white");
        $("#stolen-area").css("opacity", 0.3);
        $("#stolen-date").text("");
        $("#stolen-position").text("");
        $("#stolen-status").text("");
    }

    // Registry
    $("#brand").text(registry.brand);
    $("#vehicle-type").text(registry.type);
    $("#chasis-no").text(registry.chasis_no);
    $("#engine-no").text(registry.engine_no);
    $("#owner").text(registry.owner);
    $("#owner-address").text(registry.owner_address);
    $("#color").text(registry.color);
    $("#capacity").text(registry.capacity);
    $("#seat-capacity").text(registry.seat_capacity);
    $("#length").text(registry.size.length);
    $("#width").text(registry.size.width);
    $("#height").text(registry.size.height);
    $("#first-registry-date").text(registry.first_registry_date);

    if (typeof(registry.recent_registry) == "undefined") {
        $("#recent-registry-area").css("opacity", 0.3);
        $("#recent-registry-date").text("");
        $("#registry-expired-date").text("");
        $("#registry-department").text("");
        $("#stamp-number").text("");
    } else {
        $("#recent-registry-area").css("opacity", 1);
        $("#recent-registry-date").text(registry.recent_registry.registry_date.toLocalString());
        $("#registry-expired-date").text(registry.recent_registry.expired_date.toLocalString());
        $("#registry-department").text(registry.recent_registry.department);
        $("#stamp-number").text(registry.recent_registry.stamp_number);
    }

    if (detection.registry_status == "expired") {
        $("#registry-status").text("Hết hạn đăng kiểm");
        $("#recent-registry-area").css("background-color", "#fff3cd");
    }
}
//#endregion
