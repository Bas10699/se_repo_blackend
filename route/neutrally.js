var express = require('express')
var router = express.Router()
var neutrallyUtil = require('../controller/neutrally_controller')
var validateUtil = require('../controller/validate_controller')

router.get('/get_order_all',
    validateUtil.validate_token_se(),
    neutrallyUtil.get_order_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)
router.post('/get_order_info',
    validateUtil.validate_token_se(),
    neutrallyUtil.get_order_info_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)
router.post('/add_quotation',
    validateUtil.validate_token_se(),
)

router.post('/get_quotation',
    validateUtil.validate_token_se(),
)

module.exports = router