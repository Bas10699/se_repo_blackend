var db = require('../connect/test_connect')
var moment = require('moment')
var errorMessages = require('../const/error_message')

exports.get_order_trader = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM order_trader', (err, result) => {
            if (err) throw err
            else {
                
                result.map((element) => {
                    element.detail = JSON.parse(element.detail)
                })
                req.result = result
                next()
            }
        })
    }
}

exports.get_order_info_trader = () => {
    return (req, res, next) => {
        console.log(req.body.order_id)
        db.query('SELECT * FROM order_trader WHERE order_id = ?',  req.body.order_id, (err, result) => {
            if (err) throw err
            if (!result[0]) {
                res.status(200).json(errorMessages.err_order_info)
            }
            else {
                db.query('SELECT * FROM userprofile WHERE user_id = ?', req.user_id, (err, result_profile) => {
                    if (err) throw err
                    else {
                        result[0].detail = JSON.parse(result[0].detail)
                        req.result = {
                            ...result[0],
                            ...result_profile[0]
                        }
                        next()
                    }

                })
            }
        })
    }
}

exports.add_order_info_se_small = () => {
    
}

exports.get_quotation = () => {
    return (req, res, next) => {
        let quotation_id = req.body.quotation_id
        db.query('SELECT * FROM quotation WHERE quotation_id = ?', quotation_id, (err, result) => {
            if (err) throw err
            else {
                if (!result[0]) {
                    res.status(200).json({
                        success: false,
                        error_message: "ไม่พบ ID ใบเสนอราคา หรือ ID ใบเสนอราคาไม่ถูกต้อง"
                    })
                }
                else {
                    req.result = result[0]
                    next()
                }
            }
        })
    }
}
exports.add_quotation_neutrally = () =>{
    return(req,res,next) =>{
        db.query('INSERT INTO quotation SET ?',(err)=>{

        })
    }
}