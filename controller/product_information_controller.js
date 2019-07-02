var db = require('../connect/test_connect')
var jsonwebToken = require('jsonwebtoken')
var errorMessager = require('../const/error_message')
var constance =require('../const/constance')

exports.show_product_information = () =>{
    return(req,res,next) => {
        let sql = 'SELECT * From product_information'
        db.query(sql,(err,result)=>{
            if(err) throw err;
            else{
                let element_obj = []
            result.map((element) => {
                try {
                    element.product_status = JSON.parse(element.product_status)
                    element_obj.push(element)
                } catch (error) {

                }

            })
            req.result = result
            next();
            }
        })
    }
}

exports.add_product_information = () =>{
    // var arr = [ "John", "Peter", "Sally", "Jane" ];
    // var myJSON = JSON.stringify(arr);
    var obj = {obj : [{ name: "John", age: 30, city: "New York" },{ name: "John", age: 30, city: "New York" }]}
    var myJSON = JSON.stringify(obj);
    return(req,res,next) => {
        let products = {
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            volume: req.body.volume,
            product_status: myJSON
           
        }

        db.query('INSERT INTO product_information SET ?',products, (err,result)=>{
            if(err) throw err;

            console.log('ID : ',result.insertId)
            next()
        })
    }
}