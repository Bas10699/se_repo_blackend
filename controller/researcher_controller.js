var db = require('../connect/test_connect')
var moment = require('moment')
var errorMessages = require('../const/error_message')

exports.get_plant_se = () =>{
    return(req,res,next)=>{
        db.query('SELECT user_information.name,manufacture_information.plant_type,farmer_information.title_name,farmer_information.first_name,farmer_information.last_name FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = 3',(err,result)=>{
            if (err) throw err
            else{
                result.map((element)=>{
                    element.plant_type = JSON.parse(element.plant_type)
                    
                })
                req.result = result
                next()
            }
        })
    }
}

exports.add_want_ = () =>{
    return(req,res,next)=>{
        console.log(req.body)
        db.query('INSERT INTO product_information SET ?',(err,result)=>{
            if(err) throw err
        })
    }
}

exports.get_want_trader = () =>{
    return(req,res,next)=>{
        db.query('SELECT * FROM product_information',(err,result)=>{
            if(err) throw err
            else{
                next()
            }
        })
    }
}