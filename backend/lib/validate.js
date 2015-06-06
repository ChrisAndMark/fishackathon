var User   = require('../model').User;

var validate = function (decodedToken, callback) {

    console.log(decodedToken);  // should be {accountId : 123}.

    if (decodedToken) {
      console.log(decodedToken.toString());
    }

    user = User.find({email: decodedToken.email})

    if (!user) {
      return callback(null, false);
    }

    return callback(null, true, user);
};

module.exports = {validate : validate}