var db = require('../connect/test_connect')
var bcrypt = require('bcryptjs')
var jsonwebToken = require('jsonwebtoken')
var errorMessager = require('../const/error_message')
var encrytp = require('../const/encrypt')
var constance = require('../const/constance')

exports.User_Register = () => {
    return (req, res, next) => {
        console.log(req.body)
        var data = {
            username: req.body.username,
            password: encrytp.encrytp(req.body.password),
            type_user: req.body.type_user,
            name: req.body.name,
            last_name: req.body.lastname,
            address: req.body.address,
            phone: req.body.phone,
            user_informationcol: '-',
            team_code: 0,
            user_image: '',
            bank_information: ''
        };

        var sql = 'INSERT INTO user_information SET ?';
        db.query(sql, data, (err, result) => {//console.log('data',result.insertId)
            if (err) {
                console.log("error ocurred");
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log("User Not");
                    res.status(200).json({
                        'success': false,
                        'error_message': " มีบัญชีผู้ใช้แล้ว"
                    })
                }
                else
                    throw err;
            }
            else {
                if (req.body.user_image) {
                    let user_image = req.body.user_image.slice(req.body.user_image.indexOf(',') + 1)
                    require("fs").writeFile("./image/user/user" + result.insertId + '.png', user_image, 'base64', function (err) {
                        if (err) throw err;
                        db.query(`UPDATE user_information SET user_image = 'user/image/user_${result.insertId}.png'  WHERE user_id = ${result.insertId}`, function (err, result) {
                            if (err) throw err;
                            next()
                        });
                    });
                }
                else {
                    req.token = jsonwebToken.sign({ id: result.insertId }, constance.sign)
                    next()
                }
            }

        });
    }

}


exports.User_Login = () => {
    return (req, res, next) => {
        let username = req.body.username

        db.query('SELECT * FROM user_information WHERE username = ? ', username, (err, result) => {
            if (err) throw err;//console.log(`SELECT * From useraccount WHERE Username = '${Username}'`)
            if (result[0]) {
                let password = result[0].password
                if (bcrypt.compareSync(req.body.password, password)) {

                    req.token = jsonwebToken.sign({
                        id: result[0].user_id,
                        type: result[0].type_user
                    }, constance.sign)

                    next()
                }
                else {
                    res.status(200).json(errorMessager.err_wrong_password)
                }
            }
            else {
                res.status(200).json(errorMessager.user_work_not_found)
            }
        })
    }
}

exports.user_update_password = () => {
    return (req, res, next) => {
        let user_id = req.user_id

        db.query(`SELECT password FROM user_information WHERE user_id = ?`, user_id, (err, result) => {
            if (err) throw err;//console.log(`SELECT * From useraccount WHERE Username = '${Username}'`)
            if (result[0]) {
                let password = result[0].password
                if (bcrypt.compareSync(req.body.password, password)) {

                    let updateInfo = {
                        user_id: req.user_id,
                        password: encrytp.encrytp(req.body.newpassword)
                    }

                    if (updateInfo.password !== "") {

                        db.query("UPDATE user_information SET password = ? WHERE user_id  = ?", [updateInfo.password, updateInfo.user_id], function (err, result) {
                            if (err) throw err;
                            console.log("okkub")
                            next();
                        })
                    }
                    else {
                        console.log("pass0...", req.body.newpassword)
                    }
                }
                else {
                    res.status(200).json(errorMessager.err_check_password)
                }
            }
            else {
                res.status(200).json(errorMessager.err_user_not_found)
            }
        })
    }
}


exports.user_update_data = () => {
    return (req, res, next) => {
        let user_id = req.user_id;
        //console.log('user_id',user_id)
        let data_update = {
            username: req.body.username,
            name: req.body.name,
            last_name: req.body.lastname,
            address: req.body.address,
            phone: req.body.phone,
            bank_information: req.body.bank_information
        }

            db.query('UPDATE user_information SET ? WHERE user_id = ?', [data_update, user_id], (err, result) => {
                if (err) throw err;
                if (req.body.user_image) {
                    let user_image = req.body.user_image.slice(req.body.user_image.indexOf(',') + 1)
                    require("fs").writeFile("./image/user/user_" + req.user_id + '.png', user_image, 'base64', function (err) {
                        if (err) throw err;
                        db.query(`UPDATE user_information  SET user_image = 'user/image/user_${req.user_id}.png'  WHERE user_id= ${req.user_id}`, function (err, result) {
                            if (err) throw err;
                            else {
                                next()
                            }
                        });
                    });
                }
                else {
                    req.token = jsonwebToken.sign({ id: result.insertId }, constance.sign)
                    next()
                }
            })
    }
}

exports.delete_user = () => {
    return (req, res, next) => {
        db.query('DELETE user_information WHERE user_id=?',
            req.body.user_id, (err) => {
                if (err) throw err
                else {
                    next()
                }
            })
    }
}

exports.get_user = () => {
    return (req, res, next) => {
        let User_ID = req.user_id
        let sql = 'SELECT * From user_information WHERE user_id = ?'
        db.query(sql, User_ID, (err, result) => {
            if (err) throw err;
            else {
                result.map((element) => {
                    if (element.bank_information !== null && element.bank_information !== '') {
                        element.bank_information = JSON.parse(element.bank_information)
                    }
                })
                req.result = result[0]
                next()
            }
        })
    }
}

exports.show_user = () => {
    return (req, res, next) => {
        let data = ''
        let sql = 'SELECT * From user_information'
        db.query(sql, (err, result) => {
            if (err) throw err;

            else {
                data = {
                    ...result[0],
                    user_type: result[0].type_user
                }
                req.result = data
                next()
            }
        })
    }
}
exports.get_all_user = () => {
    return (req, res, next) => {
        let sql = 'SELECT * From user_information'
        db.query(sql, (err, result) => {
            if (err) throw err;
            else {
                req.result = result
                next()
            }
        })
    }
}