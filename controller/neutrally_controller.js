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
                db.query('SELECT * FROM userprofile WHERE user_id = ?', result[0].trader_id, (err, result_profile) => {
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

exports.get_plant = function () {
    return function (req, res, next) {

        db.query(`SELECT user_information.name,manufacture_information.manufacture_id,manufacture_information.plant_type FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = '3' order by manufacture_id DESC`, function (err, result) {
            if (err) throw err;
            db.query(`SELECT plan_id,product_plan.product_id,product_name,nutrient_precent,plant,image,volume,volume_type FROM product_plan LEFT JOIN product_information ON product_plan.product_id = product_information.product_id WHERE send_se = '3' order by product_plan.plan_id DESC`, function (err, result_plan) {
                if (err) throw err;

                let disnict_plant = []
                let index = 0
                let result_data = []
                let element_obj
                let all_plant_type = []

                result.map((element, index) => {
                    if (element.plant_type !== null) {
                        try {
                            element_obj = JSON.parse(element.plant_type)
                            all_plant_type.push(...element_obj)
                        } catch (err) {
                        }

                    } else {

                    }

                    element_obj.map((el, i) => {

                        index = disnict_plant.findIndex((find) => find === el.plant)
                        if (index < 0) {
                            disnict_plant.push(el.plant)
                        } else {

                        }

                    })


                })


                let month_obj = []
                let count_month = 0

                disnict_plant.map((element) => {

                    let january = 0
                    let febuary = 0
                    let march = 0
                    let april = 0
                    let may = 0
                    let june = 0
                    let july = 0
                    let august = 0
                    let september = 0
                    let october = 0
                    let november = 0
                    let december = 0

                    all_plant_type.map((el) => {

                        if (element === el.plant) {

                            //(el.deliver_frequency * el.deliver_value)paseInt     el.deliver ต้องเป็น Int เท่านั้น

                            if (el.end_plant == "มกราคม") {
                                january = january + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "กุมภาพันธ์") {
                                febuary = febuary + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "มีนาคม") {
                                march = march + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "เมษายน") {
                                april = april + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "พฤษภาคม") {
                                may = may + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "มิถุนายน") {
                                june = june + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "กรกฎาคม") {
                                july = july + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "สิงหาคม") {
                                august = august + (el.deliver_frequency_number * el.deliver_value)

                            } else if (el.end_plant == "กันยายน") {
                                september = september + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "ตุลาคม") {
                                october = october + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "พฤศจิกายน") {
                                november = november + (el.deliver_frequency_number * el.deliver_value)
                            } else if (el.end_plant == "ธันวาคม") {
                                december = december + (el.deliver_frequency_number * el.deliver_value)
                            }
                        }



                    })
                    count_month = january + febuary + march + april + may + june + july + august + september + october + november + december

                    if (count_month != 0) {
                        month_obj.push(
                            {

                                name: element,

                                volume: count_month

                            }
                        )
                    }

                })

                let plan_obj = []
                let plant = []
                let plant_real = []
                let result_process = []

                result_plan.map((element, index) => {

                    try {

                        plant.push(...JSON.parse(element.plant))



                    } catch (error) {

                    }
                })

                plant.map((element, index) => {
                    index = plant_real.findIndex((find) => find === element.plant_name)
                    if (index < 0) {
                        plant_real.push(element.plant_name)

                    } else {

                    }
                })

                plant_real.map((element) => {

                    let total_volume = 0

                    result_plan.map((el) => {
                        try {

                            let plant
                            plant = JSON.parse(el.plant)
                            plant.map((ele) => {

                                if (ele.plant_name === element) {

                                    console.log()
                                    if (ele.volume_type === "กิโลกรัม") {
                                        total_volume += parseInt(ele.volume) * parseInt(el.volume)
                                    } else if (ele.volume_type === "กรัม") {
                                        total_volume += parseInt(ele.volume) * parseInt(el.volume) / 1000
                                    } else if (ele.volume_type === "ตัน") {
                                        total_volume += parseInt(ele.volume) * parseInt(el.volume) * 1000

                                    } else { }


                                }
                            })

                        } catch (error) {

                        }

                    })
                    // console.log("total",total_volume)
                    result_process.push({
                        name: element,
                        volume: total_volume

                    })
                })
                let plan_plant = []
                result_process.map((element) => {

                    let count = 0

                    month_obj.map((el) => {

                        if (el.name === element.name) {
                            count = element.volume - el.volume
                            if (count > 0) {
                                plan_plant.push({
                                    name: element.name,
                                    volume: count
                                })
                            }
                        }

                    })
                })

                result_data.push({
                    all_plant: month_obj,
                    process_plant: result_process,
                    plan: plan_plant
                })

                let result_new = []


                if (req.body.plant_name === "ทั้งหมด") {

                    month_obj.map((element) => {

                        let volume_process = 0
                        let volume_want = 0
                        result_process.map((el) => {
                            let count = 0
                            if (el.name === element.name) {
                                volume_process = el.volume
                                count = parseInt(el.volume) - parseInt(element.volume)
                                if (count > 0) {
                                    volume_want = count
                                } else {
                                    volume_want = 0
                                }
                            }
                        })

                        result_new.push({

                            name: element.name,
                            volume_all: element.volume,
                            volume_process: volume_process,
                            volume_want: volume_want
                        })



                    })
                } else {

                    let volume_all = 0
                    let volume_process = 0
                    let volume_want = 0

                    month_obj.map((element) => {

                        if(element.name === req.body.plant_name){
                            volume_all = element.volume
                        }else{

                        }
                    })

                    result_process.map((element)=>{

                        if(element.name === req.body.plant_name){
                            volume_process = element.volume
                        }else{

                        }

                    })

                    volume_want = volume_process - volume_all

                    if(volume_want<1){
                        volume_want = 0
                    }else{

                    }

                    result_new.push({
                        name: req.body.plant_name,
                        volume_all: volume_all,
                        volume_process: volume_process,
                        volume_want: volume_want
                    })

                }

                req.result = result_new

                next();
            })
        })
    }
}

exports.get_plant_volume_all_se = function () {
    return function (req, res, next) {

        let plant_info = {
            plant: req.body.name_plant
        }

        db.query(`SELECT user_information.name,manufacture_information.plant_type FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = '3'`, function (err, result) {
            if (err) throw err;
            // req.result = result

            let element_obj
            let se_obj = []


            result.map((element) => {
                let index
                index = se_obj.findIndex((el) => el === element.name)
                if (index < 0) {
                    se_obj.push(
                        element.name
                    )
                } else {

                }
            })
            let se_result_obj = []
            // console.log(se_obj)
            // let test_result = []

            se_obj.map((element) => {
                let plant_value_total = 0

                result.map((el) => {

                    if (el.plant_type !== null) {

                        if (element === el.name) {
                            let se_plant
                            let plant_value = 0
                            try {
                               
                                
                                se_plant = JSON.parse(el.plant_type)
                                // console.log(se_plant);
                                se_plant.map((ele) => {

                                 
                                    if (ele.plant === plant_info.plant && ele.end_plant) {
                                        plant_value = plant_value + (ele.deliver_frequency_number * ele.deliver_value)

                                    }
                                })
                                plant_value_total = plant_value_total + plant_value
                            } catch (err) {

                            }


                        }

                    } else {

                    }


                })
                console.log(plant_value_total);
                

                if (plant_value_total > 0) {
                    se_result_obj.push(
                        {
                            se_name: element,
                            plant: plant_info.plant,
                            data: plant_value_total
                        }
                    )
                }

                // console.log(plant_obj)
            })

            req.result = se_result_obj
            next();


        })
    }
}