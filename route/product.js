// var express = require('express')
// var router = express.Router()
// var productUtil = require('../controller/product_controller')
// var validateUtil = require('../controller/validate_controller')

// router.get('/show_product',
//     productUtil.show_product(),
//     (req, res) => {
//         res.status(200).json({
//             success: true,
//             result: req.result
//         })
//     }
// )

// router.post('/show_product_info',
//     validateUtil.validate_show_product_info(),
//     productUtil.show_product_info(),
//     (req, res) => {
//         res.status(200).json({
//             success: true,
//             result: req.result
//         })
//     }
// )

// router.post('/add_product',
//     // validateUtil.validate_add_product(),
//     productUtil.add_product(),
//     (req, res) => {
//         res.status(200).json({
//             success: true,
//             message: 'เพิ่มสินค้าเรียบร้อย'
//         })
//     }
// )

// router.post('/update_product_info',
//     validateUtil.validate_update_product(),
//     productUtil.update_product(),
//     (req, res) => {
//         res.status(200).json({
//             success: true,
//             message: 'แก้ไขสินค้าเรียบร้อย'
//         })
//     }
// )
// router.post('/delete_product',
//     productUtil.delete_product(),
//     (req, res) => {
//         res.status(200).json({
//             success: true,
//             message: 'ลบสินค้าเรียบร้อย'
//         })
//     }
// )
// router.get('/image/:id',
//     function (req, res) {

//         require("fs").readFile(__dirname.replace("route", "") + 'image/product/' + req.params.id, (err, data) => {

//             if(err!==null){
//                 res.sendFile(__dirname.replace("route", "") + 'image/default_product.png')
//             }else{
//             res.sendFile(__dirname.replace("route", "") + 'image/product/' + req.params.id)
//             }

//         })

//     })
// module.exports = router