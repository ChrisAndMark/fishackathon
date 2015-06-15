User = require('../model').User;
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
    user.zip = parseInt(request.payload.zip, 10);
    user.save(function (err){
      if (!err) {
        reply();
      } else {
        console.log(err); // HTTP 403
        if(err.name == "ValidationError"){
          reply(boom.create(422, "Data Validation Error",  { timestamp: Date.now() }));
        }
      }
    });
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
    User.findOne({email: request.auth.credentials.user}, function(err, user){
      user.email = request.payload.email;
      user.password = request.payload.password;
      user.fname = request.payload.first_name;
      user.lname = request.payload.last_name;
      user.address = request.payload.addr;
      user.city = request.payload.city;
      user.state = request.payload.state;
      user.zip = parseInt(request.payload.zip, 10) ;
      user.save(function (err) {
        if (!err) {
          reply();
        } else {
          console.log(err); // HTTP 403
          if(err.name == "ValidationError"){
            reply(boom.create(422, "Data Validation Error",  { timestamp: Date.now() }));
          }
        }
      });
    });
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
    });
  }
};

var userExist = {
  method  : 'GET',
  path    : '/api/v1/user/{id?}',
  handler : function (request, reply){
    if (request.params.id){
      User.id(request.params.id);
      
    }
    reply(boom.badRequest("No id passed"));
  }
};



module.exports = {createUser: createUser, updateUser: updateUser, getUser: getUser, updateUser: updateUser};