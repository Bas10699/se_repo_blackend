var express = require('express')
var router = express.Router()
var researcherUtil = require('../controller/researcher_controller')
var validateUtil = require('../controller/validate_controller')

router.get('/get_plant_se',
    researcherUtil.get_plant_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.get('/get_plant',
    researcherUtil.get_plant(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.get('/get_demand_trader_all',
    researcherUtil.get_demand_trader_all(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    })


router.get('/get_demand_personal',
    validateUtil.validate_token_user(),
    researcherUtil.get_demand_personal(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    })

router.post('/get_demand_detail',
    validateUtil.validate_token_user(),
    researcherUtil.get_demand_detail(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    })


router.post('/add_product_plan',
    validateUtil.validate_token_user(),
    validateUtil.validate_add_product_plan(),
    researcherUtil.add_product_plan(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            message: "เพิ่มสูตรการพัฒนาสำเร็จ"
        })
    })


router.get('/get_product_plan_detail',
    validateUtil.validate_token_user(),
    researcherUtil.get_product_plan_detail(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    })

router.get('/get_history_product_plan_detail',
    validateUtil.validate_token_user(),
    researcherUtil.get_history_product_plan_detail(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    })

router.post('/confirm_resercher_damand',
    validateUtil.validate_token_user(),
    researcherUtil.confirm_resercher_damand(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            message: "ยืนยันการพัฒนาสำเร็จ"
        })
    })

router.post('/delete_product_plan',
    validateUtil.validate_token_user(),
    researcherUtil.delete_product_plan(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            message: "ลบสูตรพัฒนาสำเร็จ"
        })
    })
router.post('/send_developer_demand',
    validateUtil.validate_token_user(),
    researcherUtil.send_developer_demand(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            message: "ส่งสูตรพัฒนาสำเร็จ"
        })
    })


router.get('/get_plant_all_mount',
    // validateUtil.validate_token_user(),
    researcherUtil.get_plant_all_mount(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    })


router.get('/image/:id',
    function (req, res) {

        console.log("image", req.params.id)

        require("fs").readFile(__dirname.replace("route", "") + 'image/productPlan/' + req.params.id, (err, data) => {

            if (err !== null) {
                res.sendFile(__dirname.replace("route", "") + 'image/default_product.png')
            } else {
                res.sendFile(__dirname.replace("route", "") + 'image/productPlan/' + req.params.id)
            }

        })

    })

module.exports = router