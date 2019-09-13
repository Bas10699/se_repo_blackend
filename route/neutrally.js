var express = require('express')
var router = express.Router()
var neutrallyUtil = require('../controller/neutrally_controller')
var validateUtil = require('../controller/validate_controller')

router.post('/update_plant_stock',
    validateUtil.validate_token_se(),
    validateUtil.validate_update_plant_stock(),
    neutrallyUtil.update_plant_stock(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: 'แก้ไขสินค้าสำเร็จ'
        })
    }
)
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
    validateUtil.validate_get_order_info(),
    validateUtil.validate_token_se(),
    neutrallyUtil.get_order_info_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)
router.post('/update_status_order_trader',
    validateUtil.validate_token_trader(),
    neutrallyUtil.update_status_order_trader(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: 'อัปเดตสถานะสำเร็จ'
        })
    }
)
router.post('/add_invoice_neutrally',
    validateUtil.validate_token_se(),
    validateUtil.validate_add_invoice_neutrally(),
    neutrallyUtil.add_invoice_neutrally(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: 'เพิ่มใบแจ้งหนี้สำเร็จ'
        })
    }
)

router.post('/get_chart_frequency_all',
    neutrallyUtil.get_chart_frequency_all(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)
router.get('/get_plant_information',
    neutrallyUtil.get_plant_information(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/get_plant',
    neutrallyUtil.get_plant(),
    (req, res) => {

        res.status(200).json({
            'success': true,
            result: req.result
        })
    }

)
router.post('/get_plant_volume_all_se',
    neutrallyUtil.get_plant_volume_all_se(),

    function (req, res) {
        // console.log(res.result)
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }

)

router.get('/gg',
    neutrallyUtil.add_stock_order(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: 'สำเร็จ'
        })
    }
)

module.exports = router