var express = require('express')
var router = express.Router()
var neoFirmUtil = require('../controller/neo_firm_colltroller')
var validateUtil = require('../controller/validate_controller')

router.get('/get_order_se',
    validateUtil.validate_token_se_small(),
    neoFirmUtil.get_order_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)
router.post('/get_detail_order_se',
    validateUtil.validate_token_se_small(),
    neoFirmUtil.get_detail_order_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)
router.get('/get_plant_in_network',
    validateUtil.validate_token_se_small(),
    neoFirmUtil.get_linechart_some_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.get('/get_farmer_se',
    validateUtil.validate_token_se_small(),
    neoFirmUtil.get_farmer_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.post('/add_order_farmer',
    validateUtil.validate_token_se_small(),
    neoFirmUtil.add_order_farmer(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            message: "สั่งวัตถุดิบเกษตรกรสำเร็จ"
        })
    }
)

router.post('/get_order_farmer',
    validateUtil.validate_token_se_small(),
    neoFirmUtil.get_order_farmer(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.post('/add_invoice_se',
    validateUtil.validate_token_se_small(),
    neoFirmUtil.add_invoice_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.post('/update_order_se_status',
    validateUtil.validate_token_se_small(),
    neoFirmUtil.update_order_se_status(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            message: "ออกใบเสร็จสำเร็จ"
        })
    }
)

router.get('/get_Certified',
    validateUtil.validate_token_se_small(),
    neoFirmUtil.get_Certified(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    })

router.get('/up_stock_se',
    // validateUtil.validate_token_se_small(),
    neoFirmUtil.up_stock_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

module.exports = router