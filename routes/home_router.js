const express     = require('express');
const router      = express.Router();
const middleware  = require("../middleware/checkLogin");

const Home_Ctrler = require('../controllers/home_ctrler')

//render trang đăng nhập
router.get('/', middleware.checkLogin, Home_Ctrler.HomePage);


module.exports = router;
