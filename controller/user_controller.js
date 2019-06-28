var db = require('../connect/test_connect')
var bcrypt = require('bcryptjs')
var jsonwebToken = require('jsonwebtoken')
var errorMessager = require('../const/error_message')
var encrytp = require('../const/encrypt')
var constance =require('../const/constance')

exports.User_Register = () =>{
    return(req,res,next) => {
        var data = { 
            username: req.body.username,
            email:req.body.email,
            password: encrytp.encrytp(req.body.password),
            user_type: req.body.user_type };

   var sql = 'INSERT INTO useraccount SET ?';
   db.query(sql, data, (err, result) => {//console.log('data',result.insertId)
         if (err){
            console.log("error ocurred");
            if (err.code === 'ER_DUP_ENTRY'){
               console.log("User Not");
               res.status(200).json({
               'success': false,
               'error_message': " มีบัญชีผู้ใช้แล้ว"
             })
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
                username : req.body.username,
                User_ID : result.insertId}

            db.query('INSERT INTO userprofile SET ?',dataprofile, (err, result) => {//console.log('data',result.insertId)
                if (err){
                console.log("error ocurred");
                throw err;
                }
                else{
                    if(req.body.user_image){
                     let user_image = req.body.user_image.slice(req.body.user_image.indexOf(',') + 1)
                    require("fs").writeFile("./image/user/user" + result.insertId + '.png', user_image, 'base64', function (err) {
                        if (err) throw err;
                        db.query(`UPDATE userprofile  SET user_image = 'user/image/user_${result.insertId}.png'  WHERE pro_id = ${result.insertId}`, function (err, result) {
                            if (err) throw err;
                            next()
                        });
                    });   
                    }
                    else{
                      req.token = jsonwebToken.sign({id: result.insertId}, constance.sign)
                    next()  
                    }
                    
                }
            });
         }
          
   });
    }

}


exports.User_Login = () =>{
    return (req,res,next) => {
        let username = req.body.username
        let email = req.body.email
        db.query(`SELECT * FROM useraccount WHERE username = ? OR email = ?`,[username,email], (err,result)=>{
            if(err) throw err;//console.log(`SELECT * From useraccount WHERE Username = '${Username}'`)
            if(result[0]){
                let password = result[0].password
                if (bcrypt.compareSync(req.body.password, password)) {
    
                    req.token = jsonwebToken.sign({
                        id: result[0].User_ID,
                        type: result[0].user_type
                    },constance.sign)
    
                    next()
                }
                else{
                    res.status(200).json(errorMessager.err_wrong_password)
            }
            }
            else{
                res.status(200).json(errorMessager.err_user_not_found)
            }
        })
    }
}

exports.user_update_password= () => {
    return (req,res,next) => {
    let user_id = req.user_id

    db.query(`SELECT password FROM useraccount WHERE User_ID = ?`,user_id, (err,result)=>{
        if(err) throw err;//console.log(`SELECT * From useraccount WHERE Username = '${Username}'`)
        if(result[0]){
            let password = result[0].password
            if (bcrypt.compareSync(req.body.password, password)) {
                
                let updateInfo = {
                    user_id : req.user_id,
                    password: encrytp.encrytp(req.body.newpassword)
                }

                if(updateInfo.password !== "" ){
        
                    db.query("UPDATE useraccount SET Password = ? WHERE User_ID  = ?",[updateInfo.password,updateInfo.user_id], function (err, result) {
                        if (err) throw err;
                        console.log("okkub")
                        next();
                    })
                }
                else{
                    console.log("pass0...",req.body.newpassword)
                }
            }
            else{
                res.status(200).json(errorMessager.err_check_password)
        }
        }
        else{
            res.status(200).json(errorMessager.err_user_not_found)
        }
    })}
}


exports.user_update_data = () =>{
    return(req,res,next)=>{
        let user_id = req.user_id;
        //console.log('user_id',user_id)
        let data_update ={
            username : req.body.username,
            name : req.body.name,
            lastname :req.body.lastname,
            address : req.body.address,
            phone : req.body.phone
        }
        db.query('UPDATE useraccount SET username = ? WHERE User_ID = ?',[data_update.username,user_id],(err,result)=>{
            if (err) throw err;

            db.query('UPDATE userprofile SET ? WHERE User_ID = ?',[data_update,user_id],(err,result)=>{
                if (err) throw err;
                if(req.body.user_image){
                    let user_image = req.body.user_image.slice(req.body.user_image.indexOf(',') + 1)
                   require("fs").writeFile("./image/user/user" + result.insertId + '.png', user_image, 'base64', function (err) {
                       if (err) throw err;
                       db.query(`UPDATE userprofile  SET user_image = 'user/image/user_${result.insertId}.png'  WHERE pro_id = ${result.insertId}`, function (err, result) {
                           if (err) throw err;
                           next()
                       });
                   });   
                   }
                   else{
                     req.token = jsonwebToken.sign({id: result.insertId}, constance.sign)
                   next()  
                   }
            })           
        })
    }
}

