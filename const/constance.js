var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // your email
        pass: '' // your email password
    }
});
module.exports = {
    sign: 'secret',
    sign_admin: 'secretAdmin',
    server: '127.0.0.1:3003',
    ip: "http://127.0.0.1:3003/api/v1/",
    transporter:transporter,
    domain_name:'localhost:3000'
};
