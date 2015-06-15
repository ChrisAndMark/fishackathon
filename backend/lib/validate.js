var User   = require('../model').User;

var validate = function (decodedToken, callback) {
     // should be {accountId : 123}.
    credentials = { user: decodedToken.toString() };
    console.log(decodedToken);

    if (!credentials) {
      return callback(null, false);
    }

    return callback(null, true, credentials);
};

module.exports = {validate : validate}