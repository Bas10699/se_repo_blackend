var db = require('../connect/test_connect')
var moment = require('moment')
var errorMessages = require('../const/error_message')

exports.get_order_se = () =>{
    return(req,res,next)=>{
        let name = req.body.name
            db.query('SELECT * FROM order_se WHERE se_name = ?',name,(err,result)=>{
                if(err) throw err
                else {
                    if(!result){
                        res.status(200).json({
                            'success' : false,
                            'error_message' : 'ไม่มีรายการของ '+name
                        })
                    }
                    else{
                        req.result = result
                        next()
                    }
                }
            })
    }
}