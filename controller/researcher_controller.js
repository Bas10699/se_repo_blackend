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

exports.add_demand_ = () => {
    return (req, res, next) => {
        console.log(req.body)
        db.query('INSERT INTO product_information SET ?', (err, result) => {
            if (err) throw err
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
        db.query('SELECT * FROM product_information INNER JOIN product_researcher ON product_information.product_id = product_researcher.product_id WHERE product_researcher.researcher_id =? ORDER BY product_information.product_id DESC',
            req.user_id, (err, result) => {
                if (err) throw err
                else {
                    req.result = result
                    next()
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

exports.get_demand_detail = () =>{
    return(req,res,next)=>{
        console.log(req.body)
        // db.query('')
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
