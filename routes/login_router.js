const express = require('express');
const router = express.Router();


const loginCtrler = require('../controllers/login_ctrler')

//render trang đăng nhập
router.get('/', loginCtrler.loginPage);


module.exports = router;

