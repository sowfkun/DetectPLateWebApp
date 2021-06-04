var mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    }
});
var User = mongoose.model("User", userSchema, "user");

module.exports = User;
