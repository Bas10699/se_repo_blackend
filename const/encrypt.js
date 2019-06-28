var bcrypt = require('bcryptjs');

exports.encrytp = function (password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}

