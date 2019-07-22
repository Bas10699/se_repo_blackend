var db = require('../connect/test_connect')
var jsonwebToken = require('jsonwebtoken')
var errorMessager = require('../const/error_message')
var constance =require('../const/constance')


exports.show_product = () =>{
    return(req,res,next) => {
        let sql = 'SELECT * From product'
        db.query(sql,(err,result)=>{
            if(err) throw err;
            else{
                req.result = result
                next();
            }
        })
    }
}

exports.show_product_info = () =>{
    return(req,res,next) => {
        let pro_id = req.body.pro_id
        db.query('SELECT * From product WHERE pro_id = ?',pro_id,(err,result)=>{
            if(err) throw err;
            if(result[0]){
                req.result = result[0]
                next()
            }
            else{
                res.status(200).json(errorMessager.err_product_info)
            }
        })
    }
}

exports.add_product = () =>{
    return(req,res,next) => {
        let products = {
            pro_name: req.body.pro_name,
            pro_cost: req.body.pro_cost,
            pro_price: req.body.pro_price,
            pro_amount: req.body.pro_amount,
            pro_details: req.body.pro_details,
            pro_status: req.body.pro_status
           
        }

        if(req.body.pro_image){
            console.log(1)
        }else{
            console.log(0)
        }



        db.query('INSERT INTO product SET ?',products, (err,result)=>{
            if(err) throw err;

            let plan_image = req.body.pro_image.slice(req.body.pro_image.indexOf(',') + 1)
            require("fs").writeFile("./image/product/product_" + result.insertId + '.png', plan_image, 'base64', function (err) {
                if (err) throw err;
                db.query(`UPDATE product SET pro_image = 'product/image/product_${result.insertId}.png'  WHERE pro_id = ${result.insertId}`, function (err, result) {
                    if (err) throw err;
                    next()
                });
            });
            next()
        })
    }
}

exports.update_product = () => {
    return(req,res,next) => {

        let products = {
            pro_name: req.body.pro_name,
            pro_cost: req.body.pro_cost,
            pro_price: req.body.pro_price,
            pro_amount: req.body.pro_amount,
            pro_details: req.body.pro_details,
            pro_status: req.body.pro_status
        }
        db.query('UPDATE product SET ? WHERE pro_id = ?',[products,req.body.pro_id],(err,result)=>{
            if(err) throw err;
            next()
        })
    }
}

exports.delete_product = () =>{
    return(req,res,next) => {
        db.query('DELETE FROM product WHERE pro_id = ?',req.body.pro_id,(err,result)=>{
            if(err) throw err;
            next()
        })
    }
}