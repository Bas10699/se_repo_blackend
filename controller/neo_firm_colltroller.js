var db = require('../connect/test_connect')
var moment = require('moment')
var errorMessages = require('../const/error_message')

exports.get_order_se = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM user_information WHERE user_id = ?', req.user_id, (err, result) => {
            if (err) throw err
            else {
                db.query('SELECT * FROM order_se WHERE se_name = ?', result[0].name, (err, result) => {
                    if (err) throw err
                    else {
                        if (!result) {
                            res.status(200).json({
                                'success': false,
                                'error_message': 'ไม่มีรายการของ ' + name
                            })
                        } else {
                            req.result = result
                            next()
                        }
                    }
                })
            }
        })

    }
}
exports.add_invoice_se = () => {
    return (req, res, next) => {
        console.log('add_invoice_se', req.body)
        
        // db.query('INSERT INTO order_se_invoice SET ?', (err) => {
        //     if (err) throw err
        //     else {
        //         next()
        //     }
        // })
    }
}

exports.get_detail_order_se = () => {
    return (req, res, next) => {
        let order = null
        db.query('SELECT * FROM order_se_invoice RIGHT JOIN order_se ON order_se_invoice.order_se_id = order_se.order_se_id WHERE order_se.order_se_id = ?', req.body.order_id, (err, result) => {
            if (err) throw err
            else {
                if (!result) {

                    res.status(200).json({
                        'success': false,
                        'error_message': 'ไม่มีรายการของ ' + name
                    })
                } else {
                    db.query('SELECT cost FROM plant_stock WHERE plant_name=?', result[0].plant_name, (err, result_plant) => {
                        if (err) throw err
                        order = {
                            ...result[0],
                            ...result_plant[0]
                        }
                        req.result = order
                        next()
                    })

                }
            }
        })

    }
}

exports.get_linechart_some_se = function () {
    return function (req, res, next) {
        db.query(`SELECT user_information.name,manufacture_information.plant_type,farmer_information.title_name,farmer_information.first_name,farmer_information.last_name FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.user_id = ?`, req.user_id, function (err, result) {
            if (err) throw err;
            // let name_se = []
            // let test_result = []
            // let keep_req = result[0].name
            // console.log(result[0].name, req.user_id)

            // let plant_el = []
            // let month = []

            // result.map((el) => {

            //     if (el.name === keep_req) {


            //         let se_plant
            //         try {
            //             se_plant = JSON.parse(el.plant_type)

            //             se_plant.map((ele) => {

            //                 test_result.push(
            //                     {
            //                         name: keep_req,
            //                         plant: ele.plant,
            //                         eliver_frequency_number: ele.eliver_frequency_number,
            //                         deliver_value: ele.deliver_value,
            //                         value: ele.eliver_frequency_number * ele.deliver_value,
            //                         month: ele.end_plant
            //                     }

            //                 )

            //                 index = plant_el.findIndex((elem) => elem === ele.plant)
            //                 if (index < 0) {
            //                     if (ele.plant !== null) {
            //                         plant_el.push(
            //                             ele.plant
            //                         )
            //                     }
            //                 } else {

            //                 }

            //             })
            //         } catch (err) {

            //         }

            //     }



            // })

            // plant_el.map((el_plant, index) => {

            //     let january = 0
            //     let febuary = 0
            //     let march = 0
            //     let april = 0
            //     let may = 0
            //     let june = 0
            //     let july = 0
            //     let august = 0
            //     let september = 0
            //     let october = 0
            //     let november = 0
            //     let december = 0

            //     result.map((elem_plant) => {

            //         let element_plant
            //         try {
            //             element_plant = JSON.parse(elem_plant.plant_type)
            //         }
            //         catch (err) {

            //         }
            //         // console.log(element_plant)
            //         if (element_plant) {


            //             element_plant.map((elem_plant_obj) => {
            //                 if (el_plant === elem_plant_obj.plant && keep_req === elem_plant.name) {

            //                     if (elem_plant_obj.end_plant == "มกราคม") {
            //                         january = january + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "กุมภาพันธ์") {
            //                         febuary = febuary + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "มีนาคม") {
            //                         march = march + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "เมษายน") {
            //                         april = april + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "พฤษภาคม") {
            //                         may = may + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "มิถุนายน") {
            //                         june = june + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "กรกฎาคม") {
            //                         july = july + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "สิงหาคม") {
            //                         august = august + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "กันยายน") {
            //                         september = september + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "ตุลาคม") {
            //                         october = october + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "พฤศจิกายน") {
            //                         november = november + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     } else if (elem_plant_obj.end_plant == "ธันวาคม") {
            //                         december = december + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
            //                     }

            //                 }


            //             })




            //         }
            //     })

            //     month.push({
            //         name: el_plant,
            //         data: [january, febuary, march, april, may, june, july, august, september, october, november, december]
            //     })
            // })
            // name_se.push(
            //     {
            //         se_name: keep_req,
            //         plant: month
            //     }
            // )

            let plant_name = []

            result.map((element) => {
                element.plant_type = JSON.parse(element.plant_type)
                let plant_type = element.plant_type
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
            })
            let plant_se = []
            let month = []

            plant_name.map((ele_plant) => {
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
                    let plant_type = element.plant_type
                    if (plant_type !== null) {
                        plant_type.map((ele_pla) => {
                            if (ele_plant === ele_pla.plant) {

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
                })
                month.push({
                    name: ele_plant,
                    data: [january, febuary, march, april, may, june, july, august, september, october, november, december],
                    detail: [jan, feb, mar, apr, ma, jun, jul, aug, sep, oct, nov, dec]
                })
            })
            plant_se.push({
                se_name: result[0].name,
                plant: month
            })

            req.result = plant_se
            next();


        })
    }

}

exports.get_farmer_se = () => {
    return (req, res, next) => {
        let farmer = []
        let plant = []
        db.query('SELECT * from farmer_information INNER JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id WHERE user_id=?', req.user_id, (err, result) => {
            if (err) throw err
            else {
                result.map((element) => {
                    element.plant_type = JSON.parse(element.plant_type)
                    element.plant_type.map((ele) => {
                        if (ele.year_value_unit === 'ตัน') {
                            ele.year_value = ele.year_value * 1000
                        }
                        if (ele.plant !== null && ele.plant !== '' && ele.plant !== undefined) {
                            if (ele.year_value !== null) {
                                if (((ele.deliver_value * 1) !== 0) || ((ele.year_value * 1) !== 0)) {
                                    farmer.push({
                                        title_name: element.title_name,
                                        first_name: element.first_name,
                                        last_name: element.last_name,
                                        plant: ele.plant,
                                        year_value: ele.year_value * 1,
                                        year_value_unit: ele.year_value_unit,
                                        deliver_value: ele.deliver_value * 1,
                                        product_value: ele.product_value * 1,
                                        growingArea: ele.growingarea * 1,
                                        end_plant: ele.end_plant,
                                        deliver_frequency_number: ele.deliver_frequency_number
                                    })
                                }
                            }


                        }


                    })

                })
                // req.result = result[0]
                req.result = farmer
                next()
            }
        })
    }
}

exports.up_stock_se = () => {
    return (req, res, next) => {
        let plant_name = []
        let name_se = []
        db.query('SELECT user_information.user_id,user_information.name,manufacture_information.plant_type,farmer_information.title_name,farmer_information.first_name,farmer_information.last_name FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = 3', (err, result) => {
            if (err) throw err
            else {
                result.map((element) => {
                    index = name_se.findIndex((elem) => elem.id === element.user_id)
                    if (index < 0) {
                        name_se.push({
                            id: element.user_id,
                            name: element.name
                        })
                    }
                })
                name_se.map((ele_name) => {
                    result.map((element) => {

                        if (ele_name.name === element.name) {
                            element.plant_type = JSON.parse(element.plant_type)
                            let plant_type = element.plant_type
                            if (plant_type !== null) {
                                plant_type.map((ele_pla) => {


                                    index = plant_name.findIndex((elem) => elem.plant_name === ele_pla.plant)
                                    if (index < 0) {
                                        if (ele_pla.plant !== null && ele_pla.plant !== undefined) {
                                            // console.log(ele_pla.plant)
                                            plant_name.push({
                                                id_se: element.user_id,
                                                name_se: element.name,
                                                plant_name: ele_pla.plant
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                })

                req.result = plant_name
                next()
            }
        })
    }
}

exports.add_order_farmer = () => {
    return (req, res, next) => {

        req.body.object.map((element) => {
            let obj = {
                order_farmer_id: 'Mr' + req.user_id + moment().utc(7).add('years', 543).format('YYYYMMDD'),
                order_farmer_title_name: element.title_name,
                order_farmer_name: element.first_name,
                order_farmer_lastname: element.last_name,
                order_farmer_plant: element.plant,
                order_farmer_plant_volume: element.amount,
                order_farmer_plant_cost: req.body.cost,
                order_se_id: req.body.order_se_id,
                order_farmer_status: 0

            }
            db.query('INSERT INTO order_farmer SET ?', obj, (err) => {
                if (err) throw err
                else {
                    next()
                }
            })
        })

    }
}

exports.get_order_farmer = () => {
    return(req,res,next)=>{
        db.query('SELECT * FROM order_farmer WHERE order_se_id = ?',req.body.order_se_id,(err,result)=>{
            if(err) throw err
            else{
                req.result = result
                next()
            }
        })
    }
}

exports.get_Certified = () => {
    return (req, res, next) => {
        // console.log(req.user_id)
        let data = []
        db.query('SELECT * from farmer_information INNER JOIN area_information ON farmer_information.farmer_id = area_information.farmer_id WHERE user_id=?', req.user_id, (err, result) => {
            if (err) throw err
            else {


                result.map((element) => {
                    data.push({
                        title_name: element.title_name,
                        first_name: element.first_name,
                        last_name: element.last_name,
                        area_storage: element.area_storage,
                        chemical_date: element.chemical_date
                    })
                })
                req.result = data
                next()
            }
        })
    }
}

//$2a$10$bq/BRgH.XI8b/SSJrK4he.f8YL7RNohKz8F4g9cNXjhr0FLafrmjK