

//var Staff = require("../models/staff_model");

// var bcrypt = require('bcrypt');
// const saltRounds = 10;

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTHTOKEN;
// const client = require('twilio')(accountSid, authToken);

// const cookieParams = {
//     httpOnly: true,
//     signed: true,
//     expires: new Date(Date.now() + 18000000)
// };


//
// Render login page
//
module.exports.loginPage = function (req, res) {
    res.render("login");
}