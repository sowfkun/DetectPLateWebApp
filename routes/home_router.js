const express = require('express');
const router = express.Router();


const Home_Ctrler = require('../controllers/home_ctrler')

//render trang đăng nhập
router.get('/', Home_Ctrler.HomePage);


module.exports = router;
