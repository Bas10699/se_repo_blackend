var db = require('../connect/test_connect')

exports.get_product_information = () => {
    return (req, res, next) => {
        let sql = 'SELECT * From product_information INNER JOIN product_plan ON product_information.product_id = product_plan.product_id'
        db.query(sql, (err, result) => {
            if (err) throw err;
            else {
                let sql = 'SELECT * From plant_information'
                db.query(sql, (err, result_plan) => {
                    if (err) throw err;
                    else {

                        let element_obj = []

                        result.map((element) => {
                            let element_plant = JSON.parse(element.plant)
                            let plant = []
                            let result_plan_id = []

                            element_plant.map((element) => {
                                plant.push(element.plant_id)
                                    result_plan.map((ele) => {
                                        if (element.plant_id == ele.plant_id) {
                                            result_plan_id.push(ele)
                                        }
                                })
                            })
                            element_obj.push({
                                product_id: element.product_id,
                                plant: result_plan_id

                            })
                        })
                        
                        req.result = element_obj
                        next();
                    }
                })
            }
        })
    }
}