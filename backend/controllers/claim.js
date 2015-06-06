Vessel = require('../model').Vessel
User = require('../model').User
Claims = require('../model').Claims
helper = require('../lib/helper')

var createClaim = {
  method  : 'POST',
  path    : '/api/v1/claim',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply) {

    User.findOne({email: request.auth.credentials.user}, function(err, user) {
      var claim = new Claims(); 
      claim.fisherygear = request.payload.fishing_gear;
      claim.targetSpecies = request.payload.fishing_gear;
      claim.datetime = request.payload.date_time; 
      claim.loc_long = request.payload.longtitude; 
      claim.loc_lat = request.payload.latitude; 
      claim.species = 
      claim.notes = request.payload.notes   

     



      console.log(user);
      user.vessels.push(vessel);
      vessel.save(function (err) {
        if (!err) {

            reply(vessel).created('/vessel/' + vessel._id);    // HTTP 201
        } else {
            console.log(err); // HTTP 403
            reply(err);
        }
      })
    })
  }
};
var updateClaim = {
  method  : ['POST', 'PUT'],
  path    : '/api/v1/claim/update',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply){

    reply('yooooo')
  }
};


module.exports = {createClaim: createClaim, updateClaim: updateClaim}