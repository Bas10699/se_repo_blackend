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
exports.get_plant_send_all_year = () => {
    return (req, res, next) => {
        let name_plant = req.body.name
        db.query('SELECT `manufacture_information`.`plant_type` FROM `manufacture_information` INNER JOIN `farmer_information` ON `manufacture_information`.`farmer_id` = `farmer_information`.`farmer_id`'
            , (err, result_plant_type) => {
                let result_plant = []
                let result = []
                result_plant_type.map((element) => {
                    element.plant_type = JSON.parse(element.plant_type)
                    element.plant_type.map((element) => {
                        end_plant = element.end_plant
                        volume = (element.deliver_value)*1
                        plant = element.plant
                        result_plant.push({
                            name: plant,
                            end_plant: end_plant,
                            volume:  volume,
                        })
                    })

                })
                let jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jul = 0, jun = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0
                let result_freq = []
                result_plant.map((element) => {
                    if (name_plant === element.name) {

                        if (element.end_plant === "มกราคม") {

                            jan += element.volume

                        } else if (element.end_plant === "กุมภาพันธ์") {

                            feb += element.volume
                            feb
                        } else if (element.end_plant === "มีนาคม") {

                            mar += element.volume

                        } else if (element.end_plant === "เมษายน") {

                            apr += element.volume

                        } else if (element.end_plant === "พฤษภาคม") {

                            may += element.volume

                        } else if (element.end_plant === "มิถุนายน") {

                            jul += element.volume

                        } else if (element.end_plant === "กรกฎาคม") {

                            jun += element.volume

                        } else if (element.end_plant === "สิงหาคม") {

                            aug += element.volume

                        } else if (element.end_plant === "กันยายน") {

                            sep += element.volume

                        } else if (element.end_plant === "ตุลาคม") {

                            oct += element.volume

                        } else if (element.end_plant === "พฤศจิกายน") {

                            nov += element.volume

                        } else if (element.end_plant === "ธันวาคม") {

                            dec += element.volume

                        } else { }
                        result.push(element)

                    }

                })
                result_freq.push({
                    data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
                })

                req.result_1 = result_freq
                next();
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
        db.query('INSERT INTO plant_information SET ?', plant, (err, result) => {
            if (err) throw err;
            next()
        })
    }
}