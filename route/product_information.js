var express = require('express')
var router = express.Router()
var productUtil = require('../controller/product_information_controller')


router.get('/show_product_information',
    productUtil.get_product_information(),
    productUtil.get_plant_send_all_year(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result,
            result_1:req.result_1
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
router.post('/add_plant',
    productUtil.add_plant_test(),
    (req,res)=>{
        res.status(200).json({
            success: true,
            message: 'เพิ่มพืชเรียบร้อย'
        })
    })


module.exports = router