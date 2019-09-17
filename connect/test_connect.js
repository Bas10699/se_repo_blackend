var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'abc_shop'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected Success!!!");
});


module.exports = con;