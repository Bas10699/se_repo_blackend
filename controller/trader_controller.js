var db = require('../connect/test_connect')
var moment = require('moment')
var randomstring = require("randomstring");
var errorMessages = require('../const/error_message')
var constance = require('../const/constance')


exports.get_product = () => {
    return (req, res, next) => {
        let result = []
        db.query('SELECT * From plant_stock', (err, result_plant) => {
            if (err) throw err
            else {
                result_plant.map((element) => {
                    if (element.amount_stock !== 0) {
                        result.push({
                            product_id: 'P ' + element.plant_id,
                            product_name: element.plant_name,
                            image: element.image,
                            amount_stock: element.amount_stock,
                            price: JSON.parse(element.price)
                        })
                    }

                })

                req.result = result
                next()
            }
        })

    }
}

exports.get_product_information = () => {
    return (req, res, next) => {
        console.log('product_id', req.body.product_id)
        let product_id = req.body.product_id.split(" ");
        let cmd = product_id[0];
        if (cmd === 'P') {
            db.query('SELECT * From plant_stock WHERE plant_id = ?', product_id[1], (err, result) => {
                if (err) throw err
                if (result[0]) {
                    let id_plant = result[0].plant_id
                    let name_plant = result[0].plant_name
                    let price = JSON.parse(result[0].price)
                    let image = result[0].image
                    let cost = result[0].cost
                    let details = result[0].details
                    let caption = result[0].caption
                    let amount_stock = result[0].amount_stock
                    let volume_sold = result[0].volume_sold
                    // db.query(`SELECT user_information.name,manufacture_information.plant_type FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = '3' order by manufacture_id DESC`
                    //     , (err, result_plant_type) => {
                    //         if (err) throw err
                    //         let result_plant = []
                    //         let result = []

                    //         result_plant_type.map((element) => {
                    //             try {
                    //                 element.plant_type = JSON.parse(element.plant_type)
                    //                 if (element.plant_type != null) {
                    //                     element.plant_type.map((element) => {
                    //                         end_plant = element.end_plant
                    //                         volume = (element.deliver_value) * 1
                    //                         plant = element.plant
                    //                         result_plant.push({
                    //                             name: plant,
                    //                             end_plant: end_plant,
                    //                             volume: volume,
                    //                         })
                    //                     })
                    //                 }
                    //             }
                    //             catch (error) {
                    //                 console.log(error)
                    //             }

                    //         })

                    //         let jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jul = 0, jun = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0
                    //         let result_freq = []
                    //         let plant_data = []
                    //         result_plant.map((element) => {
                    //             if (name_plant === element.name) {
                    //                 // console.log(element.end_plant, ':', element.volume)

                    //                 if (element.end_plant === "มกราคม") {

                    //                     jan += element.volume

                    //                 } else if (element.end_plant === "กุมภาพันธ์") {

                    //                     feb += element.volume
                    //                     feb
                    //                 } else if (element.end_plant === "มีนาคม") {

                    //                     mar += element.volume

                    //                 } else if (element.end_plant === "เมษายน") {

                    //                     apr += element.volume

                    //                 } else if (element.end_plant === "พฤษภาคม") {

                    //                     may += element.volume

                    //                 } else if (element.end_plant === "มิถุนายน") {

                    //                     jul += element.volume

                    //                 } else if (element.end_plant === "กรกฎาคม") {

                    //                     jun += element.volume

                    //                 } else if (element.end_plant === "สิงหาคม") {

                    //                     aug += element.volume

                    //                 } else if (element.end_plant === "กันยายน") {

                    //                     sep += element.volume

                    //                 } else if (element.end_plant === "ตุลาคม") {

                    //                     oct += element.volume

                    //                 } else if (element.end_plant === "พฤศจิกายน") {

                    //                     nov += element.volume

                    //                 } else if (element.end_plant === "ธันวาคม") {

                    //                     dec += element.volume

                    //                 } else { }
                    //                 result.push(element)

                    //             }

                    //         })



                    //         plant_data.push({
                    //             plant_id: id_plant,
                    //             plant_name: name_plant,
                    //             price: price,
                    //             volume: 1,
                    //             data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
                    //         })
                    result_freq = {
                        product_id: id_plant,
                        product_name: name_plant,
                        // plant: plant_data,
                        image: image,
                        cost: cost,
                        price: price,
                        details: details,
                        caption: caption,
                        amount_stock: amount_stock,
                        volume_sold: volume_sold

                    }

                    req.result = result_freq
                    next();
                    // })
                }
            })
        }
        else {
            let sql = 'SELECT * From product_information INNER JOIN product_plan ON product_information.product_id = product_plan.product_id WHERE product_information.product_id = ?'
            db.query(sql, req.body.product_id, (err, result) => {
                if (err) throw err;
                else {
                    let sql = 'SELECT * From plant_stock'
                    db.query(sql, (err, result_plan) => {
                        if (err) throw err;
                        if (result[0]) {

                            let plant = JSON.parse(result[0].plant)
                            let plant_data = []
                            db.query(`SELECT user_information.name,manufacture_information.plant_type FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = '3' order by manufacture_id DESC`
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
                                        if (element.plant_type) {
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
                                        }
                                    })
                                    plant_data.map((element_plant_data) => {
                                        element_plant_data.price = JSON.parse(element_plant_data.price)
                                        let name_plant = element_plant_data.plant_name
                                        let result = []

                                        let jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jul = 0, jun = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0
                                        if (result_plant !== null) {
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
                                        }
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
                                        image: result[0].image,
                                        plant: result_freq,
                                        cost: result[0].cost,
                                        price: JSON.parse(result[0].price),
                                        details: result[0].details,
                                        amount_stock: result[0].amount_stock,
                                        volume_sold: result[0].volume_sold
                                    }
                                    req.result = result_all
                                    next();
                                })


                        }

                        else {
                            res.status(200).json(errorMessages.err_product_info)
                        }
                    })
                }
            })
        }

    }
}
exports.add_cart_trader = () => {
    return (req, res, next) => {
        // console.log('55555', req.body)
        db.query('SELECT * FROM cart WHERE trader_id = ? AND plant_id = ?', [req.user_id, req.body.plant_id], (err, result) => {
            if (err) throw err
            else {
                if (result[0]) {
                    console.log("update")

                    let sum_amount = (Number(result[0].amount) + Number(req.body.total_plant))
                    console.log("sum_amont", sum_amount)

                    db.query('UPDATE cart SET amount = ? WHERE trader_id = ? AND plant_id = ?', [sum_amount, req.user_id, req.body.plant_id], (err, result) => {
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
                        plant_id: req.body.plant_id,
                        amount: req.body.total_plant
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


                db.query('SELECT * From plant_stock', (err, result_plant) => {
                    if (err) throw err
                    else {
                        let product = []
                        result.map((element) => {
                            let product_obj = null
                            result_plant.map((element_result_plant) => {
                                if (element.plant_id == element_result_plant.plant_id) {
                                    element_result_plant.price = JSON.parse(element_result_plant.price)
                                    product_obj = {
                                        ...element_result_plant,
                                        ...element,

                                    }

                                }
                            })
                            // console.log(product_obj)
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
        console.log('555', req.body.plant_id)
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

        let date_time = moment().utc(7).add('years', 543).format('DDMMYYYY')
        let order_trader = JSON.stringify(req.body.detail)
        let add_order = {
            order_date: moment().utc(7).add('years', 543).format(),
            detail: order_trader,
            order_status: req.body.order_status,
            trader_id: req.user_id,
            date_send: req.body.date_send,
            address_send: req.body.address_send,
            noti_status: 1,
            noti_date: moment().utc(7).add('years', 543).format(),
            order_se_status: 0,
            noti_status_trader: 0
        }

        db.query('INSERT INTO order_trader SET ?', add_order, (err, result) => {
            if (err) throw err
            else {
                let order_id = 'PO' + date_time + '-' + result.insertId
                db.query('UPDATE order_trader SET order_id = ? WHERE number = ?', [order_id, result.insertId], (err) => {
                    if (err) throw err
                    else {
                        db.query('DELETE FROM cart WHERE trader_id = ?', req.user_id, (err) => {
                            if (err) throw err

                            db.query('SELECT email FROM user_information WHERE type_user=4', (err, res_email) => {
                                if (err) throw err
                                else {

                                    let mailOptions = {
                                        // from: 'sender@hotmail.com',                // sender
                                        to: res_email[0].email,                // list of receivers
                                        subject: 'คำสั่งซื้อใหม่หมายเลข' + order_id,              // Mail subject
                                        html: `
                                        <h3>มีคำสั่งซื้อใหม่จาก ${req.body.name} ${req.body.last_name}</h3> <br/>
                                        <p>หมายเลขของคำสั่งซื้อ #${order_id} <br/>
                                        ${moment().lang("th").utc(7).add('years', 543).format('LLLL')} น.</p><br/>
                                        <p>กรุณาทำการสั่งซื้อวัตถุดิบจาก SE ย่อย และยืนยันการสั่งซื้อ</p>
                                        
                                        <b>ดูข้อมูลเพิ่มเติม</b>
                                        <a href=http://${constance.domain_name}/M_Order/gg?aa=${order_id}>กรุณากด ที่นี่</a>`   // HTML body
                                    };

                                    constance.transporter.sendMail(mailOptions, function (err, info) {
                                        if (err)
                                            console.log(err)
                                        else
                                            console.log(info);
                                    });


                                    req.result = order_id
                                    next()
                                }
                            })
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
                res.status(200).json(errorMessages.err_order_info)
            }
            else {
                db.query('SELECT * FROM user_information WHERE user_id = ?', req.user_id, (err, result_profile) => {
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
        let order_id = req.body.order_id
        let order_status = {
            order_status: req.body.order_status,
            date_end: moment().utc(7).add('years', 543).format(),
        }
        db.query('UPDATE order_trader SET ? WHERE order_id = ?', [order_status, order_id], (err) => {
            if (err) throw err
            next()
        })
    }
}


exports.get_invoice_trader = () => {
    return (req, res, next) => {
        let order_id = req.body.order_id
        db.query('SELECT * FROM invoice INNER JOIN order_trader ON invoice.order_id = order_trader.order_id  WHERE invoice.order_id =?', order_id, (err, result) => {
            if (err) throw err
            else {
                if (!result[0]) {
                    res.status(200).json({
                        success: false,
                        error_message: "ไม่พบ ID ใบแจ้งหนี้ หรือ ID ใบแจ้งหนี้ไม่ถูกต้อง"
                    })
                }
                else {
                    result[0].detail = JSON.parse(result[0].detail)
                    result[0].invoice_detail = JSON.parse(result[0].invoice_detail)
                    req.result = result[0]
                    next()
                }
            }
        })
    }
}

exports.add_proof_of_payment_trader = () => {
    return (req, res, next) => {
        let PoP = {
            order_id: req.body.order_id,
            date_proof: req.body.date_proof,
            time_proof: req.body.time_proof,
        }
        db.query('INSERT INTO proofofpayment SET ?', PoP, (err) => {
            if (err) throw err;
            else {
                if (req.body.image_proof) {
                    let image_proof = req.body.image_proof.slice(req.body.image_proof.indexOf(',') + 1)
                    require("fs").writeFile("./image/payment/payment_" + req.body.order_id + '.png', image_proof, 'base64', function (err) {
                        if (err) throw err;
                        console.log('1')
                        db.query(`UPDATE proofofpayment SET image_proof= 'trader/image/payment/payment_${req.body.order_id}.png'  WHERE order_id= '${req.body.order_id}'`, function (err, result) {
                            if (err) throw err;
                            else {
                                let sd = {
                                    order_status: 2,
                                    date_of_payment: moment().utc(7).add('years', 543).format(),
                                }
                                db.query('UPDATE order_trader SET ? WHERE order_id=?', [sd, req.body.order_id], (err) => {
                                    if (err) throw err
                                    else {
                                        db.query('SELECT email FROM user_information WHERE type_user=4', (err, res_email) => {
                                            if (err) throw err
                                            else {
                                                let mailOptions = {
                                                    // from: 'sender@hotmail.com',                // sender
                                                    to: res_email[0].email,                // list of receivers
                                                    subject: 'แจ้งการชำระเงินคำสั่งซื้อหมายเลข' + req.body.order_id,              // Mail subject
                                                    html: `
                                                            <p>หมายเลขของคำสั่งซื้อ #${req.body.order_id} แจ้งชำระเงินแล้ว <br/>${moment().lang("th").utc(7).add('years', 543).format('LLLL')} น.</p>
                                                        
                                                            <b>ดูข้อมูลเพิ่มเติม</b>
                                                            <a href=http://${constance.domain_name}/M_Order/gg?aa=${req.body.order_id}>กรุณากด ที่นี่</a>`   // HTML body
                                                };

                                                constance.transporter.sendMail(mailOptions, function (err, info) {
                                                    if (err)
                                                        console.log(err)
                                                    else
                                                        console.log(info);
                                                });
                                                next()
                                            }

                                        })

                                    }
                                })
                            }
                        });
                    });
                }
            }
        })
    }
}
exports.get_proof_of_payment_trader = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM proofofpayment WHERE order_id=?', req.body.order_id, (err, result) => {
            if (err) throw err
            else {
                req.result = result[0]
                next()
            }
        })
    }
}

exports.add_send_demand = () => {
    return (req, res, next) => {
        console.log(req.body)
        let object = {
            product_name: req.body.product_name,
            nutrient: req.body.nutrient,
            volume: req.body.volume,
            volume_type: req.body.volume_type,
            product_status: req.body.product_status,
            trader_id: req.user_id,
        }
        db.query('INSERT INTO product_information SET ?', object, (err) => {
            if (err) throw err
            else {
                next()
            }
        })
    }
}

exports.get_send_demand_personal = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_information WHERE trader_id = ?', req.user_id, (err, result) => {
            if (err) throw err
            else {
                result.map((element) => {
                    element.nutrient = JSON.parse(element.nutrient)
                })
                req.result = result
                next()
            }
        })
    }
}

exports.get_send_demand = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_information', (err, result) => {
            if (err) throw err
            else {
                result.map((element) => {
                    element.nutrient = JSON.parse(element.nutrient)
                })
                req.result = result
                next()
            }
        })
    }
}

exports.get_product_plan = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_plan INNER JOIN product_information ON product_plan.product_id = product_information.product_id WHERE product_information.product_id=? AND send_se>2',
            req.body.product_id, (err, result) => {
                if (err) throw err
                else {
                    result.map((element) => {
                        try {
                            element.nutrient = JSON.parse(element.nutrient)
                        }
                        catch (error) {
                            console.log(error)
                        }
                        try {
                            element.nutrient_precent = JSON.parse(element.nutrient_precent)
                        }
                        catch (error) {
                            console.log(error)
                        }
                        try {
                            element.plant = JSON.parse(element.plant)
                        }
                        catch (error) {
                            console.log(error)
                        }

                    })
                    req.result = result
                    next()
                }
            })
    }
}

exports.get_product_plan_price = () => {
    return (req, res, next) => {
        console.log(req.body)
        db.query('SELECT * FROM product_plan INNER JOIN product_information ON product_information.product_id=product_plan.product_id WHERE product_plan.product_id=? AND send_se>2', req.body.product_id, (err, result) => {
            if (err) throw err
            else {
                if (result[0]) {
                    db.query('SELECT * FROM plant_stock', (err, result_plant) => {
                        if (err) throw err
                        else {
                            let data_send = []
                            result.map((element) => {
                                let price = []
                                try {
                                    element.nutrient = JSON.parse(element.nutrient)
                                }
                                catch (error) {
                                    console.log(error)
                                }
                                try {
                                    element.nutrient_precent = JSON.parse(element.nutrient_precent)
                                }
                                catch (error) {
                                    console.log(error)
                                }
                                try {

                                    element.plant = JSON.parse(element.plant)
                                    let plant = element.plant
                                    console.log(plant)
                                    element.plant.map((ele) => {
                                        let price_ele = 0
                                        result_plant.map((ele_r_p) => {
                                            if ((ele.plant_name).trim() === (ele_r_p.plant_name).trim()) {
                                                ele_r_p.price = JSON.parse(ele_r_p.price)
                                                let price = ele_r_p.price
                                                console.log(price[0].price)
                                                price_ele = price[0].price
                                            }
                                        })
                                        price.push({
                                            ...ele,
                                            price: price_ele
                                        })
                                    })
                                }
                                catch (error) {
                                    console.log(error)
                                }
                                data_send.push({
                                    ...element,
                                    price: price
                                })

                            })

                            req.result = data_send
                            next()
                        }
                    })

                }
                else {
                    res.status(200).json({
                        'success': false,
                        'error_message': "ไม่พบสูตรการพัฒนา"
                    })
                }
            }
        })
    }
}


exports.get_result_demand = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_information INNER JOIN ')
    }
}

exports.get_tracking_order = () => {
    return (req, res, next) => {

    }
}

exports.add_review_order = () => {
    return (req, res, next) => {
        console.log(req.body)
        // next()
    }
}

exports.finish_trader_order = () => {
    return (req, res, next) => {
        let order_id = req.body.order_id
        let order_status = {
            order_status: req.body.order_status,
            date_end: moment().utc(7).add('years', 543).format(),
        }
        db.query('UPDATE order_trader SET ? WHERE order_id = ?', [order_status, order_id], (err) => {
            if (err) throw err
            db.query('UPDATE order_se SET order_se_status=? WHERE order_trader_id = ?', [req.body.order_status, req.body.order_id], (err) => {
                if (err) throw err
                else {
                    next()
                }
            })
        })
    }
}

exports.get_send_demand_draft = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_information WHERE product_id=?', req.body.product_id, (err, result) => {
            if (err) throw err
            else {
                result[0].nutrient = JSON.parse(result[0].nutrient)
                req.result = result[0]
                // console.log(result[0])
                next()
            }
        })
    }
}

exports.update_send_demand = () => {
    return (req, res, next) => {
        console.log(req.body)
        let object = {
            product_name: req.body.product_name,
            nutrient: req.body.nutrient,
            volume: req.body.volume,
            volume_type: req.body.volume_type,
            product_status: req.body.product_status,
            trader_id: req.user_id,
        }
        db.query('UPDATE product_information SET ? WHERE product_id=?', [object, req.body.product_id], (err) => {
            if (err) throw err
            else {
                next()
            }
        })
    }
}