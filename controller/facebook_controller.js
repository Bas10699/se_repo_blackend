var db = require('../connect/test_connect')
var bcrypt = require('bcryptjs')
var jsonwebToken = require('jsonwebtoken')
var errorMessager = require('../const/error_message')
var encrytp = require('../const/encrypt')
var constance =require('../const/constance')

exports.facebook_user =()=>{
    return(req,res,next)=>{
        var data = { 
            username: req.user.displayName,
            User_ID : req.user.id,
            role: req.user.provider };

        var sql = 'INSERT INTO useraccount SET ?';
        db.query(sql, data, (err, result) => {//console.log('data',result.insertId)
                if (err){
                    console.log("error ocurred");
                    if (err.code === 'ER_DUP_ENTRY'){
                        console.log("User Not");
                    //     res.status(200).json({
                    //     'success': false,
                    //     'error_message': " มีบัญชีผู้ใช้แล้ว"
                        
                    //   })
                      next()
                     }
                     else
                        throw err;
                  }
                  else{
         
                     //req.token = jsonwebToken.sign({id: result.insertId}, constance.sign)
                     var dataprofile ={
                         name : req.body.name,
                         lastname :req.body.lastname,
                         address : req.body.address,
                         phone : req.body.phone,
                         username : data.username,
                         User_ID : result.insertId}
                     db.query('INSERT INTO userprofile SET ?',dataprofile, (err, result) => {//console.log('data',result.insertId)
                         if (err){
                         console.log("error ocurred");
                         throw err;
                         }
                         else{
                             req.token = jsonwebToken.sign({id: result.insertId}, constance.sign)
                             next()
                         }
                     });
                  }
                   
            });
    }
}