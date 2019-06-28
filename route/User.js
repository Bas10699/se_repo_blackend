var express = require('express')
var router = express.Router()
var userUtil = require('../controller/user_controller')
var validateUtil = require('../controller/validate_controller')


router.post('/user_register', 
    
    userUtil.User_Register(),
    (req,res) => {
        res.status(200).json({
            'success': true,
            message: "สมัครสมาชิกสำเร็จ"
        })
    }
)

router.post('/user_login',
    validateUtil.validate_user_login(),
    userUtil.User_Login(),
    function (req, res) {
        res.status(200).json({
            'success': true,
            token: req.token,
            message: "เข้าสู่ระบบสำเร็จ"
        })
    }

)
 

router.post('/user_update_password',
    validateUtil.validate_user_update_password(),
    validateUtil.validate_token_user(),
    userUtil.user_update_password(),
    function (req, res) {
        res.status(200).json({
            'success': true,
            message: "แก้ไขรหัสผ่านเรียบร้อย"
        })
    }
)

router.post('/user_update_data',
    //validateUtil.validate_user_update_data(),
    validateUtil.validate_token_user(),
    userUtil.user_update_data(),
    function (req, res) {
        res.status(200).json({
            'success': true,
            message: "แก้ไขข้อมูลเรียนร้อย"
        })
    }
)

module.exports = router
