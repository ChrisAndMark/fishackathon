User = require('../model').User
helper = require('../lib/helper')
var boom = require('boom');

//Creates a user...
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
    user.save(function (err) {
      if (!err) {
        reply(user).created('/user/' + user._id);    // HTTP 201
      } else {
        console.log(err); // HTTP 403
        if(err.name == "ValidationError"){
          reply(boom.create(422, "Email already exists",  { timestamp: Date.now() }));
        }
      }
    })
  }
};

var updateUser = {
  method  : ['POST', 'PUT'],
  path    : '/api/v1/user/update',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply){
    reply(request.auth.credentials)
  }
};

var getUser = {
  method  : 'GET',
  path    : '/api/v1/user',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply){
    User.findOne({email: request.auth.credentials.user}, function(err, user){
      user_object = user.toObject();
      delete user_object.password;
      delete user_object.session;
      delete user_object._id;
      delete user_object.__v;
      delete user_object.vessels;
      reply(user_object);
    }
  )}
};



module.exports = {createUser: createUser, updateUser: updateUser, getUser: getUser}