var db = require('../connect/test_connect')
var moment = require('moment')
var errorMessages = require('../const/error_message')

exports.get_order_trader = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM order_trader INNER JOIN userprofile ON order_trader.trader_id = userprofile.user_id', (err, result) => {
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
exports.update_status_order_trader = () => {
    return (req, res, next) => {
        // console.log(req.body)
        let obj = {
            order_status: req.body.status,
            check_payment_date: moment().utc(7).add('years', 543).format(),
        }
        db.query('UPDATE order_trader SET ? WHERE order_id=?', [obj, req.body.order_id], (err, result) => {
            if (err) throw err
            else {
                next()
            }
        })
    }
}

exports.update_status_date_of_delivery_order_trader = () => {
    return (req, res, next) => {
        // console.log(req.body)
        let obj = {
            order_status: req.body.status,
            date_of_delivery: moment().utc(7).add('years', 543).format(),
        }
        db.query('UPDATE order_trader SET ? WHERE order_id=?', [obj, req.body.order_id], (err, result) => {
            if (err) throw err
            else {
                next()
            }
        })
    }
}
exports.update_plant_stock = () => {
    return (req, res, next) => {
        let id = req.body.product_id.split(" ");
        let check = id[0]
        let pro_id = id[1]
        // console.log(req.body)

        if (check === 'P') {
            let object = {
                plant_name: req.body.product_name,
                cost: req.body.cost,
                volume_sold: req.body.volume_sold,
                price: req.body.price,
                details: req.body.details
            }

            db.query('UPDATE plant_stock SET ? WHERE plant_id=?', [object, pro_id], (err) => {
                if (err) throw err
                else {
                    if (req.body.image != 0) {
                        let pro_image = req.body.image.slice(req.body.image.indexOf(',') + 1)
                        require("fs").writeFile("./image/product/plant_" + pro_id + '.png', pro_image, 'base64', function (err) {
                            if (err) throw err;
                            else {
                                db.query(`UPDATE plant_stock  SET image = 'trader/image/plant_${pro_id}.png'  WHERE plant_id = ${pro_id}`, function (err, result) {
                                    if (err) throw err;
                                    console.log('data', pro_id)
                                    next()
                                });
                            }
                        });
                    }
                    else {
                        next()
                    }
                }
            })
        }
        else {
            let object = {
                product_name: req.body.product_name,
                cost: req.body.cost,
                volume_sold: req.body.volume_sold,
                price: req.body.price,
                details: req.body.details
            }

            db.query('UPDATE product_information SET ? WHERE product_id=?', [object, req.body.product_id], (err) => {
                if (err) throw err
                if (req.body.image != 0) {
                    let pro_image = req.body.image.slice(req.body.image.indexOf(',') + 1)
                    require("fs").writeFile("./image/product/product_" + req.body.product_id + '.png', pro_image, 'base64', function (err) {
                        if (err) throw err;
                        else {
                            db.query(`UPDATE product_information SET image = 'trader/image/product_${req.body.product_id}.png'  WHERE product_id = ${req.body.product_id}`, function (err, result) {
                                if (err) throw err;
                                next()
                            });
                        }
                    });
                }
                else {
                    next()
                }
            })
        }
    }
}

exports.add_order_info_se_small = () => {

}


exports.add_invoice_neutrally = () => {
    return (req, res, next) => {

        data = {
            invoice_id: 'INV' + moment().utc(7).add('years', 543).format('HHmmDDMMYYYY'),
            order_id: req.body.order_id,
            invoice_detail: req.body.detail,
            date: moment().utc(7).add('years', 543).format(),
            date_send: req.body.date_send,
            status: req.body.status
        }
        db.query('INSERT INTO invoice SET ?', data, (err) => {
            if (err) {
                console.log("error ocurred");
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log("User Not");
                    res.status(200).json({
                        'success': false,
                        'error_message': 'กรุณาส่งใบสั่งซื้อใหม่'
                    })
                }
                else
                    throw err;
            }
            else {
                let object ={
                    order_status:1,
                    noti_status_trader:1,
                    noti_date_trader:moment().utc(7).add('years', 543).format(),
                }
                db.query('UPDATE order_trader SET ? WHERE order_id=?',[ object,req.body.order_id], (err) => {
                    if (err) throw err
                    else {
                        next()
                    }
                })
            }
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
            let sum = 0
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
                                                    sum += parseInt(elem.deliver_value)
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
                se: result_se,
                sum: sum
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

exports.add_stock_order = () => {
    return (req, res, next) => {
        // db.query('SELECT * from plant_information', (err, result) => {
        //     if (err) throw err
        //     result.map((element, index) => {


        //         db.query('SELECT * From plant_stock WHERE plant_id= ?', element.plant_id, (err, result) => {
        //             if (err) throw err
        //             if (result[0]) {
        //                 let id_plant = result[0].plant_id
        //                 let name_plant = result[0].plant_name
        //                 let price = result[0].price
        //                 let image = result[0].image
        //                 let cost = result[0].cost
        //                 let detail = result[0].detail
        //                 let caption = result[0].caption
        //                 db.query(`SELECT user_information.name,manufacture_information.plant_type FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = '3' order by manufacture_id DESC`
        //                     , (err, result_plant_type) => {
        //                         if (err) throw err
        //                         let result_plant = []
        //                         let result = []
        //                         result_plant_type.map((element) => {
        //                             element.plant_type = JSON.parse(element.plant_type)
        //                             if (element.plant_type != null) {
        //                                 element.plant_type.map((element) => {
        //                                     end_plant = element.end_plant
        //                                     volume = (element.deliver_value) * 1
        //                                     plant = element.plant
        //                                     result_plant.push({
        //                                         name: plant,
        //                                         end_plant: end_plant,
        //                                         volume: volume,
        //                                     })
        //                                 })
        //                             }

        //                         })
        //                         let jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jul = 0, jun = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0
        //                         let result_freq = []
        //                         let plant_data = []
        //                         result_plant.map((element) => {
        //                             if (name_plant === element.name) {
        //                                 // console.log(element.end_plant, ':', element.volume)

        //                                 if (element.end_plant === "มกราคม") {

        //                                     jan += element.volume

        //                                 } else if (element.end_plant === "กุมภาพันธ์") {

        //                                     feb += element.volume
        //                                     feb
        //                                 } else if (element.end_plant === "มีนาคม") {

        //                                     mar += element.volume

        //                                 } else if (element.end_plant === "เมษายน") {

        //                                     apr += element.volume

        //                                 } else if (element.end_plant === "พฤษภาคม") {

        //                                     may += element.volume

        //                                 } else if (element.end_plant === "มิถุนายน") {

        //                                     jul += element.volume

        //                                 } else if (element.end_plant === "กรกฎาคม") {

        //                                     jun += element.volume

        //                                 } else if (element.end_plant === "สิงหาคม") {

        //                                     aug += element.volume

        //                                 } else if (element.end_plant === "กันยายน") {

        //                                     sep += element.volume

        //                                 } else if (element.end_plant === "ตุลาคม") {

        //                                     oct += element.volume

        //                                 } else if (element.end_plant === "พฤศจิกายน") {

        //                                     nov += element.volume

        //                                 } else if (element.end_plant === "ธันวาคม") {

        //                                     dec += element.volume

        //                                 } else { }
        //                                 result.push(element)

        //                             }

        //                         })




        //                         result_freq = {
        //                             product_id: id_plant,
        //                             product_name: name_plant,
        //                             plant: jan + feb + mar + apr + may + jun + jul + aug + sep + oct + nov + dec
        //                             // image: image,
        //                             // cost: cost,
        //                             // detail: detail,
        //                             // caption: caption

        //                         }
        //                         db.query('UPDATE plant_stock SET amount = ? WHERE plant_id=? ', [result_freq.plant, result_freq.product_id], (err) => {
        //                             if (err) throw err
        //                             console.log(result_freq)
        //                             next();
        //                         })


        //                         // req.result = result_freq

        //                     })
        //             }
        //         })



        //     })

        // })


        // db.query('SELECT * FROM plant_information', (err, result) => {
        //     if (err) throw err
        //     else {
        //         result.map((element) => {
        //             let pp = [{
        //                 price: element.price,
        //                 volume: 1,
        //             },]
        //             let price =JSON.stringify(pp)

        //             db.query('UPDATE plant_stock SET price=? WHERE plant_id=?', [price, element.plant_id], (err) => {
        //                 if (err) throw err
        //                 else {
        //                     next()
        //                 }
        //                 })
        //         })
        //     }
        // })

    }
}
exports.get_plant_information = () => {
    return (req, res, next) => {
        db.query('SELECT * from plant_information', (err, result) => {
            if (err) throw err
            else {
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
                            if (el.plant !== null && el.plant !== undefined) {
                                disnict_plant.push(el.plant)

                            }
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
                    console.log("total", total_volume)
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
                        // console.log(element)

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

                        if (element.name === req.body.plant_name) {
                            volume_all = element.volume
                        } else {

                        }
                    })

                    result_process.map((element) => {

                        if (element.name === req.body.plant_name) {
                            volume_process = element.volume
                        } else {

                        }

                    })

                    volume_want = volume_process - volume_all

                    if (volume_want < 1) {
                        volume_want = 0
                    } else {

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

exports.get_linechart_some_se = function () {
    return function (req, res, next) {
        db.query(`SELECT user_information.name,manufacture_information.plant_type,farmer_information.title_name,farmer_information.first_name,farmer_information.last_name FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = '3'`, function (err, result) {
            if (err) throw err;



            let Neo_firm_name = []
            let plant_neo = []

            result.map((element) => {

                index = Neo_firm_name.findIndex((elem) => elem === element.name)
                if (index < 0) {
                    // console.log(ele_pla.plant)
                    Neo_firm_name.push(
                        element.name
                    )

                }
                // Neo_firm_name.push(element.name)
            })
            Neo_firm_name.map((ele_Neo_firm_name) => {
                let plant_name = []
                result.map((ele_result) => {
                    if (ele_Neo_firm_name === ele_result.name) {
                        ele_result.plant_type = JSON.parse(ele_result.plant_type)
                        let plant_type = ele_result.plant_type
                        if (plant_type !== null) {
                            plant_type.map((ele_pla) => {


                                index = plant_name.findIndex((elem) => elem === ele_pla.plant)
                                if (index < 0) {
                                    if (ele_pla.plant !== null && ele_pla.plant !== undefined) {
                                        // console.log(ele_pla.plant)
                                        plant_name.push(
                                            ele_pla.plant
                                        )
                                    }
                                }
                            })
                        }
                    }
                })
                plant_neo.push({
                    neo_name: ele_Neo_firm_name,
                    plant: plant_name

                })
            })


            let plant_se = []
            // let month = []

            plant_neo.map((ele_neo) => {
                let month = []

                ele_neo.plant.map((ele_plant) => {
                    // console.log(ele_plant)
                    let january = 0,
                        febuary = 0,
                        march = 0,
                        april = 0,
                        may = 0,
                        june = 0,
                        july = 0,
                        august = 0,
                        september = 0,
                        october = 0,
                        november = 0,
                        december = 0
                    let jan = [],
                        feb = [],
                        mar = [],
                        apr = [],
                        ma = [],
                        jun = [],
                        jul = [],
                        aug = [],
                        sep = [],
                        oct = [],
                        nov = [],
                        dec = []


                    result.map((element) => {
                        if (ele_neo.neo_name == element.name) {
                            
                            let plant_type = element.plant_type
                            if (plant_type !== null) {
                                plant_type.map((ele_pla) => {
                                    if (ele_plant === ele_pla.plant && ele_neo.neo_name == element.name) {

                                        if (ele_pla.end_plant == "มกราคม") {
                                            january = january + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            jan.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "กุมภาพันธ์") {
                                            febuary = febuary + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            feb.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "มีนาคม") {
                                            march = march + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            mar.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "เมษายน") {
                                            april = april + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            apr.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "พฤษภาคม") {
                                            may = may + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            ma.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "มิถุนายน") {
                                            june = june + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            jun.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "กรกฎาคม") {
                                            july = july + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            jul.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "สิงหาคม") {
                                            august = august + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            aug.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "กันยายน") {
                                            september = september + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            sep.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "ตุลาคม") {
                                            october = october + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            oct.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "พฤศจิกายน") {
                                            november = november + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            nov.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        } else if (ele_pla.end_plant == "ธันวาคม") {
                                            december = december + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                            dec.push({
                                                ...ele_pla,
                                                title_name: element.title_name,
                                                first_name: element.first_name,
                                                last_name: element.last_name,
                                            })
                                        }

                                    }
                                })
                            }
                        }
                        

                    })
                    month.push({
                        name: ele_plant,
                        data: [january, febuary, march, april, may, june, july, august, september, october, november, december],
                        detail: [jan, feb, mar, apr, ma, jun, jul, aug, sep, oct, nov, dec]
                    })
                })
                plant_se.push({
                    se_name: ele_neo.neo_name,
                    plant: month
                })

            })


            req.result = plant_se
            next();


        })
    }

}


exports.add_order_se = () => {
    return (req, res, next) => {
        let order_se = req.body.order_se
        let detail_order_trader = req.body.detail_order_trader

        detail_order_trader.map((ele_de) => {
            if (ele_de.plant_name === req.body.plant_name)
                ele_de.status = 1
        })
        let detail = JSON.stringify(detail_order_trader)
        db.query('UPDATE order_trader SET detail=? WHERE order_id=?', [detail, req.body.order_trader_id], (err) => {
            if (err) throw err
            else {
                order_se.map((element) => {
                    if (parseInt(element.amount) > 0) {
                        let obj = {
                            plant_name: element.plant,
                            se_name: element.name,
                            amount: parseInt(element.amount),
                            order_trader_id: req.body.order_trader_id,
                            order_se_date: moment().utc(7).add('years', 543).format()
                        }
                        console.log(obj)
                        db.query('INSERT INTO order_se SET ?', obj, (err, result) => {
                            if (err) throw err
                            else {
                                let order_se_id = 'PO' + moment().utc(7).add('years', 543).format('DDMMYYYY') + '-' + result.insertId
                                db.query('UPDATE order_se SET order_se_id=? WHERE id=?', [order_se_id, result.insertId], (err) => {
                                    if (err) throw err
                                    else {
                                        next()
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

    }
}

exports.get_order_se_all = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM order_se', (err, result) => {
            if (err) throw err
            else {
                req.result = result
                next()
            }
        })
    }
}

exports.get_order_se = () => {
    return (req, res, next) => {
        console.log(req.body)
        db.query('SELECT * FROM order_se LEFT JOIN order_se_invoice ON order_se.order_se_id = order_se_invoice.order_se_id WHERE order_se.order_se_id=?', req.body.order_id, (err, result) => {
            if (err) throw err
            else {
                req.result = result[0]
                next()
            }
        })
    }
}
