const express = require('express');
const router = express.Router();

var multer = require('multer')

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
router.post('/ProcessDataFromEdge', upload.array("image"), apiCtrler.ProcessDataFromEdge);


module.exports = router;
