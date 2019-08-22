var express = require('express')
var router = express.Router()
var db = require('../connect/test_connect')
var jsonwebToken =require('jsonwebtoken')
var errorMessages = require('../const/error_message')
var fs = require('fs')

router.get('/',function(req,res){
    //res.status(200).json('Wellcome to Project')
    let sql = 'SELECT * From useraccount INNER JOIN userprofile ON useraccount.User_ID = userprofile.User_ID'
    db.query(sql, (err,result)=> {
        res.send({success: true,
            result: result})
    })
})

router.get('/show_user',(req,res)=>{

        if (!Boolean(req.headers["authorization"])) {
            res.status(200).json({
              success: false,
              message: errorMessages.err_required_token
            });
          } else {
            // console.log("token")
            jsonwebToken.verify(
              req.headers.authorization,
              'secret',
              (err, decode) => {
                if (err) {
                  // console.log(decode.type)
                  res.status(200).json(errorMessages.err_required_fingerprint_token);
                } else {
                    //console.log(decode.Username)
                    let User_ID = decode.id
                    let sql = 'SELECT * From useraccount INNER JOIN userprofile ON useraccount.User_ID = userprofile.User_ID WHERE useraccount.User_ID = ?'
                    db.query(sql,User_ID, (err,result)=> {
                      if(err) throw err;
                    res.status(200).json({
                        success: true,
                        result : result[0]
                      })
                    })
                }
              }
            );
          }

        /*if(err) throw err
        console.log('Show Users seccess...')
        res.send(result)*/
})

module.exports = router;