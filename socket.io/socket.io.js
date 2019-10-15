module.exports = function(io){
    var express = require('express')
    var router = express.Router()


    // รอการ connect จาก client
    io.of('/admin').on('connection', client => {
        // console.log('user connected')
      
        // เมื่อ Client ตัดการเชื่อมต่อ
        // client.on('disconnect', () => {
        //     console.log('user disconnected')
        // })
    
        // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
        // console.log(client)
        client.on('sent-message', function (message) {
            let mes = {
                mes: message,
                add: client.handshake.address,
                time: client.handshake.time
            }
            io.of('/admin').emit('new-message', mes)
        })
    })
    

    return router

}