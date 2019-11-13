var db = require('../connect/test_connect')
var moment = require('moment')
var errorMessages = require('../const/error_message')

exports.get_plant_se = () => {
    return (req, res, next) => {
        db.query('SELECT user_information.name,manufacture_information.plant_type,farmer_information.title_name,farmer_information.first_name,farmer_information.last_name FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = 3', (err, result) => {
            if (err) throw err
            else {
                let plant_name = []
                result.map((element) => {
                    element.plant_type = JSON.parse(element.plant_type)
                    let plant_type = element.plant_type
                    plant_type.map((ele_plant) => {
                        index = plant_name.findIndex((elem) => elem === ele_plant.plant)
                        if (index < 0) {
                            // console.log(ele_pla.plant)
                            if (ele_plant.plant !== null && plant_name !== undefined)
                                plant_name.push(
                                    ele_plant.plant
                                )

                        }
                    })

                })
                req.result = result
                next()
            }
        })
    }
}

// exports.add_demand_ = () => {
//     return (req, res, next) => {
//         console.log(req.body)
//         db.query('INSERT INTO product_information SET ?', (err, result) => {
//             if (err) throw err
//         })
//     }
// }

exports.add_nutrient_information = () => {
    return (req, res, next) => {
        req.body.nutrient.map((element) => {
            let obj = {
                nutrient_name: element.name,
                volume: element.y,
                plant_name: req.body.plant_name
            }
            db.query('INSERT INTO nutrient_information SET ?', obj, (err) => {
                if (err) throw err

            })
        })
        next()
    }
}

exports.get_nutrient_information_plant = () => {
    return (req, res, next) => {
        db.query('SELECT plant_name,nutrient_id FROM nutrient_information GROUP BY plant_name', (err, result) => {
            if (err) throw err
            else {
                req.result = result
                next()
            }
        })
    }
}

exports.get_nutrient_information = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM nutrient_information', (err, result) => {
            if (err) throw err
            else {
                req.result = result
                next()
            }
        })
    }
}

exports.get_demand_trader_all = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_information INNER JOIN user_information ON product_information.trader_id = user_information.user_id ORDER BY product_id DESC', (err, result) => {
            if (err) throw err
            else {

                result.map((element) => {
                    try {
                        element.nutrient = JSON.parse(element.nutrient)
                    } catch (error) {
                        console.log(error)
                    }
                })
                req.result = result
                next()
            }
        })
    }
}

exports.get_demand_personal = () => {
    return (req, res, next) => {
        db.query(`SELECT *,product_information.product_id,COUNT(product_plan.plan_id) AS count_plan FROM product_information 
        INNER JOIN product_researcher 
        ON product_information.product_id = product_researcher.product_id 
        LEFT JOIN product_plan 
        ON product_information.product_id=product_plan.product_id 
        WHERE product_researcher.researcher_id =? 
        GROUP BY product_information.product_id 
        ORDER BY product_information.product_id DESC`,
            req.user_id, (err, result) => {
                if (err) throw err
                else {
                    req.result = result
                    next()
                }
            })
    }
}

exports.delete_product_plan = () => {
    return (req, res, next) => {
        db.query('DELETE FROM product_plan WHERE plan_id=?', req.body.plan_id, (err) => {
            if (err) throw err
            else {
                next()
            }
        })
    }
}

exports.send_developer_demand = () => {
    return (req, res, next) => {
        db.query('UPDATE product_plan SET send_se=2 WHERE plan_id=?', req.body.plan_id, (err) => {
            if (err) throw err
            else {
                db.query('UPDATE product_information SET product_status = 3 WHERE product_id=?', req.body.product_id, (err) => {
                    if (err) throw err
                    else {
                        next()
                    }
                })

            }
        })
    }
}

exports.confirm_resercher_damand = () => {
    return (req, res, next) => {
        console.log(req.body)
        if (req.body.product_researcher_status === 1) {

            db.query('UPDATE product_researcher SET product_researcher_status=1 WHERE product_id=? AND researcher_id=?'
                , [req.body.product_id, req.user_id], (err) => {
                    if (err) throw err
                    else {
                        next()
                    }
                })
        }
        else {
            db.query('UPDATE product_researcher SET product_researcher_status=2 WHERE product_id=? AND researcher_id=?'
                , [req.body.product_id, req.user_id], (err) => {
                    if (err) throw err
                    else {
                        next()
                    }
                })
        }

    }
}

exports.get_demand_detail = () => {
    return (req, res, next) => {
        console.log(req.body)
        db.query('SELECT * FROM product_information WHERE product_id=?', req.body.product_id, (err, result) => {
            if (err) throw err
            else {
                result[0].nutrient = JSON.parse(result[0].nutrient)
                req.result = result[0]
                next()
            }
        })
    }
}

exports.add_product_plan = () => {
    return (req, res, next) => {
        // console.log(req.body)
        let obj = {
            product_id: req.body.product_id,
            nutrient_precent: req.body.nutrient_precent,
            plant: req.body.plant,
            product_plan_name: req.body.product_plan_name,
            researcher_id: req.user_id,
            send_se: 1
        }
        db.query('INSERT INTO product_plan SET ? ', obj, (err, result) => {
            if (err) throw err
            else {
                if (req.body.image != 0) {
                    let pro_image = req.body.image.slice(req.body.image.indexOf(',') + 1)
                    require("fs").writeFile("./image/productPlan/productPlan_" + result.insertId + '.png', pro_image, 'base64', function (err) {
                        if (err) throw err;
                        else {
                            db.query(`UPDATE product_plan  SET image = 'researcher/image/productPlan_${result.insertId}.png'  WHERE plan_id = ${result.insertId}`, function (err) {
                                if (err) throw err;
                                // console.log('data', result.insertId)
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
}

exports.get_product_plan_detail = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_plan INNER JOIN product_information ON product_information.product_id = product_plan.product_id WHERE researcher_id=? AND send_se=1',
            req.user_id, (err, result) => {
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

exports.get_history_product_plan_detail = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_plan INNER JOIN product_information ON product_information.product_id = product_plan.product_id WHERE researcher_id=? AND send_se>1',
            req.user_id, (err, result) => {
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
                            if (el.plant !== undefined && el.plant !== null)
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

                req.result = result_new

                next();
            })
        })
    }
}

exports.get_plant_all_mount = function () {
    return function (req, res, next) {
        db.query(`SELECT user_information.name,manufacture_information.plant_type,farmer_information.title_name,farmer_information.first_name,farmer_information.last_name FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = 3`, function (err, result) {
            if (err) throw err;
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
                                    // jan.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "กุมภาพันธ์") {
                                    febuary = febuary + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // feb.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "มีนาคม") {
                                    march = march + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // mar.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "เมษายน") {
                                    april = april + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // apr.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "พฤษภาคม") {
                                    may = may + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // ma.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "มิถุนายน") {
                                    june = june + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // jun.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "กรกฎาคม") {
                                    july = july + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // jul.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "สิงหาคม") {
                                    august = august + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // aug.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "กันยายน") {
                                    september = september + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // sep.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "ตุลาคม") {
                                    october = october + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // oct.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "พฤศจิกายน") {
                                    november = november + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // nov.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                } else if (ele_pla.end_plant == "ธันวาคม") {
                                    december = december + (ele_pla.deliver_frequency_number * ele_pla.deliver_value)
                                    // dec.push({
                                    //     ...ele_pla,
                                    //     title_name: element.title_name,
                                    //     first_name: element.first_name,
                                    //     last_name: element.last_name,
                                    // })
                                }

                            }
                        })
                    }
                })
                month.push({
                    name: ele_plant,
                    data: [january, febuary, march, april, may, june, july, august, september, october, november, december],
                    // detail: [jan, feb, mar, apr, ma, jun, jul, aug, sep, oct, nov, dec]
                })
            })
            plant_se.push({
                se_name: result[0].name,
                plant: month
            })

            req.result = month
            next();


        })
    }

}
