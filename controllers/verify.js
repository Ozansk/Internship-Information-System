const jwt = require("jsonwebtoken");

exports.verify = function (req, res, next) {
  let token = req.cookies.jwt

  //if there is no token stored in cookies, the request is unauthorized
  if (!token) {
    //console.log('Tokenless!');
    return 403;
  }
}