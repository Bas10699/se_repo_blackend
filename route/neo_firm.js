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

module.exports = router