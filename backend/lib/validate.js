var User   = require('../model').User;

var validate = function (decodedToken, callback) {
     // should be {accountId : 123}.
  credentials = { user: decodedToken.toString() };
  
  User.findOne({email: decodedToken}, function(err, user){
    if (user && !(user.session == null)){
      return callback(null, true, credentials);
    } else {
      return callback(null, false);
    }
  });
};

module.exports = {validate : validate}