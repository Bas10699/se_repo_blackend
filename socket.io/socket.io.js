module.exports = function (io) {
    var express = require('express')
    var router = express.Router()
    var db = require('../connect/test_connect')
    var moment = require('moment')
    var socketUtil = require('./socket_controller')


    router.get('/noti_trader',
        socketUtil.get_notiOrderTrader(),
        (req, res) => {
            res.status(200).json({
                'success': true,
                result: req.result
            })
        }

    )
    router.get('/noti_SE_Middle',
        socketUtil.get_noti_Middle(),
        (req, res) => {
            res.status(200).json({
                'success': true,
                result: req.result
            })
        }

    )


    io.of('/api/v1/').on('connection', client => {
        // console.log('user connected')
        // console.log('conn')
        // เมื่อ Client ตัดการเชื่อมต่อ
        // client.on('disconnect', () => {
        //     console.log('user disconnected')
        // })

        // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
        // console.log(client)
        client.on('send-noti', function (message) {
            io.of('/api/v1/').emit('new-noti', message)
            console.log('gg', message)
        })
        client.on('send-noti-se', function (message) {
            io.of('/api/v1/').emit('new-noti-se', message)
            console.log('gg', message)
        })
    })
    return router
}