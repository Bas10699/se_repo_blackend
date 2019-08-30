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
    neutrallyUtil.add_warehouse_order(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: 'สำเร็จ'
        })
    }
)

module.exports = router