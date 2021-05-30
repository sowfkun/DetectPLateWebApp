var Detection = require("../models/detection");
var Registry  = require("../models/registry");
var Stolen    = require("../models/stolen");
var Violation = require("../models/violation");


module.exports.ProcessDataFromEdge = function (req, res) {
    
    image     = req.files[0];
    imgUrl    = "result/" + image.originalname;
    listPlate = req.body.listplate;

    if (typeof (listPlate) == "string")
        CheckPlateAndCreateDocument(listPlate.toUpperCase(), imgUrl, req);
    else
        listPlate.forEach(plate => {
            CheckPlateAndCreateDocument(plate.toUpperCase(), imgUrl, req);
        });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end("done");
}

function CheckPlateAndCreateDocument(plate, imgUrl, req) {
    Promise.all([
        Stolen.find({ "plate_number": plate, "stolen_status": "notfound" }),
        Violation.find({ "plate_number": plate, "violation_status": "notpaid" }),
        Registry.find({ "plate_number": plate })
    ]).then(([Stolen, Violation, Registry]) => {

        // If Stolen is empty then vehicle status is False else True
        stolen_status = Stolen.length == 0 ? false : true;
        // If Violation is empty then Violation status is False else True
        sanction_status = Violation.length == 0 ? false : true;
        // If recent registry is empty then registry status is "noneed" 
        // Else if date is less than currentDate status is expired
        if (typeof (Registry.recent_registry) == "undefined") {
            registry_status = "no_need";
        } else if (Registry.recent_registry.expired_date > Date.now()) {
            registry_status = "expired";
        } else {
            registry_status = "registed";
        }
        
        // Create new Detection documents
        var newDetection = new Detection({
            plate_number: plate,
            img_url: imgUrl,
            time_detect: Date.now(),
            stolen_status: stolen_status,
            registry_status: registry_status,
            sanction_status: sanction_status,
        });
        console.log(newDetection)
        // store in database
        newDetection.save((function (err, doc) {
            if (err) throw err;
            console.log("Detection inserted")
        }));

        // emit event new detection
        req.io.emit("NewDetection", "success");
    })
}