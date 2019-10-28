var mysql = require('mysql');

var con = mysql.createConnection({
    host: '103.253.72.69',
    user: 'OFSE_dev',
    password: '12345678',
    database: 'ofse'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected Success!!!");
});


module.exports = con;