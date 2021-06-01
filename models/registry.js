var mongoose = require("mongoose");


var registrySchema = new mongoose.Schema({
    plate_number: {
        type: String,
        required: [true, 'plate_number is required']
    },
    brand: {
        type: String,
        required: [true, 'brand is required']
    },
    type: {
        type: String,
        required: [true, 'brand is required']
    },
    chasis_no: {
        type: String,
        required: [true, 'brand is required']
    },
    engine_no: {
        type: String,
        required: [true, 'brand is required']
    },
    owner: {
        type: String,
        required: [true, 'brand is required']
    },
    owner_address: {
        type: String,
        required: [true, 'brand is required']
    },
    color: {
        type: String,
        required: [true, 'brand is required']
    },
    capacity: {
        type: Number,
        required: [true, 'brand is required']
    },
    seat_capacity: {
        type: Number,
        required: [true, 'brand is required']
    },
    size: {
        type: Object,
        required: [true, 'size is required'],
        properties: {
            length: {
                type: Number,
                required: [true, "length is required"]
            },
            width: {
                type: Number,
                required: [true, 'width is required']
            },
            height: {
                type: Number,
                required: [true, 'height is required']
            }
        }
    },
    first_registry_date: {
        type: Date,
        required: [true, 'first_registry_date is required']
    },
    recent_registry: {
        type: Object,
        properties: {
            registry_date: {
                type: Date,
                required: [true, "registry_date is required"]
            },
            expired_date: {
                type: Date,
                required: [true, "due_date is required"]
            },
            department: {
                type: String,
                required: [true, 'department is required']
            },
            stamp_number: {
                type: String,
                required: [true, 'stamp_number is required']
            }
        }
    }
});
var Registry = mongoose.model("Registry", registrySchema, "registry");

module.exports = Registry;
