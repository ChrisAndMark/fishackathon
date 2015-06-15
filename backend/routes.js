var Boom = require('boom');
var User   = require('./model').User;
var config = require('../config/config');
var userRoutes = require('./controllers/user');
var vesselRoutes = require('./controllers/vessel');
var claimRoutes = require('./controllers/claim');
var jwt = require('jsonwebtoken');

var routes = [
  {
    method : ['GET', 'POST'],
    path   : '/api/v1/login',
    handler : function(request, reply){
      User.findOne({ email: request.payload.username }, function(err, user) {
        if (err) throw err;
        // test a matching password
        user.comparePassword(request.payload.pass, function(err, isMatch) {
          if (err) throw err;
          if (!isMatch){
            reply(Boom.unauthorized('Invalid password'));
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
  },
  {
    method : 'GET',
    path   : '/api/v1/test',
    config: {
      auth: {
          strategy: 'token',
      }
    },
    handler : function(request, reply){
      reply("HI");
    }

  }
];
routes.push(userRoutes.getUser);
routes.push(userRoutes.createUser);
routes.push(userRoutes.updateUser);
routes.push(vesselRoutes.createVessel);
routes.push(vesselRoutes.updateVessel);
routes.push(vesselRoutes.getVessels);
routes.push(vesselRoutes.getVessel);
routes.push(claimRoutes.createClaim);

console.log(routes);
module.exports = routes;