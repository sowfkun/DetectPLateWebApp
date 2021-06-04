var User = require("../models/user");

/**
 * Check login
 */
module.exports.checkLogin = async (req, res, next) => {
    // get cookie from req and get username
    var cookies  = req.signedCookies;
    console.log(cookies);
    var username = cookies._hh;

    // if username is not defined then return to login page
    if(typeof(username) == "undefined"){
        res.redirect('/login');
        return;
    }

    // check if username is valid
    var user = await User.find({username: username}, {_id: 0, username: 1});
    
    if(user.length == 0) {
        res.redirect('/login');
        return;
    }

    next();
}