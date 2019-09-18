var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var port = 3003
var version = '/api/v1/'
var moment = require('moment')
var logger = require('morgan')
var fs = require('fs')
var path = require('path')


var mm = moment()
var date = mm.utc(7).format('DD-MM-YYYY')
var time = mm.utc(7).format('HH: mm: ss')
console.log(date, time)

// const { exec } = require('child_process');
// let dumpFile = 'dump.sql';	

// // Database connection settings.
// let exportFrom = {
// 	host: "localhost",
// 	user: "root",
// 	password: "",
// 	database: "abc_shop"
// }
// // Execute a MySQL Dump and redirect the output to the file in dumpFile variable.
// exec(`mysqldump -u${exportFrom.user} -p${exportFrom.password} -h${exportFrom.host} --compact ${exportFrom.database} > ${dumpFile}`, (err, stdout, stderr) => {
// 	if (err) { console.error(`exec error: ${err}`); return; }
// });




app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));



app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization, X-Access-Token')
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
});

app.use(logger('dev'))
var accessLogStream = fs.createWriteStream(path.join(__dirname, `logs`, `'${date}'.log`), { flags: 'a' })
var configlog = `[:date[iso]] [ip]: :remote-addr :remote-user [method]: :method [url]: :url HTTP/:http-version [status]: :status [response-time]: :response-time ms [client]: :user-agent`
app.use(logger(configlog, {
  stream: accessLogStream
}))

var show = require('./route/show_users')
var User = require('./route/User')
var product = require('./route/product')
var product_information = require('./route/product_information')
var trader = require('./route/trader')
var neutrally = require('./route/neutrally')

app.use(version + 'show', show)
app.use(version + 'user', User)
// app.use(version +'product',product)
app.use(version + 'product_information', product_information)
app.use(version + 'trader', trader)
app.use(version + 'neutrally', neutrally)


app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})