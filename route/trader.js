var express = require('express')
var router = express.Router()
var productUtil = require('../controller/trader_controller')
var validateUtil = require('../controller/validate_controller')

router.get('/get_product',
    validateUtil.validate_token_trader(),
    productUtil.get_product(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)
router.post('/get_product_information',
    validateUtil.validate_token_trader(),
    productUtil.get_product_information(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/add_cart_trader',
    validateUtil.validate_token_trader(),
    productUtil.add_cart_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "เพิ่มสินค้าลงในตะกร้าสำเร็จ"
        })
    }
)

router.post('/update_cart_trader',
    validateUtil.validate_token_trader(),
    productUtil.update_cart_trader(),
    (req,res) => {
        res.status(200).json({
            success: true,
            message: "แก้ไขจำนวนสินค้าสำเร็จ"
        })
    }
)

router.post('/get_cart_trader',
    validateUtil.validate_token_trader(),
    productUtil.get_cart_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/add_order',
    validateUtil.validate_token_trader(),
    productUtil.add_order_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "สั่งซื้อสินค้าสำเร็จ"
        })
    }
)

router.get('/get_order',
    validateUtil.validate_token_trader(),
    productUtil.get_order_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

module.exports = router