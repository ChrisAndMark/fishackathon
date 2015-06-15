Vessel = require('../model').Vessel;
User = require('../model').User;
Claims = require('../model').Claims;
Species = require('../model').Species;
boom = require('boom');
var _ = require('lodash');

var createClaim = {
  method  : 'POST',
  path    : '/api/v1/claim',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply) {
   User.findOne({email: request.auth.credentials.user}, function(err, user){
      jsonPost = JSON.parse(request.payload);
      species = [];
      _(jsonPost.species).forEach(function(n) {
        var spec = new Species();

        spec.scode= n.species_code;
        spec.injurycode = n.injury_code;
        spec.numInjured = n.number_inj;

        species.push(spec);
      }).value();
      vessel = user.vessels.id(jsonPost.vessel_id);

      var claim = new Claims();
      claim.fisherygear = jsonPost.fishing_gear;
      claim.targetSpecies = jsonPost.target_species;
      claim.datetime = jsonPost.date_time;
      claim.loc_long = jsonPost.longtitude;
      claim.loc_lat = jsonPost.latitude;
      claim.notes = jsonPost.notes;
      claim.species = species;
      claim.type = jsonPost.type;
      vessel.claims.push(claim);
      user.save(function (err) {
        if (err) {
          if(err.name == "ValidationError"){
            return reply(boom.create(422, "Data Validation",  { timestamp: Date.now() }));
          } else {
            return reply(err);
          }
        }
      })
     reply(user)
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

    reply('Not implemented')
  }
};


module.exports = {createClaim: createClaim, updateClaim: updateClaim}