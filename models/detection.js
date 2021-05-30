var mongoose = require("mongoose");


var detectionSchema = new mongoose.Schema({
    plate_number: {
        type: String,
        required: [true, 'plate_number is required']
    },
    img_url: {
        type: String,
        required: [true, 'img_url is required']
    },
    time_detect: {
        type: Date,
        required: [true, 'time_detect is required']
    },
    position_detect: {
        type: String  
    },
    stolen_status: {
        type: Boolean,
        require: [true, 'stolen_status is required']
    },
    registry_status: {
        type: String,
        enum: ["registed", "expired", "no_need"],
        require: [true, 'registry_status is required']
    },
    sanction_status: {
        type: Boolean,
        require: [true, 'sanction_status is required']
    }
});
var Detection = mongoose.model("Detection", detectionSchema, "detection");

module.exports = Detection;
