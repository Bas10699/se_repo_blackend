var express = require('express')
var router = express.Router()
var researcherUtil = require('../controller/researcher_controller')
var validateUtil = require('../controller/validate_controller')

router.get('/get_plant_se',
    researcherUtil.get_plant_se(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    }
)

router.get('/get_demand_trader_all',
    researcherUtil.get_demand_trader_all(),
    (req, res) => {
        res.status(200).json({
            'success': true,
            result: req.result
        })
    })

module.exports = router