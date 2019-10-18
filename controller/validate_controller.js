var errorMessages = require('../const/error_message')
var jsonwebToken = require('jsonwebtoken')
var constance = require('../const/constance')

exports.validate_user_register = () => {
  return (req, res, next) => {
    if (req.body.username &&
      req.body.password &&
      req.body.user_type &&
      req.body.name &&
      req.body.lastname &&
      req.body.address &&
      req.body.phone) {
      next();
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}

exports.validate_user_login = () => {
  return (req, res, next) => {
    if (req.body.username &&
      req.body.password) {
      next();
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}

exports.validate_user_update_password = () => {
  return (req, res, next) => {
    if (req.body.password &&
      req.body.newpassword) {
      next()
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}

exports.validate_user_update_data = () => {
  return (req, res, next) => {
    if (req.body.username &&
      req.body.name &&
      req.body.lastname &&
      req.body.address &&
      req.body.phone) {
      next()
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}

exports.validate_show_product_info = () => {
  return (req, res, next) => {
    if (req.body.pro_id) {
      next();
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}
exports.validate_add_cart = () => {
  return (req, res, next) => {
    if (req.body.plant_id &&
      req.body.amount) {
      next()
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}

exports.validate_add_product = () => {
  return (req, res, next) => {
    if (req.body.pro_name &&
      req.body.pro_cost &&
      req.body.pro_price &&
      req.body.pro_amount &&
      req.body.pro_details &&
      req.body.pro_status) {
      next()
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}
exports.validate_add_order = () => {
  return (req, res, next) => {
    if (req.body.address_send) {
      next()
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}
exports.validate_update_plant_stock = () => {
  return (req, res, next) => {
    // console.log(req.body)
    if (req.body.product_id &&
      req.body.product_name &&
      req.body.price) {
      next()
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}

exports.validate_add_invoice_neutrally = () => {
  return (req, res, next) => {
    console.log(req.body)
    if (req.body.order_id &&
      req.body.detail &&
      req.body.date_send
    ) {
      next()
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}

exports.validate_get_order_info = () => {
  return (req, res, next) => {
    console.log(req.body)
    if (req.body.order_id) {
      next()
    }
    else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}
exports.validate_add_proof_of_payment_trader = () => {
  return (req, res, next) => {
    if (req.body.order_id &&
      req.body.date_proof &&
      req.body.time_proof &&
      req.body.image_proof) {
      next()
    } else {
      res.status(200).json(errorMessages.invalid_data)
    }
  }
}
exports.validate_add_send_demand = () =>{
  return(req,res,next) => {
    if(req.body.product_name&&
      req.body.nutrient){
        next()
      }
      else{
        res.status(200).json(errorMessages.invalid_data)
      }
  }
}


exports.validate_token_user = function () {
  return function (req, res, next) {
    // console.log(req.session.token)
    if (!Boolean(req.headers["authorization"])) {
      res.status(200).json({
        success: false,
        message: errorMessages.err_required_token
      });
    } else {
      // console.log("token")
      jsonwebToken.verify(
        req.headers.authorization,
        constance.sign,
        (err, decode) => {
          if (err) {
            // console.log(decode.type)
            res.status(200).json(errorMessages.err_required_fingerprint_token);
          } else {
            req.user_id = decode.id;
            next();

          }
        }
      );
    }
  };
};

exports.validate_token_researcher = function () {
  return function (req, res, next) {
    // console.log(req.session.token)
    if (!Boolean(req.headers["authorization"])) {
      res.status(200).json({
        success: false,
        message: errorMessages.err_required_token
      });
    } else {
      // console.log("token")
      jsonwebToken.verify(
        req.headers.authorization,
        constance.sign,
        (err, decode) => {
          if (err) {
            res.status(200).json(errorMessages.err_required_fingerprint_token);
          } else {
            if (decode.type > 0) {
              req.user_id = decode.id;
              next();
            } else {
              // console.log(decode.type)
              res
                .status(200)
                .json(errorMessages.err_required_fingerprint_token);
            }
          }
        }
      );
    }
  };
};

exports.validate_token_trader = function () {
  return function (req, res, next) {
    // console.log(req.session.token)
    if (!Boolean(req.headers["authorization"])) {
      res.status(200).json({
        success: false,
        message: errorMessages.err_required_token
      });
    } else {
      // console.log("token")
      jsonwebToken.verify(
        req.headers.authorization,
        constance.sign,
        (err, decode) => {
          if (err) {
            res.status(200).json(errorMessages.err_required_fingerprint_token);
          } else {
            if (decode.type > 1) {
              req.user_id = decode.id;
              next();
            } else {
              // console.log(decode.type)
              res
                .status(200)
                .json(errorMessages.err_required_fingerprint_token);
            }
          }
        }
      );
    }
  };
};

exports.validate_token_se_small = () => {
  return (req, res, next) => {
    if (!Boolean(req.headers["authorization"])) {
      res.status(200).json({
        success: false,
        message: errorMessages.err_required_token
      })
    }
    else {
      jsonwebToken.verify(
        req.headers.authorization,
        constance.sign,
        (err, decode) => {
          if (err) {
            res.status(200).json(errorMessages.err_required_fingerprint_token)
          }
          else {
            if (decode.type > 2) {
              req.user_id = decode.id
              next()
            }
            else {
              console.log(decode.type)
              res
                .status(200)
                .json(errorMessages.err_required_fingerprint_token);
            }
          }
        }
      )
    }
  }
}

exports.validate_token_se = () => {
  return (req, res, next) => {
    if (!Boolean(req.headers["authorization"])) {
      res.status(200).json({
        success: false,
        message: errorMessages.err_required_token
      })
    }
    else {
      jsonwebToken.verify(req.headers.authorization,
        constance.sign,
        (err, decode) => {
          if (err) {
            res.status(200).json({
              success: false,
              message: errorMessages.err_required_fingerprint_token
            })
          }
          else {
            if (decode.type > 3) {
              req.user_id = decode.id
              next()
            }
            else {
              console.log('type : ', decode.type)
              res.status(200).json({
                success: false,
                message: errorMessages.err_required_fingerprint_token
              })
            }
          }
        })
    }
  }
}

exports.validate_token_admin = function () {
  return function (req, res, next) {
    // console.log(req.session.token)
    if (!Boolean(req.headers["authorization"])) {
      res.status(200).json({
        success: false,
        message: errorMessages.err_required_token
      });
    } else {
      // console.log("token")
      jsonwebToken.verify(
        req.headers.authorization,
        constance.sign,
        (err, decode) => {
          if (err) {
            // console.log(decode.type)
            res.status(200).json(errorMessages.err_required_fingerprint_token);
          } else {
            if (decode.type > 4) {
              req.user_id = decode.id;
              next();
            } else {
              console.log(decode.type)
              res
                .status(200)
                .json(errorMessages.err_required_fingerprint_token);
            }
          }
        }
      );
    }
  };
};