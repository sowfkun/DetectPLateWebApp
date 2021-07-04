$("#body-loading").css("display", "block");

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
$(".table-result-area").css("height", $("#normal-detected-list").height() - titleHeight - 40 + "px");

/**
 * Set height for body of table
 */

headerHeight = $(".table-header").height();
$(".table-body").css("height", $(".table-result-area").height() - headerHeight + "px");

/**
 * zoom image when hover
 */

$("#img-area img").hover(function () {
    $(this).css({ "transform": "scale(2)", "transform-origin": "top right" });
}, function () {
    $(this).css({ "transform": "scale(1)", "margin-left": "0" });
})

$("#img-correct img").hover(function () {
    $(this).css({ "transform": "scale(2)", "transform-origin": "top" });
}, function () {
    $(this).css({ "transform": "scale(1)" });
})
//#endregion


//#region EventAndFunction  

/**
 * when load page, get detection of current date
 */

GetDetectionOfCurrentDate("undefined");
function GetDetectionOfCurrentDate(Clickid) {
    $.ajax({
        type: "GET",
        url: "api/GetDetectionOfCurrentDate",
        dataType: "json",
        cache: false
    }).done(function (data) {
        $(".table-body table").text("");
        if (data.length > 0) {
            data.forEach(detection => {
                AppendToTableOfDetectedVehicle(detection);
            });
            if (Clickid == "undefined") {
                id = "#" + data[data.length - 1].plate_number;
                $(id).click();
            } else {
                $(Clickid).click();
            }

        }
        $("#body-loading").css("display", "none");

    }).fail(function () {
        console.log("error when connect to server");
        $("#body-loading").css("display", "none");
    });

}

/**
 * on event new Detection
 */

socket.on("NewDetection", (data) => {
    AppendToTableOfDetectedVehicle(data.detection);
    // Show Detail
    FillDetectData(data.detection, data.stolen, data.registry, data.violation)
});


/**
 * Append new Detection into list Table
 */

function AppendToTableOfDetectedVehicle(detection) {
    timeDetect = new Date(detection.time_detect);
    timeFormat = timeDetect.getHours() + ":" + (timeDetect.getMinutes() < 10 ? "0" + timeDetect.getMinutes() : timeDetect.getMinutes());
    dateFormat = timeDetect.getDate() + "/" + (timeDetect.getMonth() + 1) + "/" + timeDetect.getFullYear();

    if (detection.stolen_status) {
        status = "Bị trộm cướp";
        background = "#f8d7da";
    } else if (detection.sanction_status) {
        status = "Đang phạt nguội";
        background = "#fff3cd";
    } else if (detection.registry_status == "expired") {
        status = "Hết hạn đăng kiểm";
        background = "#fff3cd";
    } else {
        status = "Bình thường";
        background = "white";
    }

    var element = `
        <tr class="table-row" id="${detection.plate_number}" style="background-color: ${background}">
            <td class="table-col" style="width: 25%">
                <p>${timeFormat}</p>
                <p>${dateFormat}</p>
            </td>
            <td class="table-col" style="width: 30%">${detection.plate_number}</td>
            <td class="table-col" style="width: 45%">
                <span><strong>${status}</strong></span>
            </td>
            <td class="table-col active" id="active_${detection.plate_number}" style="display: none; background: red; position: absolute; width: 10px; height: 65px; right:10px;">
            </td>
        </tr>
    `;
    $(element).prependTo(".table-body table");
}

/**
 * When click a detection in table, query data in database and fill data
 */

$("body").on("click", ".table-body table tr", function () {
    plateNumber = $(this).attr("id");
    //show loading
    $("#body-loading").css("display", "block");
    $.ajax({
        type: "POST",
        url: "api/GetDataByPlateNumber",
        dataType: "json",
        data: { plateNumber: plateNumber },
        cache: false
    }).done(function (data) {
        FillDetectData(data.detection, data.stolen, data.registry, data.violation);
        $("#body-loading").css("display", "none");
    }).fail(function () {
        console.log("error when connect to server");
        $("#body-loading").css("display", "none");
    });
});

/**
 * Fill detect detail 
 */

function FillDetectData(detection = "undefined", stolen, registry, violation) {
    // active select detection
    $(".active").css("display", "none");
    $("#active_" + detection.plate_number).css("display", "block");

    // detection information
    $("#img-area img").css("display", "block");
    $("#img-area img").attr("src", detection.img_url);
    $("#plate-number").text(detection.plate_number);
    $("#detect-time").text(FormatMongoDateIntoDayMonthYear(detection.time_detect));
    if (typeof (detection.position_detect) !== "undefined") {
        $("#plate-number").text(detection.position_detect);
    }
    // Violation
    if (detection.sanction_status == true) {
        $("#sanction-status").text("Phương tiện đang bị phạt nguội");
        $("#traffic-sanction-area").css("opacity", 1);
        $("#sanction-detail").attr("disabled", false);

        $("#violation-table-body").text("");
        violation.forEach(violation => {
            element = `
                <tr>
                    <td class="col-2">${violation.violation}</td>
                    <td class="col-2">${FormatMongoDateIntoDayMonthYear(violation.time_violation)}</td>
                    <td class="col-4">${violation.position_violation}</td>
                    <td class="col-1">${violation.penalty_fee.toLocaleString()} đ</td>
                    <td class="col-3">${violation.department}</td>
                </tr>
            `;
            $("#violation-table-body").append(element);
        });
    } else {
        $("#sanction-status").text("Không");
        $("#traffic-sanction-area").css("opacity", 0.3);
        $("#sanction-detail").attr("disabled", true);
    }

    // stolen
    if (detection.stolen_status == true) {
        $("#stolen").css("background-color", "#f8d7da");
        $("#stolen-area").css("opacity", 1);
        $("#stolen-date").text(FormatMongoDateIntoDayMonthYear(stolen.time_stolen));
        $("#stolen-position").text(stolen.position_stolen);
        $("#stolen-status").text("Chưa tìm thấy");
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
    $("#first-registry-date").text(FormatMongoDateIntoDayMonthYear(registry.first_registry_date));

    if (typeof (registry.recent_registry) == "undefined") {
        $("#recent-registry-area").css("opacity", 0.3);
        $("#recent-registry-date").text("");
        $("#registry-expired-date").text("");
        $("#registry-department").text("");
        $("#stamp-number").text("");
    } else {
        $("#recent-registry-area").css("opacity", 1);
        $("#recent-registry-date").text(FormatMongoDateIntoDayMonthYear(registry.recent_registry.registry_date));
        $("#registry-expired-date").text(FormatMongoDateIntoDayMonthYear(registry.recent_registry.expired_date));
        $("#registry-department").text(registry.recent_registry.department);
        $("#stamp-number").text(registry.recent_registry.stamp_number);
    }

    if (detection.registry_status == "expired") {
        $("#registry-status").text("Hết hạn đăng kiểm");
        $("#recent-registry-area").css("background-color", "#fff3cd");
    }
}

/**
 * Format Mongo Date to dd/MM/yyyy  
 */

function FormatMongoDateIntoDayMonthYear(date) {
    newDate = new Date(date);

    date = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    month = newDate.getMonth() < 9 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
    year = newDate.getFullYear();
    return date + "/" + month + "/" + year;
}

/**
 * When click search button, query data in database and fill data
 */
$("#search-button").submit(function () {
    return false;
})
$("#search-button").on("click", function () {
    $("#header-loading").css("display", "block");

    plateNumber = $("#search-box").val().toUpperCase();

    if (plateNumber == "") {
        alertFail("Vui lòng nhập biển số xe");
        $("#header-loading").css("display", "none");
        return;
    }
    //show loading
    $.ajax({
        type: "POST",
        url: "api/GetDataByPlateNumber",
        dataType: "json",
        data: { plateNumber: plateNumber },
        cache: false
    }).done(function (data) {
        if (data.registry !== undefined) {
            FillManualSearchData(plateNumber, data.stolen, data.registry, data.violation);
            $("#show-manual-search").click();

        } else {
            alertFail("Không tìm thấy biển số xe");
        }
        $("#header-loading").css("display", "none");

    }).fail(function () {
        console.log("error when connect to server");
        $("#header-loading").css("display", "none");

    });
    return false;
});


/**
 * Fill detect detail 
 */

function FillManualSearchData(plateNumber, stolen, registry, violation) {
    $("#plate-number-title").text(plateNumber);
    // Violation
    if (violation.length > 0) {
        $("#manual-violation-area").css("opacity", 1);
        $("#manual-body").text("");
        violation.forEach(violation => {
            element = `
                <tr>
                    <td class="col-2">${violation.violation}</td>
                    <td class="col-2">${FormatMongoDateIntoDayMonthYear(violation.time_violation)}</td>
                    <td class="col-3">${violation.position_violation}</td>
                    <td class="col-1">${violation.penalty_fee.toLocaleString()} đ</td>
                    <td class="col-3">${violation.department}</td>
                </tr>
            `;
            $("#manual-body").append(element);
        });
    } else {
        $("#manual-body").text("");
        $("#manual-violation-area").css("opacity", 0.3);
    }

    // stolen
    if (stolen !== undefined) {
        $("#manual-stolen").css("background-color", "#f8d7da");
        $("#manual-stolen-area").css("opacity", 1);
        $("#manual-stolen-date").text(FormatMongoDateIntoDayMonthYear(stolen.time_stolen));
        $("#manual-stolen-position").text(stolen.position_stolen);
        $("#manual-stolen-status").text("Chưa tìm thấy");
    } else {
        $("#manual-stolen").css("background-color", "white");
        $("#manual-stolen-area").css("opacity", 0.3);
        $("#manual-stolen-date").text("");
        $("#manual-stolen-position").text("");
        $("#manual-stolen-status").text("");
    }

    // Registry
    $("#manual-brand").text(registry.brand);
    $("#manual-vehicle-type").text(registry.type);
    $("#manual-chasis-no").text(registry.chasis_no);
    $("#manual-engine-no").text(registry.engine_no);
    $("#manual-owner").text(registry.owner);
    $("#manual-owner-address").text(registry.owner_address);
    $("#manual-color").text(registry.color);
    $("#manual-capacity").text(registry.capacity);
    $("#manual-seat-capacity").text(registry.seat_capacity);
    $("#manual-length").text(registry.size.length);
    $("#manual-width").text(registry.size.width);
    $("#manual-height").text(registry.size.height);
    $("#manual-first-registry-date").text(FormatMongoDateIntoDayMonthYear(registry.first_registry_date));

    if (typeof (registry.recent_registry) == "undefined") {
        $("#manual-registry-area").css("opacity", 0.3);
        $("#manual-registry-date").text("");
        $("#manual-registry-expired-date").text("");
        $("#manual-registry-department").text("");
        $("#manual-stamp-number").text("");
        $("#manual-registry-status").text("");
        $("#manual-registry-area").css("background-color", "white");
    } else {
        $("#manual-registry-area").css("opacity", 1);
        $("#manual-registry-date").text(FormatMongoDateIntoDayMonthYear(registry.recent_registry.registry_date));
        $("#manual-registry-expired-date").text(FormatMongoDateIntoDayMonthYear(registry.recent_registry.expired_date));
        $("#manual-registry-department").text(registry.recent_registry.department);
        $("#manual-stamp-number").text(registry.recent_registry.stamp_number);

        if (new Date(registry.recent_registry.expired_date) < new Date(new Date().toDateString())) {
            $("#manual-registry-status").text("Hết hạn đăng kiểm");
            $("#manual-registry-area").css("background-color", "#fff3cd");
        } else {
            $("#manual-registry-status").text("");
            $("#manual-registry-area").css("background-color", "white");
        }
    }


}

/**
 * Function Correct wrong detect plate number 
 */

$("#correct-button").on("click", function () {

    oldNumber = $("#plate-number").text();
    if (oldNumber == "") {
        return;
    }
    $("#hide-button").click();
    imgUrl = $("#img-area img").attr("src");
    $("#img-correct img").attr("src", imgUrl);
});

/**
 * Function confirm plate number 
 */

$("#confirm-button").on("click", function () {

    oldNumber = $("#plate-number").text();
    newNumber = $("#new-number").val();
    if (newNumber == "") {
        alertFail("Vui lòng nhập biển sô đúng")
        return;
    }
    $("#hide-button").click();
    imgUrl = $("#img-area img").attr("src");
    $("#img-correct img").attr("src", imgUrl);
    $.ajax({
        type: "POST",
        url: "api/CorrectPlateNumber",
        dataType: "json",
        data: { oldNumber: oldNumber, newNumber: newNumber, imgUrl: imgUrl },
        cache: false
    }).done(function (data) {

        if (data == "NotRegistered") {
            alertFail("Biển số không tồn tại");
            return;
        } else if (data == "Success") {
            id = "#" + newNumber;
            GetDetectionOfCurrentDate(id);
        }

    }).fail(function () {
        alertFail("Lỗi khi kết nối đến server")
    });
});

/**
 * Function show success music 
 */

function alertSuccess(msg) {
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${random}" class="alert alert-success" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    setTimeout(function () {
        $("#alert_" + random).fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 2000);
}

/**
 * Function show fail message 
 */

function alertFail(msg) {
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${random}" class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);

    setTimeout(function () {
        $("#alert_" + random).fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 2000);
}
//#endregion
