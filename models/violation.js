var mongoose = require("mongoose");


var violationSchema = new mongoose.Schema({
    plate_number: {
        type: String,
        required: [true, 'plate_number is required']
    },
    violation: {
        type: String,
        required: [true, 'violation is required']
    },
    penalty_fee: {
        type: Number,
        required: [true, 'penalty_fee is required']
    },
    time_violation: {
        type: Date,
        required: [true, 'time_violation is required']
    },
    position_violation: {
        type: String,
        required: [true, 'position_violation is required']
    },
    department: {
        type: String,
        require: [true, 'department is required']
    },
    violation_status: {
        type: String,
        enum: ["paid", "notpaid"]
    }
});
var Violation = mongoose.model("Violation", violationSchema, "violation");

module.exports = Violation;
