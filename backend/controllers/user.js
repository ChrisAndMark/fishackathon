User = require('../model').User

var createUser = {
  method  : 'POST',
  path    : '/api/v1/user',
  handler : function (request, reply) {
    var user = new User();
    user.email = request.payload.email;
    user.password = request.payload.password; 
    user.fname = request.payload.first_name;
    user.lname = request.payload.last_name;
    user.address = request.payload.addr;
    user.city = request.payload.city;
    user.state = request.payload.state;
    user.zip = parseInt(request.payload.zip);
    user.fisheryIdNo = parseInt(request.payload.fisher_id_number); 
    user.save(function (err) {
      if (!err) {

          reply(user).created('/user/' + user._id);    // HTTP 201
      } else {
          console.log(err); // HTTP 403
          reply(err);
      }
    })
  }
};

var updateUser = {
  method  : ['POST', 'PUT'],
  path    : '/api/v1/user/',
};