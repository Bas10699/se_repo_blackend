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
router.post('/update_status_date_of_delivery_order_trader',
    validateUtil.validate_token_trader(),
    neutrallyUtil.update_status_date_of_delivery_order_trader(),
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

router.get('/get_plant',
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
router.get('/get_plant_all_se',
    neutrallyUtil.get_linechart_some_se(),

    function (req, res) {
        // console.log(res.result)
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)
router.post('/add_order_se',
    neutrallyUtil.add_order_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: 'ออกใบสั่งซื้อสำเร็จ'
        })
    }
)

router.get('/get_order_se_all',
    neutrallyUtil.get_order_se_all(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.post('/get_order_se',
    neutrallyUtil.get_order_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.post('/add_order_se_payment',
    validateUtil.validate_token_se(),
    neutrallyUtil.add_order_se_payment(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: 'ส่งหลักฐานการชำระเงินสำเร็จ'
            // result: req.result
        })
    }
)

router.get('/get_plant_name',
    neutrallyUtil.get_plant_name(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.post('/add_year_round',
    neutrallyUtil.add_year_round(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: 'วางแผนการเพาะปลูกสำเร็จ'
        })
    }
)
router.get('/get_year_round',
    neutrallyUtil.get_year_round(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.get('/get_count_se_all',
    neutrallyUtil.get_count_se_all(),
    (req, res) => {
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