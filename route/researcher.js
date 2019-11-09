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



router.post('/confirm_resercher_damand',
    validateUtil.validate_token_user(),
    researcherUtil.confirm_resercher_damand(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            message: "ยืนยันการพัฒนาสำเร็จ"
        })
    })


module.exports = router