var express = require('express')
var router = express.Router()
var productUtil = require('../controller/trader_controller')
var validateUtil = require('../controller/validate_controller')

router.get('/get_product',
    // validateUtil.validate_token_user(),
    productUtil.get_product(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)
router.post('/get_product_information',
    // validateUtil.validate_token_user(),
    productUtil.get_product_information(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/add_cart_trader',
    validateUtil.validate_token_user(),
    // validateUtil.validate_add_cart(),
    productUtil.add_cart_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "เพิ่มสินค้าลงในตะกร้าสำเร็จ"
        })
    }
)

router.post('/delete_cart_product_tarder',
    validateUtil.validate_token_user(),
    productUtil.delete_product_cart(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "ลบสินค้าในตะกร้าสำเร็จ"
        })
    })

router.post('/update_cart_trader',
    validateUtil.validate_token_user(),
    productUtil.update_cart_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "แก้ไขจำนวนสินค้าสำเร็จ"
        })
    }
)

router.get('/get_cart_trader',
    validateUtil.validate_token_user(),
    productUtil.get_cart_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/add_order',
    validateUtil.validate_token_user(),
    validateUtil.validate_add_order(),
    productUtil.add_order_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result,
            message: "สั่งซื้อสินค้าสำเร็จ"
        })
    }
)

router.post('/update_status_order_trader',
    validateUtil.validate_token_user(),
    productUtil.update_status_order_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "อัปเดตสถานะสินค้าสำเร็จ"
        })
    }
)

router.post('/finish_trader_order',
    validateUtil.validate_token_user(),
    productUtil.finish_trader_order(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "อัปเดตสถานะสินค้าสำเร็จ"
        })
    }
)

router.get('/get_order',
    validateUtil.validate_token_user(),
    productUtil.get_order_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/get_order_info',
    validateUtil.validate_token_user(),
    productUtil.get_order_info_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)
router.post('/get_invoice_trader',
    validateUtil.validate_token_user(),
    productUtil.get_invoice_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)
router.post('/add_proof_of_payment_trader',
    validateUtil.validate_token_user(),
    validateUtil.validate_add_proof_of_payment_trader(),
    productUtil.add_proof_of_payment_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: 'ส่งหลักฐานการชำระเงินแล้ว'
        })
    }
)
router.post('/get_proof_of_payment_trader',
    validateUtil.validate_token_user(),
    productUtil.get_proof_of_payment_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/add_send_demand',
    validateUtil.validate_token_user(),
    validateUtil.validate_add_send_demand(),
    productUtil.add_send_demand(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "ส่งความต้องการสำเร็จ"
        })
    }
)
router.post('/update_send_demand',
    validateUtil.validate_token_user(),
    validateUtil.validate_add_send_demand(),
    productUtil.update_send_demand(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "อัปเดตความต้องการสำเร็จ"
        })
    }
)


router.get('/get_send_demand_personal',
    validateUtil.validate_token_user(),
    productUtil.get_send_demand_personal(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/get_product_plan',
    validateUtil.validate_token_user(),
    productUtil.get_product_plan(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/get_product_plan_price',
    validateUtil.validate_token_user(),
    productUtil.get_product_plan_price(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)


router.post('/get_send_demand_draft',
    validateUtil.validate_token_user(),
    productUtil.get_send_demand_draft(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

// router.get('/get_send_demand',
//     productUtil.get_send_demand(),
//     (req, res) => {
//         res.status(200).json({
//             success: true,
//             result: req.result
//         })
//     }
// )

router.post('/add_review_order',
    productUtil.add_review_order(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "ส่งรีวิวสำเร็จ"
        })
    }
)


router.get('/image/:id',
    function (req, res) {

        require("fs").readFile(__dirname.replace("route", "") + 'image/product/' + req.params.id, (err, data) => {

            if (err !== null) {
                res.sendFile(__dirname.replace("route", "") + 'image/default_product.png')
            } else {
                res.sendFile(__dirname.replace("route", "") + 'image/product/' + req.params.id)
            }

        })

    })
router.get('/image/payment/:id',
    function (req, res) {

        require("fs").readFile(__dirname.replace("route", "") + 'image/payment/' + req.params.id, (err, data) => {

            if (err !== null) {
                res.sendFile(__dirname.replace("route", "") + 'image/default_product.png')
            } else {
                res.sendFile(__dirname.replace("route", "") + 'image/payment/' + req.params.id)
            }

        })

    })

module.exports = router