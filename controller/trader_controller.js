var db = require('../connect/test_connect')
var moment = require('moment')
var randomstring = require("randomstring");


exports.get_product = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_information', (err, result) => {
            if (err) throw err
            else {
                db.query('SELECT * From plant_information', (err, result_plant) => {
                    if (err) throw err
                    else {
                        result_plant.map((element) => {
                            result.push({
                                product_id: 'P ' + element.plant_id,
                                product_name: element.plant_name
                            })
                        })

                        req.result = result
                        next()
                    }
                })

            }
        })
    }
}

exports.get_product_information = () => {
    return (req, res, next) => {
        console.log(req.body.product_id)
        let product_id = req.body.product_id.split(" ");
        let cmd = product_id[0];
        if (cmd === 'P') {
            db.query('SELECT * From plant_information WHERE plant_id = ?', product_id[1], (err, result) => {
                if (err) throw err
                if (result[0]) {
                    let id_plant = result[0].plant_id
                    let name_plant = result[0].plant_name
                    db.query('SELECT `manufacture_information`.`plant_type` FROM `manufacture_information` INNER JOIN `farmer_information` ON `manufacture_information`.`farmer_id` = `farmer_information`.`farmer_id`'
                        , (err, result_plant_type) => {
                            if (err) throw err
                            let result_plant = []
                            let result = []
                            result_plant_type.map((element) => {
                                element.plant_type = JSON.parse(element.plant_type)
                                element.plant_type.map((element) => {
                                    end_plant = element.end_plant
                                    volume = (element.deliver_value) * 1
                                    plant = element.plant
                                    result_plant.push({
                                        name: plant,
                                        end_plant: end_plant,
                                        volume: volume,
                                    })
                                })

                            })
                            let jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jul = 0, jun = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0
                            let result_freq = []
                            let plant_data = []
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

                            plant_data.push({
                                plant_id: id_plant,
                                plant_name: name_plant,
                                volume: 1,
                                data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
                            })
                            result_freq = {

                                product_name: name_plant,
                                plant: plant_data
                            }

                            req.result = result_freq
                            next();
                        })
                }
            })
        }
        else {
            let sql = 'SELECT * From product_information INNER JOIN product_plan ON product_information.product_id = product_plan.product_id WHERE product_information.product_id = ?'
            db.query(sql, req.body.product_id, (err, result) => {
                if (err) throw err;
                else {
                    let sql = 'SELECT * From plant_information'
                    db.query(sql, (err, result_plan) => {
                        if (err) throw err;
                        if (result[0]) {

                            let plant = JSON.parse(result[0].plant)
                            let plant_data = []
                            db.query('SELECT `manufacture_information`.`plant_type` FROM `manufacture_information` INNER JOIN `farmer_information` ON `manufacture_information`.`farmer_id` = `farmer_information`.`farmer_id`'
                                , (err, result_plant_type) => {
                                    plant.map((plant_element, plant_index) => {
                                        let plant_obj = null
                                        result_plan.map((result_plan_element) => {
                                            if (plant_element.plant_id == result_plan_element.plant_id) {
                                                plant_obj = {
                                                    ...plant_element,
                                                    ...result_plan_element
                                                }
                                            }


                                        })
                                        if (plant_obj) {
                                            plant_data.push(plant_obj)
                                        }
                                    })
                                    let result_freq = []
                                    let result_plant = []
                                    result_plant_type.map((element) => {
                                        element.plant_type = JSON.parse(element.plant_type)
                                        element.plant_type.map((element) => {
                                            end_plant = element.end_plant
                                            volume = (element.deliver_value) * 1
                                            plant = element.plant
                                            result_plant.push({
                                                name: plant,
                                                end_plant: end_plant,
                                                volume: volume,
                                            })
                                        })

                                    })
                                    plant_data.map((element_plant_data) => {
                                        let name_plant = element_plant_data.plant_name
                                        let result = []

                                        let jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jul = 0, jun = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0

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
                                            ...element_plant_data,
                                            data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
                                        })
                                        // console.log("re55", result_freq)
                                    })

                                    let result_all = null
                                    result_all = {
                                        product_id: result[0].product_id,
                                        product_name: result[0].product_name,
                                        plant: result_freq
                                    }
                                    req.result = result_all
                                    next();
                                })


                        }

                        else {
                            res.status(200).json({
                                success: false,
                                error_message: "ไม่พบข้อมูลผลิตภัณฑ์"
                            })
                        }
                    })
                }
            })
        }

    }
}
exports.add_cart_trader = () => {
    return (req, res, next) => {
        // console.log(req.body)
        // res.status(200).json({
        //     success: false,
        //     error_message: "นี่คือสิ่งที่มึงส่งมา"+JSON.stringify(req.body)+"\nไปแก้โค้ดมาใหม่\nมึงใช้ push ใส่ array ดิ"
        // })
        console.log('55555',req.body.data_plant)
        req.body.data_plant.map((element) => {

            db.query('SELECT * FROM cart WHERE trader_id = ? AND plant_id = ?', [req.user_id, element.plant_id], (err, result) => {
                if (err) throw err
                else {
                    if (result[0]) {
                        console.log("update")

                        let sum_amount = (Number(result[0].amount) + Number(element.total_plant))
                        console.log("sum_amont", sum_amount)

                        db.query('UPDATE cart SET amount = ? WHERE trader_id = ? AND plant_id = ?', [sum_amount, req.user_id, element.plant_id], (err, result) => {
                            if (err) throw err
                            else {
                                next()
                            }
                        })
                    }
                    else {
                        console.log("INSERT")
                        let cart = {
                            trader_id: req.user_id,
                            plant_id: element.plant_id,
                            amount: element.total_plant
                        }
                        db.query('INSERT INTO cart SET ?', cart, (err, result) => {
                            if (err) throw err
                            else {
                                next()
                            }
                        })
                    }
                }
            })
        })

    }
}

exports.get_cart_trader = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM cart WHERE trader_id = ?', req.user_id, (err, result) => {
            if (err) throw err
            if (!result[0]) {
                res.status(200).json({
                    success: false,
                    error_message: "ไม่มีสินค้าในตะกร้า"
                })
                next()
            }
            else {


                db.query('SELECT * From plant_information', (err, result_plant) => {
                    if (err) throw err
                    else {
                        let product = []
                        result.map((element) => {
                            let product_obj = null
                            result_plant.map((element_result_plant) => {
                                if (element.plant_id == element_result_plant.plant_id) {
                                    product_obj = {
                                        ...element,
                                        ...element_result_plant
                                    }

                                }
                            })
                            console.log(product_obj)
                            if (product_obj) {
                                product.push(product_obj)
                            }



                        })
                        // console.log(product)
                        req.result = product
                        next()
                    }

                })


            }
        })
    }
}

exports.update_cart_trader = () => {
    return (req, res, next) => {
        req.body.data.map((element) => {
            db.query('UPDATE cart SET amount = ? WHERE trader_id = ? AND plant_id = ?', [element.amount, req.user_id, element.plant_id], (err, result) => {
                if (err) throw err
                next()
            })
        })

    }
}
exports.delete_product_cart = () => {
    return (req, res, next) => {
        console.log('555',req.body.plant_id)
        db.query('DELETE FROM cart WHERE trader_id = ? AND plant_id = ?', [req.user_id, req.body.plant_id], (err, result) => {
            if (err) throw err;
            next()
        })
    }
}

// exports.delete_select_product_cart = () => {
//     return (req, res, next) => {

//         db.query('DELETE FROM cart WHERE trader_id = ? AND product_id = ?', [req.user_id, element.product_id], (err, result) => {
//             if (err) throw err;
//             next()
//         })

//     }
// }

exports.add_order_trader = () => {
    return (req, res, next) => {

        let date_time = moment().utc(7).format('YYMMDDHHmm')
        let order_trader = JSON.stringify(req.body.detail)
        let add_order = {
            order_date: moment().utc(7).format(),
            detail: order_trader,
            order_status: req.body.order_status,
            trader_id: req.user_id
        }

        db.query('INSERT INTO order_trader SET ?', add_order, (err, result) => {
            if (err) throw err
            else {
                let order_id = date_time + '-' + result.insertId
                db.query('UPDATE order_trader SET order_id = ? WHERE number = ?', [order_id, result.insertId], (err) => {
                    if (err) throw err
                    else {
                        db.query('DELETE FROM cart WHERE trader_id = ?', req.user_id, (err) => {
                            if (err) throw err
                            next()
                        })
                    }
                })
            }
        })
    }
}



exports.get_order_trader = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM order_trader WHERE trader_id = ?', req.user_id, (err, result) => {
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
        db.query('SELECT * FROM order_trader WHERE trader_id = ? AND order_id = ?', [req.user_id, req.body.order_id], (err, result) => {
            if (err) throw err
            if (!result[0]) {
                res.status(200).json({
                    success: false,
                    error_message: "ไม่พบ ID ใบสั่งซื้อ หรือ ID ใบสั่งซื้อไม่ถูกต้อง"
                })
            }
            else {
                result[0].detail = JSON.parse(result[0].detail)
                req.result = result[0]
                next()
            }
        })
    }
}

exports.update_status_order_trader = () => {
    return (req, res, next) => {
        let order_id = req.body.order_id
        let order_status = req.body.order_status
        db.query('UPDATE order_trader SET order_status = ? WHERE order_id = ?', [order_status, order_id], (err) => {
            if (err) throw err
            next()
        })
    }
}

exports.get_quotation_trader = () => {
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

exports.update_status_quotation_trader = () => {
    return (req, res, next) => {

    }
}