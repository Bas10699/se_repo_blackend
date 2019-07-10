var db = require('../connect/test_connect')

exports.get_product = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM product_information', (err, result) => {
            if (err) throw err
            else {
                req.result = result
                next()
            }
        })
    }
}

exports.get_product_information = () => {
    return (req, res, next) => {
        console.log(req.body.product_id)

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
                        let result_all = null
                        result_all = {
                            ...result[0],
                            plant: plant_data
                        }

                        // let element_obj = []

                        // result[0].plant.map((element) => {
                        //     let element_plant = JSON.parse(element.plant)
                        //     let plant = []
                        //     let result_plan_id = []

                        //     element_plant.map((element) => {
                        //         plant.push(element.plant_id)
                        //         result_plan.map((ele) => {
                        //             if (element.plant_id == ele.plant_id) {
                        //                 result_plan_id.push(ele)
                        //             }
                        //         })
                        //     })
                        //     element_obj.push({
                        //         product_id: element.product_id,
                        //         product_name: element.product_name,
                        //         plant: result_plan_id

                        //     })
                        // })


                        req.result = result_all

                        next();
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
exports.add_cart_trader = () => {
    return (req, res, next) => {

        db.query('SELECT * FROM cart WHERE trader_id = ? AND product_id = ?', [req.user_id, req.body.product_id], (err, result) => {
            if (err) throw err
            else {
                if (result[0]) {
                    console.log("update")

                   let sum_amount = (Number(result[0].amount)+Number(req.body.amount))
                    console.log("sum_amont", sum_amount)

                    db.query('UPDATE cart SET amount = ? WHERE trader_id = ? AND product_id = ?', [sum_amount, req.user_id, req.body.product_id], (err, result) => {
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
                        product_id: req.body.product_id,
                        amount: req.body.amount
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
            else {
                db.query('SELECT * From product_information ', (err, result_product) => {
                    if (err) throw err
                    else {
                        let product = []


                        result.map((element) => {
                            let product_obj = null
                            result_product.map((element_result_product) => {
                                if (element.product_id == element_result_product.product_id) {
                                    product_obj = {
                                        ...element,
                                        ...element_result_product
                                    }


                                }
                            })

                            if (product_obj) {
                                product.push(product_obj)
                            }



                        })
                        console.log(product)
                        req.result = product
                        next()

                    }

                })

            }
        })
    }
}

exports.update_cart_trader =()=>{
    return(req,res,next) =>{
        let obj ={
            ...req.body.data
        }
       
        console.log(obj)
        // db.query('UPDATE cart SET amount = ? WHERE trader_id = ?',(err,result)=>{

        // })
    }
}

exports.add_order_trader = () => {
    return (req, res, next) => {
        let order = {
            product_id: req.body.product_id,
            volume: req.body.volume
        }
        let order_trader = JSON.stringify(order)

        let add_order = {
            detail: order_trader,
            order_status: req.body.order_status,
            trader_id: req.user_id
        }

        db.query('INSERT INTO order_trader SET ?', add_order, (err, result) => {
            if (err) throw err
            else {
                next()
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