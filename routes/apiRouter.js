const express    = require('express');
const router     = express.Router();
const middleware = require("../middleware/checkLogin");

var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/result');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname.replace(/\s/g, ""));
    }
})
var upload = multer({
    storage: storage
})

const apiCtrler = require('../controllers/apiCtrler')

// Receive data from egde
router.post('/ProcessDataFromEdge', middleware.checkLogin, upload.array("image"), apiCtrler.ProcessDataFromEdge);

// Get Data of Plate Number
router.post('/GetDataByPlateNumber', middleware.checkLogin, apiCtrler.GetDataByPlateNumber);

// Get Detection of current date
router.get('/GetDetectionOfCurrentDate', middleware.checkLogin, apiCtrler.GetDetectionOfCurrentDate);

// login
router.post('/login', apiCtrler.Login);


module.exports = router;
