var Detection = require("../models/detection");
var Registry  = require("../models/registry");
var Stolen    = require("../models/stolen");
var Violation = require("../models/violation");
var User      = require("../models/user");
var Helper    = require("../helper")

/**
 * Receive data from edge, query from database and send to front end
 */

module.exports.ProcessDataFromEdge = function (req, res) {

    //image     = req.files[0];
    //imgUrl    = "result/" + image.originalname;
    imgUrl    = "result/";
    listPlate = req.body.listplate;

    if (typeof (listPlate) == "string")
        CheckPlateAndCreateDocument(listPlate.toUpperCase(), imgUrl, req, res);
    else
        listPlate.forEach(plate => {
            CheckPlateAndCreateDocument(plate.toUpperCase(), imgUrl, req, res);
        });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end("done");
}

/**
 * Find Data of a PLate Number then send to front end
 */

module.exports.GetDataByPlateNumber = async function (req, res) {

    plateNumber = req.body.plateNumber;

    CurrentDate = new Date(new Date().toDateString());
    nextDay     = new Date(CurrentDate);
    nextDay.setDate(nextDay.getDate() + 1);

    Promise.all([
        Detection.find({ time_detect: { $gte: CurrentDate, $lt: nextDay }, plate_number: plateNumber }),
        Stolen.find({ "plate_number": plateNumber, "stolen_status": "notfound" }),
        Violation.find({ "plate_number": plateNumber, "violation_status": "notpaid" }).sort({ time_violation: -1 }),
        Registry.find({ "plate_number": plateNumber })
    ]).then(([Detection, Stolen, Violation, Registry]) => {
        data = {
            detection: Detection[0],
            stolen: Stolen[0],
            registry: Registry[0],
            violation: Violation
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    })
}

/**
 * Find Data of a PLate Number then send to front end
 */

 module.exports.GetDetectionOfCurrentDate = async function (req, res) {

    CurrentDate = new Date(new Date().toDateString());
    nextDay     = new Date(CurrentDate);
    nextDay.setDate(nextDay.getDate() + 1);

    detection = await Detection.find({ time_detect: { $gte: CurrentDate, $lt: nextDay } }).sort({ time_detect: 1 });
    res.writeHead(200, {'Content-type': 'application/json'});
    res.end(JSON.stringify(detection));
    
}

/**
 * Login
 */

var bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParams = {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + 18000000)
};

module.exports.Login = function (req, res) {
    username = req.body.username.trim();
    password = req.body.password.trim();

    if (username == "" || username == "undefined" || password == "" || password == "undefined" || password.length < 5) {
        res.end(JSON.stringify("error"));
        return;
    } 

    User.find({username: username}, {_id: 0, username: 1, password: 1}).then((docs) => {
        if (docs.length > 0) {
            bcrypt.compare(password, docs[0].password, function (err, result) {
                if (result == false) {
                    res.writeHead(200, { 'Content-Type': 'application/json'});
                    res.end(JSON.stringify({'msg': "fail"}));
                } else {
                    res.cookie('_hh', docs[0].username, cookieParams);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({'msg': "success"}));
                }
            });
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({'msg': "fail"}));
        }
    });
}

/**
 * Helper function 
 */

async function CheckPlateAndCreateDocument(plate, imgUrl, req, res) {

    // Check if vehicle detected or not
    // If vehicle detected then return
    FindResult = await Detection.find({plate_number: plate}, { time_detect: 1, plate_number: 1, _id: 0 }).sort({ time_detect: -1 }).limit(1);

    if (FindResult.length !== 0) {
        isDetected = Helper.checkTwoDateIsSameDate(FindResult[0]._doc.time_detect, new Date());
        if (isDetected) {
            return;
        }
    }

    // Check if plate exist in system or not
    isRegistered = await Registry.find({ "plate_number": plate });

    if (isRegistered.length == 0) {
        console.log(isRegistered)
        return;    
    }

    Promise.all([
        Stolen.find({ "plate_number": plate, "stolen_status": "notfound" }),
        Violation.find({ "plate_number": plate, "violation_status": "notpaid" }).sort({ time_violation: -1 }),
        Registry.find({ "plate_number": plate })
    ]).then(([Stolen, Violation, Registry]) => {

        // If Stolen is empty then vehicle status is False else True
        stolen_status = Stolen.length == 0 ? false : true;
        // If Violation is empty then Violation status is False else True
        sanction_status = Violation.length == 0 ? false : true;
        // If recent registry is empty then registry status is "noneed" 
        // Else if date is less than currentDate status is expired
        if (typeof (Registry[0].recent_registry) == "undefined") {
            registry_status = "no_need";
        } else if (Registry[0].recent_registry.expired_date < Date.now()) {
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

        // store in database
        newDetection.save((function (err, doc) {
            if (err) throw err;
            console.log("Detection inserted")
        }));

        Data = {
            detection: newDetection,
            stolen: Stolen[0],
            registry: Registry[0],
            violation: Violation
        }

        // emit event new detection
        req.io.emit("NewDetection", Data);

    })
}
