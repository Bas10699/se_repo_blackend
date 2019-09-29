var db = require('../connect/test_connect')
var moment = require('moment')
var errorMessages = require('../const/error_message')

exports.get_order_se = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM userprofile WHERE user_id = ?', req.user_id, (err, result) => {
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
                        }
                        else {
                            req.result = result
                            next()
                        }
                    }
                })
            }
        })

    }
}

exports.get_linechart_some_se = function () {
    return function (req, res, next) {

        db.query('SELECT * FROM userprofile WHERE user_id = ?', req.user_id, (err, result_se) => {
            if (err) throw err
            else {
                db.query(`SELECT user_information.name,manufacture_information.plant_type FROM ((user_information LEFT JOIN farmer_information ON user_information.user_id = farmer_information.user_id) LEFT JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id) WHERE user_information.type_user = '3'`, function (err, result) {
                    if (err) throw err;
                    // req.result = result
                    let element_obj
                    let se_obj = []
                    // let se_plant = []

                    result.map((element) => {
                        let index
                        index = se_obj.findIndex((el) => el === element.name)
                        if (index < 0) {
                            if (element.plant_type !== null) {
                                try {
                                    JSON.parse(element.plant_type)
                                    se_obj.push(
                                        element.name
                                    )
                                } catch (err) {
                                }

                            } else { }
                        } else {

                        }
                    })
                    let name_se = []

                    let test_result = []
                    let keep_req = result_se[0].name
                    console.log(result[0].name,req.user_id)

                    let plant_el = []
                    let se_plant_el = []
                    let month = []

                    result.map((el) => {

                        if (el.name === keep_req) {


                            let se_plant
                            try {
                                se_plant = JSON.parse(el.plant_type)

                                se_plant.map((ele) => {

                                    test_result.push(
                                        {
                                            name: keep_req,
                                            plant: ele.plant,
                                            eliver_frequency_number: ele.eliver_frequency_number,
                                            deliver_value: ele.deliver_value,
                                            value: ele.eliver_frequency_number * ele.deliver_value,
                                            month: ele.end_plant
                                        }

                                    )

                                    index = plant_el.findIndex((elem) => elem === ele.plant)
                                    if (index < 0) {
                                        plant_el.push(
                                            ele.plant
                                        )
                                    } else {

                                    }

                                })
                            } catch (err) {

                            }

                        }



                    })

                    plant_el.map((el_plant, index) => {

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

                        result.map((elem_plant) => {

                            let element_plant
                            try {
                                element_plant = JSON.parse(elem_plant.plant_type)
                            }
                            catch (err) {

                            }
                            // console.log(element_plant)
                            if (element_plant) {


                                element_plant.map((elem_plant_obj) => {
                                    if (el_plant === elem_plant_obj.plant && keep_req === elem_plant.name) {

                                        if (elem_plant_obj.end_plant == "มกราคม") {
                                            january = january + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "กุมภาพันธ์") {
                                            febuary = febuary + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "มีนาคม") {
                                            march = march + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "เมษายน") {
                                            april = april + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "พฤษภาคม") {
                                            may = may + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "มิถุนายน") {
                                            june = june + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "กรกฎาคม") {
                                            july = july + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "สิงหาคม") {
                                            august = august + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "กันยายน") {
                                            september = september + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "ตุลาคม") {
                                            october = october + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "พฤศจิกายน") {
                                            november = november + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        } else if (elem_plant_obj.end_plant == "ธันวาคม") {
                                            december = december + (elem_plant_obj.deliver_frequency_number * elem_plant_obj.deliver_value)
                                        }

                                    }


                                })




                            }
                        })

                        month.push({
                            name: el_plant,
                            data: [january, febuary, march, april, may, june, july, august, september, october, november, december]
                        })
                    })
                    name_se.push(
                        {
                            se_name: keep_req,
                            plant: month
                        }
                    )



                    req.result = name_se
                    next();


                })
            }
        })


    }
}

exports.get_farmer_se = () =>{
    return(req,res,next)=>{
        db.query('SELECT * from farmer_information INNER JOIN manufacture_information ON farmer_information.farmer_id = manufacture_information.farmer_id WHERE user_id=?',req.user_id,(err,result)=>{
            if(err) throw err
            else{
                req.result=result
                next()
            }
        })
    }
}

//$2a$10$bq/BRgH.XI8b/SSJrK4he.f8YL7RNohKz8F4g9cNXjhr0FLafrmjK