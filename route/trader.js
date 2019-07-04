var express = require('express')
var router = express.Router()
var productUtil = require('../controller/trader_controller')
var validateUtil = require('../controller/validate_controller')

router.get('/get_product',
    productUtil.get_product_information(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)


module.exports = router