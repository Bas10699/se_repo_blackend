var express = require('express')
var router = express.Router()

router.get('/ss', (req, res, next) => {
    let io = res.io
    var clients = 0
    io.on('connection', client => {
        console.log('user connected')
        clients++
        io.sockets.emit('broadcast', { message: clients + ' client connected!' })
        // เมื่อ Client ตัดการเชื่อมต่อ
        client.on('disconnect', () => {
            console.log('user disconnected')
            clients--
            io.sockets.emit('broadcast', { message: clients + ' client connected!' })
        })

        // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
        client.on('sent-message', function (message) {
            io.sockets.emit('new-message', { message })
        })
    })
})

module.exports = router