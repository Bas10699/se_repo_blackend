var db = require('../connect/test_connect')
var jsonwebToken = require('jsonwebtoken')
var errorMessager = require('../const/error_message')
var constance = require('../const/constance')

exports.get_product_information = () => {
    return (req, res, next) => {
        let sql = 'SELECT * From product_information INNER JOIN product_plan ON product_information.product_id = product_plan.product_id'
        db.query(sql, (err, result) => {
            if (err) throw err;
            else {
                let element_obj = []
                result.map((element) => {
                    try {
                        element.plant = JSON.parse(element.plant)
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

exports.add_product_information = () => {
    // var arr = [ "John", "Peter", "Sally", "Jane" ];
    // var myJSON = JSON.stringify(arr);

    return (req, res, next) => {
        let products = {
            product_name: req.body.product_name,
            volume: req.body.volume,
            volume_type: req.body.volume_type,
            product_price: req.body.product_price,
            nutrient: req.body.nutrient,
            researcher_name: req.body.researcher_name,
            product_status: req.body.product_status

        }

        db.query('INSERT INTO product_information SET ?', products, (err, result) => {
            if (err) throw err;
            else {
                var obj = [{ plant_id: "3", volume: 30, volume_type: "Kg." }, { plant_id: "4", volume: 5, volume_type: "Kg." }] 
                var myJSON = JSON.stringify(obj);
                let product_plan = {
                    product_id: result.insertId,
                    nutrient_precent: req.body.nutrient_precent,
                    plant: myJSON,
                    researcher_id: req.body.researcher_id,
                    send_se: req.body.send_se

                }
                console.log('ID : ', result.insertId)
                db.query('INSERT INTO product_plan SET ?', product_plan, (err, result) => {
                    if (err) throw err;
                })
                next()
            }
        })
    }
}
exports.add_plant_test = () => {
    return (req, res, next) => {
        let plant = {
            plant_name: req.body.plant_name,
            caption: req.body.caption
        }
        db.query('INSERT INTO plant_information SET ?',plant,(err,result)=>{
            if(err) throw err;
            next()
        })
    }
}