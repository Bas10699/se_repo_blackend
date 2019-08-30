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
        db.query('SELECT * FROM order_trader WHERE order_id = ?', req.body.order_id, (err, result) => {
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
exports.add_quotation_neutrally = () => {
    return (req, res, next) => {
        db.query('INSERT INTO quotation SET ?', (err) => {

        })
    }
}



exports.get_chart_frequency_all = function () {

    return function (req, res, next) {
        db.query(`SELECT user_information.name,manufacture_information.plant_type FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = '3' order by manufacture_id DESC`, function (err, result) {
            if (err) throw err;

            let se_obj = []
            let plant = req.body.plant_name

            result.map((element) => {
                let index
                index = se_obj.findIndex((el) => el === element.name)
                if (index < 0) {
                    if (element.plant_type !== null) {
                        se_obj.push(
                            element.name
                        )
                    }
                } else {
                }
            })

            let result_obj = []
            let result_se = []
            se_obj.map((element) => {

                let frequency = []
                let result_freq = []
                let plant_obj = []
                let deliver_number = 0, i



                result.map((el) => {

                    if (el.plant_type !== null) {
                        try {

                            plant_obj = JSON.parse(el.plant_type)

                            if (el.name === element) {

                                plant_obj.map((ele) => {

                                    if (ele.plant === plant) {

                                        if (ele.deliver_frequency_number !== null) {

                                            if (ele.deliver_frequency_number > deliver_number) {
                                                deliver_number = ele.deliver_frequency_number

                                            } else { }

                                        } else { }

                                    } else { }

                                })

                            } else { }


                        } catch (error) {

                        }
                    }
                })
                // console.log(deliver_number)

                for (i = 0; i < deliver_number; i++) {
                    frequency.push(i + 1)
                }

                frequency.map((el) => {

                    let jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jul = 0, jun = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0

                    result.map((ele) => {

                        if (ele.plant_type !== null) {
                            try {

                                plant_obj = JSON.parse(ele.plant_type)

                                if (ele.name === element) {

                                    plant_obj.map((elem) => {

                                        if (elem.plant === plant) {
                                            // console.log("el",el)
                                            // console.log("deliver",elem.deliver_frequency_number)
                                            if (elem.deliver_value !== null && elem.deliver_value !== '') {
                                                if (elem.deliver_frequency_number >= el) {

                                                    if (elem.end_plant === "มกราคม") {

                                                        jan += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "กุมภาพันธ์") {

                                                        feb += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "มีนาคม") {

                                                        mar += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "เมษายน") {

                                                        apr += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "พฤษภาคม") {

                                                        may += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "มิถุนายน") {

                                                        jul += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "กรกฎาคม") {

                                                        jun += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "สิงหาคม") {

                                                        aug += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "กันยายน") {

                                                        sep += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "ตุลาคม") {

                                                        oct += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "พฤศจิกายน") {

                                                        nov += parseInt(elem.deliver_value)

                                                    } else if (elem.end_plant === "ธันวาคม") {

                                                        dec += parseInt(elem.deliver_value)

                                                    } else { }
                                                } else { }
                                            }

                                        } else { }
                                    })
                                } else { }
                            } catch (error) {

                            }
                        } else { }

                    })

                    result_freq.push({
                        name: el,
                        data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]

                    })

                })
                if (result_freq.length !== 0) {
                    result_se.push({
                        name: element,
                        rang: result_freq
                    })
                }


            })


            result_obj.push({
                plant: plant,
                se: result_se
            })

            req.result = result_obj;
            next();
        })
    }
}

// exports.get_chart_frequency_all = function () {
//     return function (req, res, next) {
//         let plant = req.body.plant_name
//         db.query(`SELECT user_information.name,manufacture_information.plant_type,farmer_information.user_id,farmer_information.id_card FROM ((user_information INNER JOIN farmer_information ON user_information.user_id = farmer_information.user_id) INNER JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = '3' `, function (err, result) {
//             if (err) throw err;
//             let result_obj = []
//             let plant_type = []
//             let deliver = []
//             result.map((element) => {
//                 let plant_type = JSON.parse(element.plant_type)
//                 if (plant_type != null) {
//                     plant_type.map((element_plant_type, index) => {
//                         if (element_plant_type.plant === plant) {
//                             if (element_plant_type.deliver_value != null) {
//                                 if (element_plant_type.deliver_frequency_number > 0) {
//                                     deliver.push({
//                                         name: element.name,
//                                         deliver_frequency_number: element_plant_type.deliver_frequency_number,
//                                         deliver_value: element_plant_type.deliver_value,
//                                         end_plant: element_plant_type.end_plant,
//                                         plant: element_plant_type.plant
//                                     })

//                                 }
//                             }

//                         }
//                     })


//                 }

//             })
//             req.result = deliver;
//             next();
//         })
//     }
// }

exports.add_warehouse_order = () => {
    return (req, res, next) => {
        db.query('SELECT * from plant_information', (err, result) => {
            if (err) throw err
            result.map((element, index) => {
                db.query('INSERT INTO plant_warehouse SET ?', element, (err) => {
                    if (err) throw err
                    console.log(index + 1)

                })
            })
            next()
        })

    }
}
exports.get_plant_information = () =>{
    return(req,res,next) => {
        db.query('SELECT * from plant_information',(err,result)=>{
            if(err) throw err
            else{
                req.result = result
                next()
            }
        })
    }
}