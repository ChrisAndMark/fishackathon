Vessel = require('../model').Vessel;
User = require('../model').User;
Claims = require('../model').Claims;
Species = require('../model').Species;
boom = require('boom');
var _ = require('lodash');

// Dummy JSON to use for testing
// {
// "vessel_id" : "557f9f83ef0bf0613415d2e8",
// "fishing_gear" : "rod",
// "target_species" : "blue whales", 
// "date_time" : "Sat Jun 06 2015 ", 
// "longtitude" : "-123.086700", 
// "latitude" : "49.321402", 
// "notes" : "THey died", 
//   "species": [{
//       "species_code": "100- Steller (northern) sea lion",
//       "injury_code": "14- Killed",
//       "number_inj": "100"
//   }], 
// "type": "intentional"
// }
var createClaim = {
  method  : 'POST',
  path    : '/api/v1/claim',
  config  : {
    auth : {
      strategy: 'token',
    },
    description: 'Posts a claim!',
    notes: "Post a claim using the following test json structure:" +
    "go to controllers/claims.js for JSON",
    tags: ['api', 'claims']
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
      });
     reply(claim);
    });
  }
};

var updateClaim = {
  method  : ['POST', 'PUT'],
  path    : '/api/v1/claim/update/{id}',
  config  : {
    auth : {
      strategy: 'token',
    },
    description: 'Updates a claim!',
    notes: "Post a claim update using the following test json structure:" +
    "go to controllers/claims.js for JSON",
    tags: ['api', 'claims']
  },
  handler : function (request, reply){
    if(request.params.id){
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

        claim = vessel.claims.id(request.params.id)
        claim.fisherygear = jsonPost.fishing_gear;
        claim.targetSpecies = jsonPost.target_species;
        claim.datetime = jsonPost.date_time;
        claim.loc_long = jsonPost.longtitude;
        claim.loc_lat = jsonPost.latitude;
        claim.notes = jsonPost.notes;
        claim.species = species;
        claim.type = jsonPost.type;
        user.save(function (err) {
          if (err) {
            if(err.name == "ValidationError"){
              console.log(err)
              return reply(boom.create(422, "Data Validation",  { timestamp: Date.now() }));
            } else {
              return reply(err);
            }
          } else {
            reply(claim);
          }
        });
      });
    }else {
     reply(boom.badRequest("No claim id passed"));
    }
  }
};


module.exports = {createClaim: createClaim, updateClaim: updateClaim };