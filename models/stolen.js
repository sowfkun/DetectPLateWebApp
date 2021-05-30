var mongoose = require("mongoose");


var stolenSchema = new mongoose.Schema({
    plate_number: {
        type: String,
        required: [true, 'plate_number is required']
    },
    time_stolen: {
        type: Date,
        required: [true, 'time_violation is required']
    },
    position_stolen: {
        type: String,
        required: [true, 'position_violation is required']
    },
    stolen_status: {
        type: String,
        enum: ["found", "notfound"]
    }
});
var Stolen = mongoose.model("Stolen", stolenSchema, "stolen");

module.exports = Stolen;
