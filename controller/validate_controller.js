var errorMessage = require('../const/error_message')
var jsonwebToken = require('jsonwebtoken')
var constance = require('../const/constance')

exports.validate_user_register=()=>{
    return(req,res,next)=>{
        if(req.body.username&&
            req.body.password&&
            req.body.role){
                next();
            }
        else{
            res.status(200).json(errorMessage.invalid_data)
        }
    }
}

exports.validate_user_login = () =>{
    return (req,res,next)=>{
        if (req.body.username&&
            req.body.password){
                next();
            }
        else{
            res.status(200).json(errorMessage.invalid_data)
        }
    }
}

exports.validate_user_update_password = () =>{
  return(req,res,next)=>{
    if(req.body.password&&
        req.body.newpassword){
          next()
        }
        else{
          res.status(200).json(errorMessage.invalid_data)
        }
  }
}

exports.validate_user_update_data = () =>{
    return(req,res,next)=>{
        if(req.body.username&&
            req.body.name&&
            req.body.lastname&&
            req.body.address&&
            req.body.phone){
                next()
            }
        else{
            res.status(200).json(errorMessage.invalid_data)
        }
    }
}

exports.validate_show_product_info = () =>{
  return (req,res,next)=>{
      if (req.body.pro_id){
              next();
          }
      else{
          res.status(200).json(errorMessage.invalid_data)
      }
  }
}


exports.validate_add_product = () =>{
    return(req,res,next)=>{
      if(req.body.pro_name&&
         req.body.pro_cost&&
         req.body.pro_price&&
         req.body.pro_amount&&
         req.body.pro_details&&
         req.body.pro_status){
           next()
         }
      else{
        res.status(200).json(errorMessage.invalid_data)
      }
    }
}

exports.validate_update_product = () =>{
  return(req,res,next)=>{
    if(req.body.pro_id&&
       req.body.pro_name&&
       req.body.pro_cost&&
       req.body.pro_price&&
       req.body.pro_amount&&
       req.body.pro_details&&
       req.body.pro_status){
         next()
       }
    else{
      res.status(200).json(errorMessage.invalid_data)
    }
  }
}



exports.validate_token_user = function () {
    return function (req, res, next) {
      // console.log(req.session.token)
      if (!Boolean(req.headers["authorization"])) {
        res.status(200).json({
          success: false,
          message: errorMessage.err_required_token
        });
      } else {
        // console.log("token")
        jsonwebToken.verify(
          req.headers.authorization,
          constance.sign,
          (err, decode) => {
            if (err) {
              // console.log(decode.type)
              res.status(200).json(errorMessage.err_required_fingerprint_token);
            } else {
                req.user_id = decode.id;
                next();
                
            }
          }
        );
      }
    };
  };