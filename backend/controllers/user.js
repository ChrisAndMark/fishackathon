User = require('../model').User;
var Boom = require('boom');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');

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
        //console.log(err); // HTTP 403
        if(err.name == "ValidationError"){
          reply(Boom.create(422, "Data Validation Error",  { timestamp: Date.now() }));
        }
      }
    });
  },
  config: {
    description: 'User Creation',
    notes: "Creates user based on the following parameters:\n" +
    "email, password, first_name, last_name, addr, city, state, zip",
    tags: ['api', 'user']
  }
};

var updateUser = {
  method  : ['POST', 'PUT'],
  path    : '/api/v1/user/update',
  config  : {
    auth : {
      strategy: 'token',
    },
    description: 'User Updating',
    notes: "Updates user based on the following parameters:\n" +
    "email, password, first_name, last_name, addr, city, state, zip. If any not provided then it fails",
    tags: ['api', 'user']
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
            reply(Boom.create(422, "Data Validation Error",  { timestamp: Date.now() }));
          }
        }
      });
    });
  },
};

var getUser = {
  method  : 'GET',
  path    : '/api/v1/user',
  config  : {
    auth : {
      strategy: 'token',
    },
    description: 'User Info',
    notes: "Returns user info of currently logged in user",
    tags: ['api', 'user']
  },
  handler : function (request, reply){
    user = User.findOne({email: request.auth.credentials.user});
    // user.select("-vessels");
    // user.select("-password");
    // user.select("-session");
    // user.select("-_id");
    // user.select("-__v");
    user.exec(function (err, user){
      if(!err){
        reply(user);
      }else{
        reply(Boom.wrap(err));
      }

    });
  }
};

var userExist = {
  method  : 'GET',
  path    : '/api/v1/user/{email}',
  handler : function (request, reply){
    if (request.params.email){
      User.count({email: decodeURIComponent(request.params.email)}, function(err, count){
        if(count > 0){
          reply(Boom.conflict('User Exists'));
        } else {
          reply();
        }
      });
    }else {
      reply(Boom.badRequest("No email passed"));
    }
  },
  config: {
    description: 'User Exist!',
    notes: 'Returns 200 if user does not exist or a 409 if a user does exit',
    tags: ['api', 'user']
  }
};

var loginUser = {
    method : ['POST'],
    path   : '/api/v1/login',
    handler : function(request, reply){
      User.findOne({ email: request.payload.username }, function(err, user) {
        if (err) throw err;

        if (user === null) {
          reply(Boom.unauthorized('Invalid username or password'));
        }
        // test a matching password
        user.comparePassword(request.payload.pass, function(err, isMatch) {
          if (err) throw err;
          if (!isMatch){
            reply(Boom.unauthorized('Invalid username or password'));
          } else {
            var token = jwt.sign(user.email, config.pk);
            user.session = token;
            user.save(function (err) {
              if (err){
                console.log(err);
                reply(err);
              }
            });
            reply(token);
           // -> Password123: true
          }
        });
      });
    }
  };

  var logoutUser = {
    method : ['GET', 'POST'],
    path   : '/api/v1/logout',
    config  : {
      auth : {
        strategy: 'token',
      }
    },
    handler : function(request, reply){
      User.findOne({ email: request.auth.credentials.user}, function(err, user){
        request.auth.credentials = null;
        user.session = null;
        user.save(function(err){
          if(err){
            console.log(err);
            reply(Boom.notFound());
          }
        });
      });
      reply("logged out").code(200);
    }
  };



module.exports = {
  createUser: createUser,
  updateUser: updateUser,
  getUser: getUser,
  userExist: userExist,
  loginUser: loginUser,
  logoutUser: logoutUser
};