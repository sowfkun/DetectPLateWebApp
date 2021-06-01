var Detection = require("../models/detection");
var Registry  = require("../models/registry");
var Stolen    = require("../models/stolen");
var Violation = require("../models/violation");
var Helper    = require("../helper")

module.exports.ProcessDataFromEdge = function (req, res) {
    
    // image     = req.files[0];
    // imgUrl    = "result/" + image.originalname;
    imgUrl    = "result/";
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

async function CheckPlateAndCreateDocument(plate, imgUrl, req) {

    // Check if vehicle detected or not
    // If vehicle detected then return
    FindResult = await Detection.find({plate_number: plate}, { time_detect: 1, plate_number: 1, _id: 0 }).sort({ time_detect: -1 }).limit(1);

    if (FindResult.length !== 0) {
        isDetected = Helper.checkTwoDateIsSameDate(FindResult[0]._doc.time_detect, new Date());
        if (isDetected) {
            return;
        }
    }

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
            time_detect: new Date(),
            stolen_status: stolen_status,
            registry_status: registry_status,
            sanction_status: sanction_status,
        });

        // store in database
        newDetection.save((function (err, doc) {
            if (err) throw err;
            console.log("Detection inserted")
        }));

        Data = {
            detection: newDetection,
            stolen: Stolen,
            registry: Registry,
            violation: Violation
        }

        // emit event new detection
        req.io.emit("NewDetection", Data);
    })
}
