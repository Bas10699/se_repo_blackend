var express = require('express')
var router = express.Router()
var productUtil = require('../controller/product_information_controller')


router.get('/show_product_information',
    productUtil.show_product_information(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/add_product_information',
    // validateUtil.validate_add_product(),
    productUtil.add_product_information(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'เพิ่มสินค้าเรียบร้อย'
        })
    }
)


module.exports = router