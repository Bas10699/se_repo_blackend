var db = require('../connect/test_connect')

exports.get_notiOrderTrader = () =>{
    return(req,res,next)=>{
        db.query('SELECT * FROM order_trader WHERE noti_status_trader = 1',(err,result)=>{
            if(err) throw err
            else{
                req.result=result.length
                next()
            }
        })
    }
}

exports.get_noti_Middle = () =>{
    return(req,res,next)=>{
        db.query('SELECT * FROM order_trader WHERE noti_status = 1',(err,result)=>{
            if(err) throw err
            else{
                req.result=result.length
                next()
            }
        })
    }
}