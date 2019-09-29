var express = require('express')
var router = express.Router()
var neoFirmUtil = require('../controller/neo_firm_colltroller')
var validateUtil = require('../controller/validate_controller')

router.post('/get_order_se',
    neoFirmUtil.get_order_se(),
    validateUtil.validate_token_se_small(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

module.exports = router