 var jwt = require('jsonwebtoken');


 var user = function (token){
   
    return jwt.decode(token).replace(/^(Bearer \.)/,"");

 };

 module.exports = {user: user}